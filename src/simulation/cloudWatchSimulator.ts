import { SecurityEvent } from '../types/security';

export interface CloudWatchMetricDatum {
  metricName: string;
  namespace: string;
  value: number;
  unit: 'Count' | 'Percent' | 'Milliseconds';
  dimensions: { Name: string; Value: string }[];
}

export function recordCloudWatchMetrics(event: SecurityEvent): CloudWatchMetricDatum[] {
  const isMalicious = event.threatScore > 24;
  return [
    {
      metricName: 'RequestsProcessed',
      namespace: 'CloudShield/SecurityPipeline',
      value: event.requestCount || 1,
      unit: 'Count',
      dimensions: [{ Name: 'Service', Value: 'AWS/WAF' }]
    },
    {
      metricName: isMalicious ? 'ThreatsBlocked' : 'NormalRequests',
      namespace: 'CloudShield/SecurityPipeline',
      value: 1,
      unit: 'Count',
      dimensions: [{ Name: 'AttackType', Value: event.attackType }]
    },
    {
      metricName: 'ThreatScoreAnomaly',
      namespace: 'CloudShield/AIThreatEngine',
      value: event.threatScore,
      unit: 'Count',
      dimensions: [{ Name: 'Severity', Value: event.severity }]
    }
  ];
}
