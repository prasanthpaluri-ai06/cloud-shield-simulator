import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { 
  SecurityEvent, 
  BlockedIP, 
  ServiceStatus, 
  DashboardMetrics, 
  NotificationAlert, 
  AttackConfig, 
  AttackTypeId,
  SimulationLog,
  TimelineMilestone,
  PipelineStageId
} from '../types/security';
import { 
  INITIAL_EVENTS, 
  INITIAL_BLOCKED_IPS, 
  INITIAL_SERVICES, 
  INITIAL_METRICS, 
  INITIAL_NOTIFICATIONS 
} from '../simulation/seedData';
import { ATTACK_DEFINITIONS } from '../simulation/attackDefinitions';
import { 
  SimulationState, 
  INITIAL_SIMULATION_STATE, 
  INITIAL_STAGES, 
  getStageDelay, 
  formatTimeOffset 
} from '../simulation/simulationEngine';
import { inspectRequestWithWaf } from '../simulation/wafSimulator';
import { analyzeThreatWithAi } from '../simulation/aiThreatEngine';
import { executeLambdaSecurityProcessor } from '../simulation/lambdaSimulator';
import { saveSecurityEventToDynamoDb } from '../simulation/dynamoDbSimulator';
import { recordCloudWatchMetrics } from '../simulation/cloudWatchSimulator';
import { publishSnsSecurityAlert } from '../simulation/snsSimulator';

interface SecurityContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Single Source of Truth Datasets
  events: SecurityEvent[];
  blockedIps: BlockedIP[];
  services: Record<string, ServiceStatus>;
  metrics: DashboardMetrics;
  notifications: NotificationAlert[];
  unreadNotificationCount: number;

  // Attack Configuration
  attackConfig: AttackConfig;
  setAttackConfig: React.Dispatch<React.SetStateAction<AttackConfig>>;
  selectAttackType: (typeId: AttackTypeId) => void;

  // Active Simulation State
  simulation: SimulationState;
  launchSimulation: (overrideConfig?: Partial<AttackConfig>) => Promise<void>;
  stopSimulation: () => void;
  resetSimulator: () => void;
  clearLogs: () => void;

  // IP Blocklist Actions
  unblockIp: (ip: string) => void;
  blockIpManual: (ip: string, reason: string) => void;

  // Notifications
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Modals / Inspectors
  selectedServiceModal: ServiceStatus | null;
  setSelectedServiceModal: (service: ServiceStatus | null) => void;
  selectedIpModal: BlockedIP | null;
  setSelectedIpModal: (ip: BlockedIP | null) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const DEFAULT_ATTACK_CONFIG: AttackConfig = {
  attackType: 'sqli',
  sourceIp: '198.51.100.42',
  targetEndpoint: '/login',
  method: 'POST',
  intensity: 'Medium',
  requestCount: 1,
  payload: "' OR '1'='1' -- admin UNION SELECT username, password_hash FROM users;",
  speed: 'normal'
};

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [blockedIps, setBlockedIps] = useState<BlockedIP[]>(INITIAL_BLOCKED_IPS);
  const [services, setServices] = useState<Record<string, ServiceStatus>>(INITIAL_SERVICES);
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);

  const [attackConfig, setAttackConfig] = useState<AttackConfig>(DEFAULT_ATTACK_CONFIG);
  const [simulation, setSimulation] = useState<SimulationState>(INITIAL_SIMULATION_STATE);

  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceStatus | null>(null);
  const [selectedIpModal, setSelectedIpModal] = useState<BlockedIP | null>(null);

  // Cancellation token for active simulation
  const isCancelledRef = useRef<boolean>(false);
  const simulationTimeoutsRef = useRef<number[]>([]);

  const selectAttackType = (typeId: AttackTypeId) => {
    const def = ATTACK_DEFINITIONS[typeId];
    if (!def) return;

    // Randomize source IP slightly if not normal, or choose clean
    let generatedIp = '198.51.100.' + (Math.floor(Math.random() * 200) + 10);
    if (typeId === 'normal') {
      generatedIp = '192.168.1.' + (Math.floor(Math.random() * 100) + 50);
    }

    setAttackConfig(prev => ({
      ...prev,
      attackType: typeId,
      sourceIp: generatedIp,
      targetEndpoint: def.defaultEndpoint,
      method: def.defaultMethod,
      intensity: def.defaultIntensity,
      requestCount: def.defaultRequestCount,
      payload: def.samplePayload
    }));
  };

  const stopSimulation = () => {
    isCancelledRef.current = true;
    simulationTimeoutsRef.current.forEach(t => clearTimeout(t));
    simulationTimeoutsRef.current = [];

    setSimulation(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentStageId: null,
      error: 'Simulation stopped by user'
    }));

    // Reset services status back to active
    setServices(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k] = { ...updated[k], status: 'ACTIVE', currentOperation: 'Standby / Monitoring' };
      });
      return updated;
    });
  };

  const resetSimulator = () => {
    stopSimulation();
    setEvents(INITIAL_EVENTS);
    setBlockedIps(INITIAL_BLOCKED_IPS);
    setServices(INITIAL_SERVICES);
    setMetrics(INITIAL_METRICS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSimulation(INITIAL_SIMULATION_STATE);
    setAttackConfig(DEFAULT_ATTACK_CONFIG);
  };

  const clearLogs = () => {
    setSimulation(prev => ({ ...prev, logs: [], timeline: [] }));
  };

  const unblockIp = (ip: string) => {
    setBlockedIps(prev => prev.filter(b => b.ip !== ip));
    setMetrics(prev => ({
      ...prev,
      activeBlockedIps: Math.max(0, prev.activeBlockedIps - 1)
    }));
    
    // Add info notification
    const unblockNotif: NotificationAlert = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toTimeString().slice(0, 8),
      title: `ℹ️ IP Unblocked: ${ip}`,
      sourceIp: ip,
      attackType: 'Manual SOC Action',
      severity: 'LOW',
      threatScore: 0,
      message: `Simulator state updated: IP ${ip} has been removed from the active AWS WAF blocklist.`,
      actionTaken: 'SIMULATOR STATE CLEARED',
      read: false
    };
    setNotifications(prev => [unblockNotif, ...prev]);
  };

  const blockIpManual = (ip: string, reason: string) => {
    if (blockedIps.some(b => b.ip === ip)) return;

    const newBlocked: BlockedIP = {
      ip,
      reason,
      attackType: 'Manual SOC Operator Rule',
      firstDetected: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastDetected: new Date().toISOString().replace('T', ' ').substring(0, 19),
      threatScore: 85,
      status: 'ACTIVE',
      eventCount: 1
    };

    setBlockedIps(prev => [newBlocked, ...prev]);
    setMetrics(prev => ({
      ...prev,
      activeBlockedIps: prev.activeBlockedIps + 1
    }));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // The central asynchronous simulation execution workflow
  const launchSimulation = async (overrideConfig?: Partial<AttackConfig>) => {
    if (simulation.isRunning) {
      return; // Prevent duplicate concurrent runs
    }

    const currentConfig: AttackConfig = {
      ...attackConfig,
      ...(overrideConfig || {})
    };

    isCancelledRef.current = false;
    simulationTimeoutsRef.current = [];

    const startTime = Date.now();
    const speed = currentConfig.speed || 'normal';

    // Reset pipeline visual nodes to initial clean waiting states
    const resetStages: Record<PipelineStageId, any> = { ...INITIAL_STAGES };
    Object.keys(resetStages).forEach(k => {
      resetStages[k as PipelineStageId] = {
        ...INITIAL_STAGES[k as PipelineStageId],
        state: 'waiting',
        outputSummary: undefined
      };
    });

    setSimulation({
      isRunning: true,
      isPaused: false,
      progress: 0,
      currentStageId: 'attack',
      stages: resetStages,
      logs: [],
      timeline: [],
      wafResult: null,
      aiResult: null,
      lambdaResult: null,
      finalEvent: null,
      newBlockedIp: null,
      newNotification: null,
      error: null
    });

    const addLog = (
      source: SimulationLog['source'],
      message: string,
      level: SimulationLog['level'],
      details?: Record<string, any>
    ) => {
      const elapsed = Date.now() - startTime;
      const logItem: SimulationLog = {
        id: `log-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString().substring(11, 23),
        timeOffset: formatTimeOffset(elapsed),
        source,
        message,
        level,
        details
      };
      setSimulation(prev => ({ ...prev, logs: [...prev.logs, logItem] }));
    };

    const addTimeline = (
      stage: PipelineStageId,
      label: string,
      status: TimelineMilestone['status']
    ) => {
      const elapsed = Date.now() - startTime;
      const milestone: TimelineMilestone = {
        timeOffset: formatTimeOffset(elapsed),
        stage,
        label,
        status
      };
      setSimulation(prev => ({ ...prev, timeline: [...prev.timeline, milestone] }));
    };

    const sleep = (ms: number) => {
      return new Promise<void>((resolve) => {
        const timeout = window.setTimeout(() => {
          resolve();
        }, ms);
        simulationTimeoutsRef.current.push(timeout);
      });
    };

    try {
      // ==========================================
      // STAGE 0: ATTACK GENERATION
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'attack',
        progress: 10,
        stages: {
          ...prev.stages,
          attack: { ...prev.stages.attack, state: 'processing', outputSummary: 'Emitting synthetic request payload...' }
        }
      }));

      addLog('REQUEST', `Generating ${currentConfig.attackType.toUpperCase()} request targeting ${currentConfig.targetEndpoint}`, 'info', {
        sourceIp: currentConfig.sourceIp,
        method: currentConfig.method,
        intensity: currentConfig.intensity
      });
      addTimeline('attack', `${ATTACK_DEFINITIONS[currentConfig.attackType].name} generated`, 'active');

      await sleep(getStageDelay('attack', speed));
      if (isCancelledRef.current) return;

      setSimulation(prev => ({
        ...prev,
        stages: {
          ...prev.stages,
          attack: { ...prev.stages.attack, state: 'completed', outputSummary: `${currentConfig.method} ${currentConfig.targetEndpoint}` }
        }
      }));

      // ==========================================
      // STAGE 1: AWS WAF SIMULATION
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'waf',
        progress: 25,
        stages: {
          ...prev.stages,
          waf: { ...prev.stages.waf, state: 'processing', outputSummary: 'Evaluating Layer-7 inspection rules...' }
        }
      }));
      setServices(prev => ({
        ...prev,
        waf: { ...prev.waf, status: 'PROCESSING', currentOperation: `Inspecting request from ${currentConfig.sourceIp}` }
      }));

      addLog('WAF', `Evaluating ACL ruleset against payload from ${currentConfig.sourceIp}`, 'info');
      addTimeline('waf', 'AWS WAF inspection started', 'active');

      await sleep(getStageDelay('waf', speed));
      if (isCancelledRef.current) return;

      const wafResult = inspectRequestWithWaf(currentConfig);
      const isMalicious = wafResult.isMalicious;

      setSimulation(prev => ({
        ...prev,
        wafResult,
        stages: {
          ...prev.stages,
          waf: { 
            ...prev.stages.waf, 
            state: isMalicious ? 'threat' : 'completed', 
            outputSummary: `${wafResult.ruleMatched} → ${wafResult.action}` 
          }
        }
      }));

      addLog(
        'WAF', 
        `Rule ${wafResult.ruleMatched} matched. Decision: ${wafResult.action}. ${wafResult.reason}`,
        isMalicious ? 'threat' : 'success'
      );
      addTimeline('waf', isMalicious ? `Rule ${wafResult.ruleMatched} triggered [${wafResult.action}]` : 'WAF check passed (ALLOW)', isMalicious ? 'threat' : 'completed');

      // ==========================================
      // STAGE 2: AI THREAT ANALYSIS (SPECIAL ENHANCEMENT)
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'ai',
        progress: 40,
        stages: {
          ...prev.stages,
          ai: { ...prev.stages.ai, state: 'processing', outputSummary: 'Executing heuristic risk synthesis & scoring...' }
        }
      }));
      setServices(prev => ({
        ...prev,
        ai: { ...prev.ai, status: 'PROCESSING', currentOperation: 'Computing multi-factor anomaly embeddings' }
      }));

      addLog('AI', 'Invoking AI Threat Analysis Engine for deep behavioral classification...', 'ai');
      addTimeline('ai', 'AI threat modeling initiated', 'active');

      await sleep(getStageDelay('ai', speed));
      if (isCancelledRef.current) return;

      const aiResult = analyzeThreatWithAi(currentConfig, wafResult);

      setSimulation(prev => ({
        ...prev,
        aiResult,
        stages: {
          ...prev.stages,
          ai: { 
            ...prev.stages.ai, 
            state: aiResult.severity === 'CRITICAL' || aiResult.severity === 'HIGH' ? 'threat' : 'completed', 
            outputSummary: `${aiResult.severity} (${aiResult.threatScore}/100) - ${aiResult.confidence}% confidence` 
          }
        }
      }));

      addLog(
        'AI', 
        `Classification: ${aiResult.threatCategory} | Severity: ${aiResult.severity} | Score: ${aiResult.threatScore}/100 | Confidence: ${aiResult.confidence}%`,
        aiResult.severity === 'CRITICAL' || aiResult.severity === 'HIGH' ? 'threat' : 'ai'
      );
      addTimeline('ai', `AI scored: ${aiResult.severity} (${aiResult.threatScore}/100)`, aiResult.severity === 'CRITICAL' ? 'threat' : 'completed');

      // ==========================================
      // STAGE 3: AWS LAMBDA SIMULATION
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'lambda',
        progress: 55,
        stages: {
          ...prev.stages,
          lambda: { ...prev.stages.lambda, state: 'processing', outputSummary: 'Triggering processSecurityEvent function...' }
        }
      }));
      setServices(prev => ({
        ...prev,
        lambda: { ...prev.lambda, status: 'PROCESSING', currentOperation: 'Executing serverless remediation dispatch' }
      }));

      addLog('LAMBDA', 'Triggering serverless workflow `processSecurityEvent`', 'info');
      addTimeline('lambda', 'AWS Lambda invoked', 'active');

      await sleep(getStageDelay('lambda', speed));
      if (isCancelledRef.current) return;

      const lambdaResult = executeLambdaSecurityProcessor(currentConfig, wafResult, aiResult);

      setSimulation(prev => ({
        ...prev,
        lambdaResult,
        stages: {
          ...prev.stages,
          lambda: { 
            ...prev.stages.lambda, 
            state: 'completed', 
            outputSummary: `processSecurityEvent completed (${lambdaResult.durationMs}ms)` 
          }
        }
      }));

      addLog('LAMBDA', `Execution ${lambdaResult.status}: Processed event ${lambdaResult.securityEvent.eventId} in ${lambdaResult.durationMs}ms`, 'success');
      addTimeline('lambda', `Lambda completed (${lambdaResult.durationMs}ms)`, 'completed');

      // ==========================================
      // STAGE 4: DYNAMODB SIMULATION
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'dynamodb',
        progress: 70,
        stages: {
          ...prev.stages,
          dynamodb: { ...prev.stages.dynamodb, state: 'processing', outputSummary: 'Writing item to CloudShield_SecurityEvents...' }
        }
      }));
      setServices(prev => ({
        ...prev,
        dynamodb: { ...prev.dynamodb, status: 'PROCESSING', currentOperation: 'PutItem into CloudShield_SecurityEvents table' }
      }));

      addLog('DYNAMODB', `Executing PutItem for ${lambdaResult.securityEvent.eventId} with TTL and attributes`, 'info');
      addTimeline('dynamodb', 'Storing security record in DynamoDB', 'active');

      await sleep(getStageDelay('dynamodb', speed));
      if (isCancelledRef.current) return;

      saveSecurityEventToDynamoDb(lambdaResult.securityEvent);

      setSimulation(prev => ({
        ...prev,
        stages: {
          ...prev.stages,
          dynamodb: { 
            ...prev.stages.dynamodb, 
            state: 'completed', 
            outputSummary: `Item ${lambdaResult.securityEvent.eventId} saved` 
          }
        }
      }));

      addLog('DYNAMODB', `Successfully persisted record ${lambdaResult.securityEvent.eventId} (Consumed Capacity: 1.0 WCU)`, 'success');
      addTimeline('dynamodb', `DynamoDB PutItem OK (${lambdaResult.securityEvent.eventId})`, 'completed');

      // ==========================================
      // STAGE 5: CLOUDWATCH SIMULATION
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'cloudwatch',
        progress: 80,
        stages: {
          ...prev.stages,
          cloudwatch: { ...prev.stages.cloudwatch, state: 'processing', outputSummary: 'Publishing metric datum & evaluating alarms...' }
        }
      }));
      setServices(prev => ({
        ...prev,
        cloudwatch: { ...prev.cloudwatch, status: 'PROCESSING', currentOperation: 'Publishing CloudShield/SecurityPipeline metric stream' }
      }));

      addLog('CLOUDWATCH', 'Streaming telemetry: RequestsProcessed, ThreatsBlocked, ThreatScoreAnomaly', 'info');
      addTimeline('cloudwatch', 'Publishing CloudWatch metrics', 'active');

      await sleep(getStageDelay('cloudwatch', speed));
      if (isCancelledRef.current) return;

      recordCloudWatchMetrics(lambdaResult.securityEvent);

      setSimulation(prev => ({
        ...prev,
        stages: {
          ...prev.stages,
          cloudwatch: { 
            ...prev.stages.cloudwatch, 
            state: 'completed', 
            outputSummary: isMalicious ? 'Metrics updated & Alarm evaluated' : 'Standard metrics recorded' 
          }
        }
      }));

      addLog('CLOUDWATCH', `Metric stream updated. Namespace: CloudShield/SecurityPipeline`, 'success');
      addTimeline('cloudwatch', 'CloudWatch metrics & logs updated', 'completed');

      // ==========================================
      // STAGE 6: SNS SIMULATION
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'sns',
        progress: 90,
        stages: {
          ...prev.stages,
          sns: { ...prev.stages.sns, state: 'processing', outputSummary: 'Evaluating subscriber notification triggers...' }
        }
      }));
      setServices(prev => ({
        ...prev,
        sns: { ...prev.sns, status: 'PROCESSING', currentOperation: 'Publishing to cloudshield-soc-critical-alerts' }
      }));

      addLog('SNS', 'Checking event severity against SNS subscription filter policies...', 'info');
      addTimeline('sns', 'Evaluating SNS alert topic', 'active');

      await sleep(getStageDelay('sns', speed));
      if (isCancelledRef.current) return;

      const snsResult = publishSnsSecurityAlert(lambdaResult.securityEvent);

      setSimulation(prev => ({
        ...prev,
        newNotification: snsResult.notificationAlert || null,
        stages: {
          ...prev.stages,
          sns: { 
            ...prev.stages.sns, 
            state: snsResult.notificationAlert ? 'threat' : 'completed', 
            outputSummary: snsResult.notificationAlert ? `Alert dispatched to ${snsResult.deliveredTo.length} endpoints` : 'No alert required for low-risk traffic' 
          }
        }
      }));

      if (snsResult.notificationAlert) {
        addLog('SNS', `High-priority notification dispatched: "${snsResult.notificationAlert.title}"`, 'threat');
        addTimeline('sns', 'SNS Critical Security Alert sent', 'threat');
      } else {
        addLog('SNS', 'Notification suppressed: Risk level within acceptable tolerance threshold', 'info');
        addTimeline('sns', 'SNS notification bypassed (Low risk)', 'completed');
      }

      // ==========================================
      // STAGE 7: SECURITY RESPONSE & ENFORCEMENT
      // ==========================================
      setSimulation(prev => ({
        ...prev,
        currentStageId: 'response',
        progress: 98,
        stages: {
          ...prev.stages,
          response: { ...prev.stages.response, state: 'processing', outputSummary: 'Enforcing final mitigation policy...' }
        }
      }));

      addLog('RESPONSE', `Applying final security mitigation policy: ${lambdaResult.securityEvent.finalAction}`, 'info');
      addTimeline('response', `Enforcing ${lambdaResult.securityEvent.finalAction}`, 'active');

      await sleep(getStageDelay('response', speed));
      if (isCancelledRef.current) return;

      // Handle IP Blocklist addition if threat warrants it
      let addedBlockedIp: BlockedIP | null = null;
      if (lambdaResult.shouldBlockIp) {
        addedBlockedIp = {
          ip: currentConfig.sourceIp,
          reason: `${aiResult.threatCategory} detected on ${currentConfig.targetEndpoint}`,
          attackType: currentConfig.attackType.toUpperCase(),
          firstDetected: new Date().toISOString().replace('T', ' ').substring(0, 19),
          lastDetected: new Date().toISOString().replace('T', ' ').substring(0, 19),
          threatScore: aiResult.threatScore,
          status: 'ACTIVE',
          eventCount: 1
        };

        setBlockedIps(prev => {
          const existingIndex = prev.findIndex(b => b.ip === currentConfig.sourceIp);
          if (existingIndex >= 0) {
            const copy = [...prev];
            copy[existingIndex] = {
              ...copy[existingIndex],
              lastDetected: new Date().toISOString().replace('T', ' ').substring(0, 19),
              eventCount: copy[existingIndex].eventCount + 1,
              threatScore: Math.max(copy[existingIndex].threatScore, aiResult.threatScore)
            };
            return copy;
          }
          return [addedBlockedIp!, ...prev];
        });
      }

      // Push notification if created
      if (snsResult.notificationAlert) {
        setNotifications(prev => [snsResult.notificationAlert!, ...prev]);
      }

      // Push event into unified history
      setEvents(prev => [lambdaResult.securityEvent, ...prev]);

      // Update aggregate metrics
      setMetrics(prev => {
        const isBlock = lambdaResult.securityEvent.finalAction === 'BLOCK' || lambdaResult.securityEvent.finalAction === 'BLOCK_ALERT';
        return {
          ...prev,
          totalRequests: prev.totalRequests + (currentConfig.requestCount || 1),
          blockedRequests: isBlock ? prev.blockedRequests + 1 : prev.blockedRequests,
          allowedRequests: !isMalicious ? prev.allowedRequests + 1 : prev.allowedRequests,
          threatsDetected: isMalicious ? prev.threatsDetected + 1 : prev.threatsDetected,
          criticalThreats: aiResult.severity === 'CRITICAL' ? prev.criticalThreats + 1 : prev.criticalThreats,
          activeBlockedIps: lambdaResult.shouldBlockIp && !blockedIps.some(b => b.ip === currentConfig.sourceIp)
            ? prev.activeBlockedIps + 1
            : prev.activeBlockedIps
        };
      });

      // Update Service status back to active with bumped counters
      setServices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(k => {
          updated[k] = {
            ...updated[k],
            status: 'ACTIVE',
            eventCount: updated[k].eventCount + 1,
            lastActivity: 'Just now',
            currentOperation: 'Standby / Continuous Monitoring'
          };
        });
        return updated;
      });

      setSimulation(prev => ({
        ...prev,
        isRunning: false,
        progress: 100,
        currentStageId: 'response',
        finalEvent: lambdaResult.securityEvent,
        newBlockedIp: addedBlockedIp,
        stages: {
          ...prev.stages,
          response: { 
            ...prev.stages.response, 
            state: isMalicious ? 'threat' : 'completed', 
            outputSummary: `Action enforced: ${lambdaResult.securityEvent.finalAction} (${lambdaResult.securityEvent.finalStatus})` 
          }
        }
      }));

      addLog(
        'RESPONSE', 
        `Simulation lifecycle complete. Final Status: ${lambdaResult.securityEvent.finalStatus}. Event ${lambdaResult.securityEvent.eventId} stored in DynamoDB.`,
        isMalicious ? 'threat' : 'success'
      );
      addTimeline('response', `Simulation complete [${lambdaResult.securityEvent.finalStatus}]`, 'completed');

    } catch (err: any) {
      console.error('Simulation error:', err);
      setSimulation(prev => ({
        ...prev,
        isRunning: false,
        error: err?.message || 'Unexpected simulation execution error'
      }));
    }
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <SecurityContext.Provider
      value={{
        activeTab,
        setActiveTab,
        events,
        blockedIps,
        services,
        metrics,
        notifications,
        unreadNotificationCount,
        attackConfig,
        setAttackConfig,
        selectAttackType,
        simulation,
        launchSimulation,
        stopSimulation,
        resetSimulator,
        clearLogs,
        unblockIp,
        blockIpManual,
        dismissNotification,
        markAllNotificationsRead,
        selectedServiceModal,
        setSelectedServiceModal,
        selectedIpModal,
        setSelectedIpModal
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
