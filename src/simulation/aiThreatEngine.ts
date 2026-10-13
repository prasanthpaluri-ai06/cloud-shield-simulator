import { AttackConfig, SeverityLevel } from '../types/security';
import { WafInspectionResult } from './wafSimulator';

export interface AiAnalysisResult {
  threatCategory: string;
  confidence: number;
  threatScore: number;
  severity: SeverityLevel;
  reasoningChecklist: string[];
  summary: string;
  recommendedResponse: string;
}

export function analyzeThreatWithAi(config: AttackConfig, wafResult: WafInspectionResult): AiAnalysisResult {
  const { attackType, targetEndpoint, intensity, requestCount } = config;

  if (attackType === 'normal') {
    return {
      threatCategory: 'Benign Application Traffic',
      confidence: 99,
      threatScore: 4,
      severity: 'LOW',
      reasoningChecklist: [
        'Request matches expected baseline user behavioral profile',
        'Payload passes strict alphanumeric and schema validations',
        'No rate-limiting or velocity threshold anomalies detected',
        'Endpoint access matches standard user authorization scope'
      ],
      summary: 'Legitimate application request from authenticated/public user. No anomalous vectors identified.',
      recommendedResponse: 'ALLOW request through to backend application servers.'
    };
  }

  let baseScore = 50;
  let confidence = 90;
  let category = 'Web Application Attack';
  const checklist: string[] = [];

  // Intensity factor
  const intensityBoost = intensity === 'High' ? 12 : intensity === 'Medium' ? 6 : 0;

  switch (attackType) {
    case 'sqli':
      baseScore = 90 + Math.floor(Math.random() * 6);
      confidence = 96;
      category = 'SQL Injection (CWE-89)';
      checklist.push('Sensitive authentication/data endpoint targeted');
      checklist.push('Suspicious SQL syntax tokens (`UNION`, `--`, `OR 1=1`) detected in body');
      checklist.push('High probability of remote database exfiltration or authentication bypass attempt');
      checklist.push('Signature matches AWS-WAF-SQLI-001 Managed Rule set');
      break;

    case 'xss':
      baseScore = 78 + Math.floor(Math.random() * 8);
      confidence = 93;
      category = 'Cross-Site Scripting (CWE-79)';
      checklist.push('Executable client-side script tags (`<script>`, `onerror=`) identified');
      checklist.push('Reflected input vector without sanitization filter matching');
      checklist.push('Risk of session cookie theft or unauthorized DOM manipulation');
      checklist.push('Matches WAF cross-site scripting inspection filter');
      break;

    case 'bruteforce':
      baseScore = 74 + Math.min(20, Math.floor(requestCount * 0.8));
      confidence = 94;
      category = 'Authentication Credential Stuffing';
      checklist.push(`High velocity of failed authentication attempts (${requestCount} attempts in burst window)`);
      checklist.push('Identical source IP rotating credentials against login endpoint');
      checklist.push('Statistical deviation from regular human authentication latency');
      checklist.push('Potential account takeover risk identified');
      break;

    case 'ddos':
      baseScore = 88 + Math.floor(Math.random() * 8);
      confidence = 98;
      category = 'Layer-7 Volumetric Denial of Service';
      checklist.push(`Abnormal request volume spike (${requestCount} req/sec) exceeding 99th percentile baseline`);
      checklist.push('Rapid resource starvation pattern targeting backend compute thread pool');
      checklist.push('Synchronized burst characteristics without human pacing');
      checklist.push('Immediate availability threat to downstream services');
      break;

    case 'unauthorized':
      baseScore = 80 + Math.floor(Math.random() * 8);
      confidence = 95;
      category = 'Broken Access Control & Privilege Escalation';
      checklist.push('Direct access attempt to restricted administrative configuration endpoint');
      checklist.push('Missing or invalid cryptographically signed JWT / IAM role credentials');
      checklist.push('Potential internal network reconnaissance or lateral movement');
      checklist.push('Explicit violation of zero-trust security perimeter');
      break;

    case 'portscan':
      baseScore = 58 + Math.min(20, Math.floor(requestCount * 1.0));
      confidence = 91;
      category = 'Reconnaissance & Vulnerability Sweep';
      checklist.push('Systematic sequential probing across sensitive system configuration files');
      checklist.push('Multiple HTTP 404/403 triggers within short inspection interval');
      checklist.push('Behavior characteristic of automated scanner tools (e.g., Nikto, Gobuster)');
      checklist.push('Pre-attack attack-surface enumeration phase');
      break;
  }

  // Calculate final score bounded 0 - 100
  const finalScore = Math.min(100, Math.max(0, baseScore + intensityBoost));

  // Determine severity based on 0-24 (LOW), 25-49 (MEDIUM), 50-74 (HIGH), 75-100 (CRITICAL)
  let severity: SeverityLevel = 'LOW';
  if (finalScore >= 75) {
    severity = 'CRITICAL';
  } else if (finalScore >= 50) {
    severity = 'HIGH';
  } else if (finalScore >= 25) {
    severity = 'MEDIUM';
  }

  let recommendedResponse = 'FLAG request for SOC analyst review and rate-limit source.';
  if (severity === 'CRITICAL') {
    recommendedResponse = 'IMMEDIATE ISOLATION: Block source IP at WAF edge, persist security event to DynamoDB, and trigger SNS Critical Alert.';
  } else if (severity === 'HIGH') {
    recommendedResponse = 'BLOCK REQUEST: Apply WAF drop policy and track source IP reputation.';
  }

  return {
    threatCategory: category,
    confidence,
    threatScore: finalScore,
    severity,
    reasoningChecklist: checklist,
    summary: `AI Threat Model identified high-risk indicators matching ${category} directed at ${targetEndpoint}. Threat severity classified as ${severity}.`,
    recommendedResponse
  };
}
