# CloudShield — Cloud Security Attack Simulator
## Official Project Presentation Content (`prsnt.md`)

Use this document to prepare your presentation slides (PowerPoint / Google Slides / Canva / Keynote) or speak directly from these structured points during your review.

---

## Slide 1: Title & Introduction
- **Project Title:** CloudShield — Cloud Security Attack Simulator
- **Domain:** Cloud Architecture, Cybersecurity, SOC Operations & AI Threat Modeling
- **Presenter Name:** [Your Name]
- **Course / Degree:** Individual Cloud Computing & Security Project
- **Key Tagline:** *"Real-Time Visualization and AI-Enhanced Threat Lifecycle on AWS-Inspired Architecture"*

---

## Slide 2: Problem Statement & Motivation
- **The Challenge:**
  - Modern cloud applications face complex, multi-vector cyber attacks (SQL Injection, XSS, DDoS, Credential Stuffing).
  - Traditional perimeter firewalls rely on rigid, binary rules that lack contextual intelligence and explainability.
  - Understanding how cloud-native security services interact during an active breach is difficult without hands-on observability.
- **Our Solution:**
  - Build an interactive, real-time Cloud Security Attack Simulator and Security Operations Center (SOC) dashboard.
  - Simulate the end-to-end cloud security lifecycle modeled on core AWS services with zero external attack risk.
  - Introduce an AI-driven contextual threat analysis and risk scoring layer as the project's primary special enhancement.

---

## Slide 3: Cloud Architecture & Simulated AWS Ecosystem
- **Simulated AWS Services & Their Specific Roles:**
  1. **AWS WAF (Web Application Firewall):** Layer-7 traffic inspection, managed rule evaluation (`SQLI-001`, `XSS-001`, `AUTH-001`, `RATE-001`, `ACCESS-001`, `SCAN-001`), and IPSet drop policies.
  2. **AWS Lambda:** Serverless event-driven remediation (`processSecurityEvent`) orchestrating storage, metrics, and alerts.
  3. **Amazon DynamoDB:** High-throughput NoSQL database (`CloudShield_SecurityEvents`) storing structured audit records with full attribute retention.
  4. **Amazon CloudWatch:** Real-time metrics streaming (`CloudShield/SecurityPipeline`), anomaly detection, and alarm evaluation.
  5. **Amazon SNS (Simple Notification Service):** Pub/sub incident fanout topic (`cloudshield-soc-critical-alerts`) for high-priority security alerts.

---

## Slide 4: Architectural Flow Diagram
```
[ Incoming Synthetic Request ]
             │
             ▼
    ┌─────────────────┐
    │  AWS WAF Engine │ ──> Evaluates Layer-7 ACL rules
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ AI Threat Engine│ ──> Heuristic Risk Scoring (0–100) & Reasoning
    └────────┬────────┘     (🌟 SPECIAL ENHANCEMENT)
             │
             ▼
    ┌─────────────────┐
    │   AWS Lambda    │ ──> Serverless Remediation Orchestration
    └────────┬────────┘
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
[DynamoDB] [CloudWatch] [Amazon SNS]
(Event Store) (Metrics/Logs) (SOC Alerts)
     │       │       │
     └───────┼───────┘
             ▼
┌─────────────────────────┐
│ Final Security Response │ ──> BLOCK / RATE_LIMIT / ALLOW / IP Isolation
└─────────────────────────┘
```

---

## Slide 5: The Special Enhancement — AI Threat Intelligence Engine
- **Why Basic Rule Matching is Insufficient:**
  - Standard WAFs only answer: *"Does this string match regex `X`?"* (Binary True/False).
- **How CloudShield AI Enhances Security:**
  - **Multi-Factor Heuristic Analysis:** Synthesizes endpoint sensitivity, token semantics, request frequency, and velocity deviations.
  - **Deterministic Risk Scoring (0–100 Scale):**
    - `0 – 24` : **LOW** (Standard benign traffic)
    - `25 – 49` : **MEDIUM** (Reconnaissance / Port sweep)
    - `50 – 74` : **HIGH** (XSS, Credential brute force, Unauthorized access)
    - `75 – 100` : **CRITICAL** (Authentication SQLi, Layer-7 DDoS flood)
  - **Explainable Reasoning Checklist:** Answers *"Why was this classified?"* with human-readable rationale (e.g., authentication endpoint targeted, syntax tokens present, baseline exceeded).
  - **Confidence Metric:** Calculates statistical certainty percentage ($91\% - 99\%$).

---

## Slide 6: Supported Attack & Traffic Scenarios
| Scenario | Category | Matched Rule | AI Severity | Final Action |
| :--- | :--- | :--- | :--- | :--- |
| **Normal Request** | Legitimate Traffic | `DEFAULT-ALLOW-001` | **LOW (4/100)** | `ALLOW` |
| **SQL Injection** | Web App Exploit | `AWS-WAF-SQLI-001` | **CRITICAL (94/100)** | `BLOCK_ALERT` + IP Isolated |
| **Cross-Site Scripting (XSS)** | Web App Exploit | `AWS-WAF-XSS-001` | **HIGH (82/100)** | `BLOCK` |
| **Brute Force Auth** | Credential Stuffing | `AWS-WAF-AUTH-001` | **HIGH (84/100)** | `RATE_LIMIT` |
| **DDoS / Traffic Spike** | Availability Threat | `AWS-WAF-RATE-001` | **CRITICAL (92/100)** | `RATE_LIMIT / BLOCK` |
| **Unauthorized Access** | Privilege Escalation | `AWS-WAF-ACCESS-001` | **HIGH (88/100)** | `BLOCK_ALERT` |
| **Port / Route Scan** | Reconnaissance | `AWS-WAF-SCAN-001` | **MEDIUM (58/100)** | `FLAG` |

---

## Slide 7: Application Modules & Features
1. **SOC Dashboard:** Real-time top summary metric cards, service health indicators, live activity stream, and quick-launch attack buttons.
2. **Attack Simulator:** Interactive scenario selector, configurable parameters (IP, method, payload, velocity, simulation speed), 8-node visual pipeline, AI reasoning card, timeline, and terminal console.
3. **Security Logs:** Searchable DynamoDB event table with multi-filter sorting, expandable JSON payload inspector, and CSV/JSON export.
4. **Threat Analytics:** Dynamic graphs for attack distribution, severity breakdown, mitigation vs. passage ratios, top targeted endpoints, and top malicious hosts.
5. **Blocked IPs:** AWS WAF IPSet manager with threat score tracking, violation inspect modal, custom IP block addition, and simulator unblock action.
6. **System Monitoring:** Amazon CloudWatch metrics, alarm states, latency tracking, and audit log streams.

---

## Slide 8: Technical Implementation & Stack
- **Frontend Architecture:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **State Architecture:** Single Source of Truth via React Context (`SecurityContext`) ensuring zero contradictory state across views.
- **Simulation Engine:** Asynchronous, deterministic multi-stage executor coordinating precise timing offsets ($00:00.0, 00:00.7 \dots$), stage lifecycle states (`waiting`, `processing`, `completed`, `threat`), and live streaming logs.
- **Safety Boundary:** 100% locally simulated. Safe synthetic payloads evaluated against local mock endpoints (`/login`, `/admin/backup`, `/dashboard`). Zero external network traffic.

---

## Slide 9: Live Demonstration Highlights (Viva Walkthrough)
1. **Baseline State:** Showing 6/6 AWS services healthy on the SOC Dashboard.
2. **Executing SQL Injection:** Watching the visual pipeline transition stage-by-stage in real time; highlighting the AI Threat Analysis reasoning checklist.
3. **Auditing Results:** Inspecting the stored record in DynamoDB (Security Logs) and verifying the host is isolated in Blocked IPs.
4. **Testing Normal Request:** Proving the system passes benign traffic with $4/100$ LOW risk score.
5. **Testing DDoS Burst:** Demonstrating rate-limiting and CloudWatch anomaly detection.

---

## Slide 10: Conclusion & Key Learnings
- **Summary:**
  - Successfully designed and implemented an interactive AWS cloud security simulation platform.
  - Successfully integrated an explainable AI threat modeling enhancement.
  - Delivered a responsive, single-source-of-truth SOC dashboard ready for real-time demonstration.
- **Key Takeaway:**
  - Modern cloud defense requires combining rigid Layer-7 firewall rules with adaptive, explainable AI risk scoring to protect mission-critical workloads.
- **Q&A:** Open for Professor / Evaluator questions.

---
*Created for CloudShield Individual Project Defense Presentation.*
