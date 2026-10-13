import { AttackConfig, WafAction } from '../types/security';

export interface WafInspectionResult {
  ruleMatched: string;
  action: WafAction;
  reason: string;
  isMalicious: boolean;
  rateAnomalyDetected: boolean;
  sensitiveEndpointTargeted: boolean;
  patternDetected: string;
}

export function inspectRequestWithWaf(config: AttackConfig): WafInspectionResult {
  const { attackType, targetEndpoint, requestCount, payload } = config;

  const isSensitiveEndpoint = 
    targetEndpoint.includes('/admin') ||
    targetEndpoint.includes('/login') ||
    targetEndpoint.includes('/auth') ||
    targetEndpoint.includes('/.env') ||
    targetEndpoint.includes('/backup');

  if (attackType === 'normal') {
    return {
      ruleMatched: 'DEFAULT-ALLOW-001',
      action: 'ALLOW',
      reason: 'Standard HTTP request adheres to schema; no malicious signatures found',
      isMalicious: false,
      rateAnomalyDetected: false,
      sensitiveEndpointTargeted: isSensitiveEndpoint,
      patternDetected: 'Clean baseline payload'
    };
  }

  if (attackType === 'sqli') {
    return {
      ruleMatched: 'AWS-WAF-SQLI-001',
      action: 'BLOCK',
      reason: 'SQL syntax token pattern matched in query parameters/payload body',
      isMalicious: true,
      rateAnomalyDetected: requestCount > 10,
      sensitiveEndpointTargeted: isSensitiveEndpoint,
      patternDetected: "Classic OR '1'='1' injection syntax detected"
    };
  }

  if (attackType === 'xss') {
    return {
      ruleMatched: 'AWS-WAF-XSS-001',
      action: 'BLOCK',
      reason: 'Unsanitized HTML/JavaScript executable tag pattern detected in input field',
      isMalicious: true,
      rateAnomalyDetected: false,
      sensitiveEndpointTargeted: isSensitiveEndpoint,
      patternDetected: '<script> execution vector detected'
    };
  }

  if (attackType === 'bruteforce') {
    return {
      ruleMatched: 'AWS-WAF-AUTH-001',
      action: 'RATE_LIMIT',
      reason: `Rapid repetitive authentication requests detected (${requestCount} attempts in burst window)`,
      isMalicious: true,
      rateAnomalyDetected: true,
      sensitiveEndpointTargeted: true,
      patternDetected: 'Credential dictionary stuffing pattern'
    };
  }

  if (attackType === 'ddos') {
    return {
      ruleMatched: 'AWS-WAF-RATE-001',
      action: 'RATE_LIMIT',
      reason: `Volumetric rate-limit threshold exceeded (${requestCount} requests/sec from source IP)`,
      isMalicious: true,
      rateAnomalyDetected: true,
      sensitiveEndpointTargeted: isSensitiveEndpoint,
      patternDetected: 'Layer 7 HTTP Flood anomaly'
    };
  }

  if (attackType === 'unauthorized') {
    return {
      ruleMatched: 'AWS-WAF-ACCESS-001',
      action: 'BLOCK',
      reason: 'Attempted access to restricted administrative path without valid authorization signature',
      isMalicious: true,
      rateAnomalyDetected: false,
      sensitiveEndpointTargeted: true,
      patternDetected: 'Privilege boundary traversal probe'
    };
  }

  if (attackType === 'portscan') {
    return {
      ruleMatched: 'AWS-WAF-SCAN-001',
      action: 'FLAG',
      reason: 'Sequential route probing and discovery signatures detected from single host',
      isMalicious: true,
      rateAnomalyDetected: true,
      sensitiveEndpointTargeted: isSensitiveEndpoint,
      patternDetected: 'Automated vulnerability reconnaissance sweep'
    };
  }

  return {
    ruleMatched: 'AWS-WAF-CUSTOM-099',
    action: 'FLAG',
    reason: 'Generic rule evaluation flagged atypical traffic attributes',
    isMalicious: true,
    rateAnomalyDetected: false,
    sensitiveEndpointTargeted: isSensitiveEndpoint,
    patternDetected: payload
  };
}
