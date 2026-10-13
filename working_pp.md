# CloudShield — Cloud Security Attack Simulator
## Complete Faculty Demonstration Guide & Project Presentation Script (`working_pp.md`)

---

## 🎯 Executive Summary / 1-Minute Elevator Pitch

> *"Good morning/afternoon Professor. Today I am presenting **CloudShield**, an interactive Cloud Security Attack Simulator and Security Operations Center (SOC) dashboard. 
> 
> CloudShield demonstrates the end-to-end lifecycle of cloud security events modeled on AWS architecture—including **AWS WAF**, **AWS Lambda**, **Amazon DynamoDB**, **Amazon CloudWatch**, and **Amazon SNS**.
> 
> The core innovation and project enhancement is an **AI-driven Threat Detection and Heuristic Risk Scoring Engine** that operates in real time between WAF inspection and Lambda remediation. Rather than binary pass/fail rules, our AI analyzes target sensitivity, payload embeddings, velocity anomalies, and contextual threat intent to provide deterministic risk scoring (0–100), severity classification, and explainable reasoning.
> 
> The entire system runs as a safe, self-contained simulation with a single source of truth across all monitoring views."*

---

## 🏗️ Architecture & Event Flow

```
[ 1. Controlled Request Generator ]
                │
                ▼
[ 2. AWS WAF Simulation (Layer-7 ACL & Pattern Rules) ]
                │
                ▼
[ 3. AI Threat Engine (Contextual Scoring & Reasoning) ] 🌟 *SPECIAL ENHANCEMENT*
                │
                ▼
[ 4. AWS Lambda Simulation (processSecurityEvent Dispatch) ]
                │
        ┌───────┼───────┐
        ▼       ▼       ▼
   [DynamoDB] [CloudWatch] [SNS Topic]
  (Event Store) (Metrics/Logs) (SOC Alerts)
        │       │       │
        └───────┼───────┘
                ▼
[ 8. Security Mitigation & Dashboard Synchronization ]
```

---

## 🎬 Step-by-Step Faculty Demonstration Script

Follow this exact sequential flow during your viva / evaluation.

---

### Phase 1: Dashboard Overview & System Readiness (Time: ~1 min)

1. **Open the Dashboard** (`http://localhost:3000/`)
   - **What to show on screen**:
     - **Top Metric Cards**: Show *Total Requests Processed*, *Blocked Requests*, *Threats Detected*, *Critical Threats*, *Active Blocked IPs*, and *System Health (100% HEALTHY)*.
     - **Simulated AWS Cloud Services Panel**: Point out the 6 operational services with live status pulses: `AWS WAF`, `AI Threat Engine`, `AWS Lambda`, `Amazon DynamoDB`, `Amazon CloudWatch`, `Amazon SNS`.
     - **Live Activity Feed**: Point out the pre-populated recent SOC audit stream.
   - **What to say**:
     > *"Professor, here is our main SOC Dashboard. Notice how all 6 simulated AWS cloud components report operational health. Our metrics and audit feeds are connected to a unified central state, ensuring zero contradictory data across the application."*

---

### Phase 2: Primary Attack Demonstration — SQL Injection (Time: ~2 mins)

1. **Navigate to Attack Simulator** (Click **Attack Simulator** in sidebar)
2. **Select Scenario**: Click on **SQL Injection** (`sqli`)
   - Show that default parameters auto-populate:
     - Target Endpoint: `/login`
     - Method: `POST`
     - Payload: `' OR '1'='1' -- admin UNION SELECT username, password_hash FROM users;`
     - Rule Code: `SQLI-001`
     - Speed: Leave on `Normal (~7s)` or `Demo (~12s)` for classroom demonstration.
3. **Launch the Simulation**: Click the large **LAUNCH ATTACK SIMULATION** button.
4. **Walk through each stage live as it lights up**:
   - **Stage 1 — Request Generator**: Synthetic payload is generated.
   - **Stage 2 — AWS WAF**: Rule `AWS-WAF-SQLI-001` matches the SQL injection tokens in the body.
   - **Stage 3 — AI Threat Engine**: Lights up in purple. The AI scores the event $\sim 94/100$ with **`CRITICAL`** severity and $96\%$ confidence.
   - **Stage 4 — AWS Lambda**: Invokes `processSecurityEvent` (displaying duration $\sim 35\text{ms}$).
   - **Stage 5 — Amazon DynamoDB**: Writes record to `CloudShield_SecurityEvents` with $1.0\text{ WCU}$.
   - **Stage 6 — Amazon CloudWatch**: Emits metric datums and telemetry stream.
   - **Stage 7 — Amazon SNS**: Dispatches critical alert to SOC subscriber endpoints.
   - **Stage 8 — Security Mitigation**: Applies `BLOCK_ALERT` and registers the source IP in the WAF IPSet blocklist.
5. **Inspect the AI Analysis & Result Cards**:
   - Point out the **AI Threat Intelligence Card**: Show the gauge ($94/100$), the severity badge, and the explainable checklist:
     - *✓ Sensitive authentication endpoint targeted (`/login`)*
     - *✓ Suspicious SQL syntax tokens detected in body*
     - *✓ High probability of remote database exfiltration*
     - *✓ Signature matches AWS-WAF-SQLI-001*
   - Point out the **Console Terminal** and **Timeline** with exact millisecond timestamps.
   - **What to say**:
     > *"As you can see, every stage executed sequentially. The AI engine didn't just flag the request—it provided an explainable rationale on why this authentication endpoint attack is CRITICAL, triggering immediate IP isolation."*

---

### Phase 3: Inspecting Audit Trail & State Consistency (Time: ~1.5 mins)

1. **Open Security Logs** (Click **Security Logs** in sidebar)
   - Show the newly generated `EVT-xxxx` at the top of the table.
   - Expand the row using the chevron button:
     - Show the **AI Heuristic Reasoning Analysis** on the left.
     - Show the raw **DynamoDB Record Payload JSON** on the right.
   - Demonstrate the search bar (type `login` or the IP address) and filter dropdowns.
   - Demonstrate the **Export CSV** / **Export JSON** buttons.
   - **What to say**:
     > *"Every security event is preserved in our simulated DynamoDB event store. The table supports full searching, multi-criteria filtering, and payload exports for compliance audits."*

2. **Open Blocked IPs** (Click **Blocked IPs** in sidebar)
   - Show the attacker's IP now listed with Threat Score $94/100$, status `ACTIVE`, and attack reason.
   - Click **Inspect** to open the IP Detail Modal showing violation history.
   - Click **Unblock IP** to demonstrate state synchronization.
   - **What to say**:
     > *"Here we see our AWS WAF IPSet rule automatically updated. When a SOC analyst unblocks the host, the system immediately updates the state and dispatches an audit notice."*

---

### Phase 4: Contrast Demo — Normal / Benign Request (Time: ~1 min)

1. **Return to Attack Simulator**
2. **Select Scenario**: Click **Normal Request** (`normal`)
   - Target Endpoint: `/dashboard`
   - Method: `GET`
   - Payload: Clean benign headers
3. **Click Launch Simulation**:
   - Watch the pipeline progress:
     - WAF action: `ALLOW` (`DEFAULT-ALLOW-001`)
     - AI Risk Score: **`4 / 100` (`LOW`)** with $99\%$ confidence
     - Lambda Status: `BYPASSED` (benign traffic doesn't trigger mitigation lambdas)
     - SNS: `NOT_REQUIRED`
     - Final Status: **`ALLOWED`**
   - **What to say**:
     > *"This demonstrates that CloudShield accurately distinguishes between malicious exploits and benign user traffic without false positives."*

---

### Phase 5: Secondary Threat Demo — Layer-7 DDoS / Traffic Spike (Time: ~1 min)

1. **Select Scenario**: Click **DDoS / Traffic Spike** (`ddos`)
   - Request Volume: `500`
   - Intensity: `High`
2. **Launch Simulation**:
   - WAF matches `AWS-WAF-RATE-001` (`RATE_LIMIT`).
   - AI evaluates volumetric flood anomaly score: **`92 / 100` (`CRITICAL`)**.
   - CloudWatch records rate surge anomaly.
   - Final Action: `RATE_LIMIT` / `BLOCK`.
3. **Open Threat Analytics** (Click **Threat Analytics** in sidebar):
   - Show dynamic charts: *Attack Scenarios Breakdown*, *AI Severity Distribution*, *Mitigation vs. Passage Ratio*, *Most Targeted Endpoints*, and *Recent Critical Threats*.
   - **What to say**:
     > *"Our Threat Analytics view is 100% computed from the live simulation dataset, updating threat distributions and mitigation ratios in real time."*

---

### Phase 6: System Observability & Reset (Time: ~30 secs)

1. **Open System Monitoring** (Click **System Monitoring** in sidebar)
   - Show live CloudWatch telemetry: request rate, average Lambda latency, DynamoDB consumed WCUs, and the live log stream.
2. **Demonstrate Reset**: Click the **Reset** button in the TopBar.
   - Show that the entire environment smoothly resets to clean initial baseline.
   - Conclude your presentation.

---

## 💡 Anticipated Faculty Questions & Winning Answers

| Question | Strong Technical Answer |
| :--- | :--- |
| **Q1: Which AWS services are you simulating and what are their roles?** | *"We simulate 5 primary AWS services: **AWS WAF** for Layer-7 inspection and ACL rule evaluation; **AWS Lambda** for event-driven serverless remediation (`processSecurityEvent`); **Amazon DynamoDB** for scalable NoSQL storage of structured security events; **Amazon CloudWatch** for metrics telemetry and alarm streams; and **Amazon SNS** for critical SOC alert pub/sub dispatch."* |
| **Q2: What is the special enhancement beyond standard AWS features?** | *"Standard AWS WAF only performs binary rule matching. Our custom enhancement is an **AI-driven Threat Detection and Heuristic Risk Scoring Engine**. It analyzes contextual factors—such as endpoint sensitivity, payload token semantics, rate anomalies, and attack velocity—to produce a deterministic 0–100 threat score, confidence metric, severity classification, and human-readable explanation checklist."* |
| **Q3: How does the application ensure data consistency between pages?** | *"All pages read from a single source of truth managed by a unified React Context (`SecurityContext`). When an attack finishes, the same event instance updates the dashboard metrics, appends to the DynamoDB logs, updates analytics distributions, populates the WAF blocked IP set, and triggers SNS notifications without duplicate or stale state."* |
| **Q4: Is this attacking real systems or public IPs?** | *"No, Professor. CloudShield operates strictly within a **safe local simulation boundary**. All requests, IPs, and payloads are generated locally against synthetic application endpoints (e.g. `/login`, `/admin/backup`). No real external packets, real exploits, or DDoS traffic are generated."* |
| **Q5: What happens if you run benign normal traffic?** | *"Normal traffic passes through the WAF rule `DEFAULT-ALLOW-001`, the AI assigns a low risk score (4/100), Lambda mitigation is bypassed, no SNS alert is fired, and the final response is `ALLOW`."* |

---

## 📋 Faculty Demonstration Checklist

- [ ] Dev server running (`npm run dev` at `http://localhost:3000/`)
- [ ] Browser window maximized (Dark theme displays best on 1080p / 1440p)
- [ ] Walk through Phase 1 to Phase 6 in order
- [ ] Keep simulation speed on `Normal` or `Demo` so the faculty can watch the sequential progression
- [ ] Point out the AI reasoning checklist (*"Why was this classified?"*)
- [ ] Highlight the DynamoDB JSON viewer in Security Logs
- [ ] End with the Normal Request contrast and Reset demonstration

---
*Created for CloudShield Individual Project Defense & Faculty Demonstration.*
