import { AttackConfig, SecurityEvent, SeverityLevel, FinalAction } from '../types/security';
import { WafInspectionResult } from './wafSimulator';
import { AiAnalysisResult } from './aiThreatEngine';

export interface LambdaExecutionResult {
  functionName: string;
  executionId: string;
  durationMs: number;
  memoryUsedMb: number;
  status: 'SUCCESS' | 'EXECUTED' | 'FAILED' | 'BYPASSED';
  securityEvent: SecurityEvent;
  shouldBlockIp: boolean;
  shouldNotifySns: boolean;
  logOutput: string[];
}

export function executeLambdaSecurityProcessor(
  config: AttackConfig,
  wafResult: WafInspectionResult,
  aiResult: AiAnalysisResult
): LambdaExecutionResult {
  const executionId = `arn:aws:lambda:us-east-1:123456789012:function:processSecurityEvent:$LATEST-${Math.random().toString(36).substring(2, 8)}`;
  const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

  const durationMs = Math.floor(25 + Math.random() * 45);
  const memoryUsedMb = Math.floor(64 + Math.random() * 18);

  const isMalicious = wafResult.isMalicious;
  const isCritical = aiResult.severity === 'CRITICAL';
  const isHigh = aiResult.severity === 'HIGH';

  let finalAction: FinalAction = 'ALLOW';
  let finalStatus: 'RESOLVED' | 'BLOCKED' | 'FLAGGED' | 'ALLOWED' = 'ALLOWED';
  let shouldBlockIp = false;
  let shouldNotifySns = false;

  if (!isMalicious) {
    finalAction = 'ALLOW';
    finalStatus = 'ALLOWED';
  } else if (isCritical) {
    finalAction = 'BLOCK_ALERT';
    finalStatus = 'RESOLVED';
    shouldBlockIp = true;
    shouldNotifySns = true;
  } else if (isHigh) {
    finalAction = 'BLOCK';
    finalStatus = 'BLOCKED';
    shouldBlockIp = true;
    shouldNotifySns = true;
  } else if (config.attackType === 'ddos' || config.attackType === 'bruteforce') {
    finalAction = 'RATE_LIMIT';
    finalStatus = 'FLAGGED';
    shouldBlockIp = false;
    shouldNotifySns = true;
  } else {
    finalAction = 'FLAG';
    finalStatus = 'FLAGGED';
  }

  const securityEvent: SecurityEvent = {
    eventId,
    timestamp,
    sourceIp: config.sourceIp,
    attackType: aiResult.threatCategory.split(' (')[0],
    attackTypeId: config.attackType,
    target: config.targetEndpoint,
    method: config.method,
    payloadLabel: config.payload || 'Standard Request',
    intensity: config.intensity,
    requestCount: config.requestCount,
    wafRule: wafResult.ruleMatched,
    wafAction: wafResult.action,
    aiCategory: aiResult.threatCategory,
    aiConfidence: aiResult.confidence,
    threatScore: aiResult.threatScore,
    severity: aiResult.severity,
    aiReason: aiResult.reasoningChecklist,
    recommendedAction: aiResult.recommendedResponse,
    lambdaStatus: isMalicious ? 'SUCCESS' : 'BYPASSED',
    storageStatus: 'STORED',
    monitoringStatus: isMalicious ? 'ANOMALY_RECORDED' : 'NORMAL',
    notificationStatus: shouldNotifySns ? 'SENT' : (isMalicious ? 'SUPPRESSED' : 'NOT_REQUIRED'),
    finalAction,
    finalStatus
  };

  const logOutput = [
    `START RequestId: ${executionId}`,
    `[INFO] Lambda invoked with event payload from AWS WAF (Rule: ${wafResult.ruleMatched})`,
    `[INFO] AI Threat Engine evaluated risk score: ${aiResult.threatScore}/100 [${aiResult.severity}]`,
    `[INFO] Target endpoint sensitivity: ${config.targetEndpoint}`,
    isMalicious 
      ? `[WARN] Security threat confirmed. Enforcing action: ${finalAction}. DynamoDB record queued.`
      : `[INFO] Normal traffic verified. Bypassing active mitigation blocks.`,
    `END RequestId: ${executionId}`,
    `REPORT RequestId: ${executionId} Duration: ${durationMs} ms Billed Duration: 100 ms Memory Size: 128 MB Max Memory Used: ${memoryUsedMb} MB`
  ];

  return {
    functionName: 'processSecurityEvent',
    executionId,
    durationMs,
    memoryUsedMb,
    status: isMalicious ? 'SUCCESS' : 'BYPASSED',
    securityEvent,
    shouldBlockIp,
    shouldNotifySns,
    logOutput
  };
}
