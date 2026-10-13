import { SecurityEvent, NotificationAlert } from '../types/security';

export interface SnsPublishResult {
  messageId: string;
  topicArn: string;
  notificationAlert?: NotificationAlert;
  deliveredTo: string[];
}

export function publishSnsSecurityAlert(event: SecurityEvent): SnsPublishResult {
  const messageId = `msg-${Math.random().toString(36).substring(2, 10)}`;
  const topicArn = 'arn:aws:sns:us-east-1:123456789012:cloudshield-soc-critical-alerts';

  const shouldSendAlert = event.severity === 'CRITICAL' || event.severity === 'HIGH';

  let notificationAlert: NotificationAlert | undefined = undefined;

  if (shouldSendAlert) {
    notificationAlert = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toTimeString().slice(0, 8),
      title: `🚨 ${event.severity} ALERT: ${event.attackType} Detected`,
      sourceIp: event.sourceIp,
      attackType: event.attackType,
      severity: event.severity,
      threatScore: event.threatScore,
      message: `AI Engine scored threat at ${event.threatScore}/100. WAF matched rule ${event.wafRule}. Action: ${event.finalAction}. Target: ${event.target}`,
      actionTaken: event.finalAction === 'BLOCK_ALERT' || event.finalAction === 'BLOCK' ? 'SOURCE BLOCKED & LOGGED' : 'RATE-LIMITED & MONITORED',
      read: false
    };
  }

  return {
    messageId,
    topicArn,
    notificationAlert,
    deliveredTo: ['soc-lead@company.local', 'pagerduty-webhook', 'security-slack-channel']
  };
}
