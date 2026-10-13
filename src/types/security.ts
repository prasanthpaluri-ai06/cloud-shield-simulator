export type AttackTypeId = 
  | 'normal'
  | 'sqli'
  | 'xss'
  | 'bruteforce'
  | 'ddos'
  | 'unauthorized'
  | 'portscan';

export type AttackCategory = 
  | 'Legitimate Traffic'
  | 'Web Application Attack'
  | 'Authentication Attack'
  | 'Availability Threat'
  | 'Access Control'
  | 'Reconnaissance';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WafAction = 'ALLOW' | 'BLOCK' | 'FLAG' | 'RATE_LIMIT';

export type FinalAction = 'ALLOW' | 'FLAG' | 'RATE_LIMIT' | 'BLOCK' | 'BLOCK_ALERT';

export type SimulationSpeed = 'fast' | 'normal' | 'demo';

export type PipelineStageId = 
  | 'attack'
  | 'waf'
  | 'ai'
  | 'lambda'
  | 'dynamodb'
  | 'cloudwatch'
  | 'sns'
  | 'response';

export type StageState = 'waiting' | 'processing' | 'completed' | 'threat' | 'bypassed' | 'error';

export interface AttackDefinition {
  id: AttackTypeId;
  name: string;
  category: AttackCategory;
  description: string;
  defaultEndpoint: string;
  defaultMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  defaultIntensity: 'Low' | 'Medium' | 'High';
  defaultRequestCount: number;
  samplePayload: string;
  ruleCode: string;
  primaryService: string;
  defaultSeverity: SeverityLevel;
  iconName: string;
}

export interface AttackConfig {
  attackType: AttackTypeId;
  sourceIp: string;
  targetEndpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  intensity: 'Low' | 'Medium' | 'High';
  requestCount: number;
  payload: string;
  speed: SimulationSpeed;
}

export interface SecurityEvent {
  eventId: string;
  timestamp: string;
  sourceIp: string;
  attackType: string;
  attackTypeId: AttackTypeId;
  target: string;
  method: string;
  payloadLabel: string;
  intensity: string;
  requestCount: number;
  wafRule: string;
  wafAction: WafAction;
  aiCategory: string;
  aiConfidence: number; // 0 - 100
  threatScore: number; // 0 - 100
  severity: SeverityLevel;
  aiReason: string[];
  recommendedAction: string;
  lambdaStatus: 'SUCCESS' | 'EXECUTED' | 'FAILED' | 'BYPASSED';
  storageStatus: 'STORED' | 'PENDING' | 'SKIPPED';
  monitoringStatus: 'UPDATED' | 'ANOMALY_RECORDED' | 'NORMAL';
  notificationStatus: 'SENT' | 'SUPPRESSED' | 'NOT_REQUIRED';
  finalAction: FinalAction;
  finalStatus: 'RESOLVED' | 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
}

export interface BlockedIP {
  ip: string;
  reason: string;
  attackType: string;
  firstDetected: string;
  lastDetected: string;
  threatScore: number;
  status: 'ACTIVE' | 'EXPIRED' | 'MANUALLY_REMOVED';
  eventCount: number;
}

export interface ServiceStatus {
  id: string;
  serviceName: string;
  awsEquivalent: string;
  status: 'ACTIVE' | 'PROCESSING' | 'ALERT' | 'STANDBY';
  eventCount: number;
  lastActivity: string;
  currentOperation: string;
  description: string;
  metricsLabel: string;
  metricsValue: string | number;
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  timeOffset: string; // e.g. "00:01.4"
  source: 'REQUEST' | 'WAF' | 'AI' | 'LAMBDA' | 'DYNAMODB' | 'CLOUDWATCH' | 'SNS' | 'RESPONSE';
  message: string;
  level: 'info' | 'warn' | 'threat' | 'success' | 'ai';
  details?: Record<string, any>;
}

export interface TimelineMilestone {
  timeOffset: string;
  stage: PipelineStageId;
  label: string;
  status: 'completed' | 'active' | 'threat' | 'waiting';
}

export interface PipelineStageInfo {
  id: PipelineStageId;
  title: string;
  subtitle: string;
  state: StageState;
  serviceIcon: string;
  outputSummary?: string;
  details?: string;
}

export interface NotificationAlert {
  id: string;
  timestamp: string;
  title: string;
  sourceIp: string;
  attackType: string;
  severity: SeverityLevel;
  threatScore: number;
  message: string;
  actionTaken: string;
  read: boolean;
}

export interface DashboardMetrics {
  totalRequests: number;
  blockedRequests: number;
  threatsDetected: number;
  criticalThreats: number;
  activeBlockedIps: number;
  systemHealth: '100% HEALTHY' | 'DEGRADED' | 'HIGH ALERT';
  requestsPerMinute: number;
  allowedRequests: number;
}
