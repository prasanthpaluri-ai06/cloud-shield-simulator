import { 
  AttackConfig, 
  PipelineStageId, 
  PipelineStageInfo, 
  SecurityEvent, 
  SimulationLog, 
  TimelineMilestone, 
  NotificationAlert, 
  BlockedIP 
} from '../types/security';
import { inspectRequestWithWaf, WafInspectionResult } from './wafSimulator';
import { analyzeThreatWithAi, AiAnalysisResult } from './aiThreatEngine';
import { executeLambdaSecurityProcessor, LambdaExecutionResult } from './lambdaSimulator';
import { saveSecurityEventToDynamoDb } from './dynamoDbSimulator';
import { recordCloudWatchMetrics } from './cloudWatchSimulator';
import { publishSnsSecurityAlert } from './snsSimulator';

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  progress: number; // 0 - 100
  currentStageId: PipelineStageId | null;
  stages: Record<PipelineStageId, PipelineStageInfo>;
  logs: SimulationLog[];
  timeline: TimelineMilestone[];
  wafResult: WafInspectionResult | null;
  aiResult: AiAnalysisResult | null;
  lambdaResult: LambdaExecutionResult | null;
  finalEvent: SecurityEvent | null;
  newBlockedIp: BlockedIP | null;
  newNotification: NotificationAlert | null;
  error: string | null;
}

export const INITIAL_STAGES: Record<PipelineStageId, PipelineStageInfo> = {
  attack: {
    id: 'attack',
    title: 'Controlled Request Generator',
    subtitle: 'Simulated Client Request',
    state: 'waiting',
    serviceIcon: 'Send',
    details: 'Generates safe synthetic HTTP payloads for evaluation'
  },
  waf: {
    id: 'waf',
    title: 'AWS WAF',
    subtitle: 'Web Application Firewall',
    state: 'waiting',
    serviceIcon: 'ShieldAlert',
    details: 'Inspects Layer 7 headers, query parameters, payloads, and rate thresholds'
  },
  ai: {
    id: 'ai',
    title: 'AI Threat Analysis',
    subtitle: 'Intelligent Risk Engine',
    state: 'waiting',
    serviceIcon: 'Cpu',
    details: 'Performs heuristic risk scoring, semantic threat modeling, and confidence analysis'
  },
  lambda: {
    id: 'lambda',
    title: 'AWS Lambda',
    subtitle: 'Serverless Security Handler',
    state: 'waiting',
    serviceIcon: 'Zap',
    details: 'Executes processSecurityEvent orchestration workflow in real-time'
  },
  dynamodb: {
    id: 'dynamodb',
    title: 'Amazon DynamoDB',
    subtitle: 'Security Event Store',
    state: 'waiting',
    serviceIcon: 'Database',
    details: 'Persists structured JSON security events in NoSQL storage table'
  },
  cloudwatch: {
    id: 'cloudwatch',
    title: 'Amazon CloudWatch',
    subtitle: 'Metrics & Observability',
    state: 'waiting',
    serviceIcon: 'LineChart',
    details: 'Publishes CloudWatch metrics, alarms, and rate-monitoring streams'
  },
  sns: {
    id: 'sns',
    title: 'Amazon SNS',
    subtitle: 'Notification Dispatcher',
    state: 'waiting',
    serviceIcon: 'Bell',
    details: 'Fans out high-priority security alerts to SOC incident responders'
  },
  response: {
    id: 'response',
    title: 'Security Enforcement',
    subtitle: 'Final Mitigation Response',
    state: 'waiting',
    serviceIcon: 'ShieldCheck',
    details: 'Applies final WAF drop policy, IP blocklist update, or traffic passage'
  }
};

export const INITIAL_SIMULATION_STATE: SimulationState = {
  isRunning: false,
  isPaused: false,
  progress: 0,
  currentStageId: null,
  stages: INITIAL_STAGES,
  logs: [],
  timeline: [],
  wafResult: null,
  aiResult: null,
  lambdaResult: null,
  finalEvent: null,
  newBlockedIp: null,
  newNotification: null,
  error: null
};

// Delays in ms by speed setting
const STAGE_DELAYS = {
  fast: {
    attack: 300,
    waf: 400,
    ai: 600,
    lambda: 350,
    dynamodb: 300,
    cloudwatch: 250,
    sns: 250,
    response: 300
  },
  normal: {
    attack: 700,
    waf: 800,
    ai: 1200,
    lambda: 800,
    dynamodb: 600,
    cloudwatch: 500,
    sns: 500,
    response: 700
  },
  demo: {
    attack: 1200,
    waf: 1400,
    ai: 2200,
    lambda: 1300,
    dynamodb: 1000,
    cloudwatch: 900,
    sns: 900,
    response: 1200
  }
};

export function getStageDelay(stage: PipelineStageId, speed: 'fast' | 'normal' | 'demo' = 'normal'): number {
  return STAGE_DELAYS[speed][stage];
}

export function formatTimeOffset(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
}
