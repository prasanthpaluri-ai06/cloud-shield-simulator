# CloudShield — Cloud Security Attack Simulator
## Complete Project Build Specification

**Project Type:** Individual Cloud Architecture Design / AWS Service Simulation  
**Primary Goal:** Build a polished, interactive website that simulates a cloud-security architecture using AWS-inspired services and provides a real-time visualization of the complete security-event lifecycle.  
**Primary Theme:** Dark, modern, professional cloud-security/SOC dashboard  
**Project Status:** Project-building specification; deployment, GitHub submission, and faculty approval are intentionally excluded from this document.

---

# 1. Project Overview

## 1.1 Project Name

**CloudShield — Cloud Security Attack Simulator**

CloudShield is an interactive web application that demonstrates how a cloud security architecture can detect, analyze, process, store, monitor, and respond to simulated cyber-security events.

The application is not intended to attack real systems. Every attack is generated and processed inside the application's controlled simulation environment.

The central experience is an **Attack Simulator**.

A user selects a simulated attack such as:

- SQL Injection
- Cross-Site Scripting (XSS)
- Brute Force
- DDoS / Traffic Spike
- Unauthorized Access
- Port Scan

The user launches the simulation and then watches the request move through the simulated cloud-security pipeline in real time:

```text
Simulated Attack
      ↓
AWS WAF Simulation
      ↓
Threat Detection
      ↓
AI Threat Analysis
      ↓
AWS Lambda Simulation
      ↓
DynamoDB Simulation
      ↓
CloudWatch Simulation
      ↓
SNS Simulation
      ↓
Security Response
      ↓
Dashboard / Analytics
```

The most important UX principle is:

> **The user must be able to visually see what is happening at every stage while the attack simulation is running.**

The website must not simply wait and show a final "Attack Blocked" message.

---

# 2. Assignment Alignment

The assignment asks the student to:

1. Understand one AWS service and its practical application.
2. Simulate the selected AWS service through a functional website.
3. Implement its core functionality in the application.
4. Add at least one meaningful enhancement beyond the basic AWS-service functionality.
5. Demonstrate the working system.

CloudShield extends the idea into a coherent cloud-security workflow using multiple AWS concepts.

The primary AWS services/concepts represented are:

- AWS WAF
- AWS Lambda
- Amazon DynamoDB
- Amazon CloudWatch
- Amazon SNS

The project also contains a custom enhancement:

- AI-based threat analysis and risk scoring

The website should make the AWS-service relationship explicit. Each simulated service must have a clear purpose and visible role in the workflow.

---

# 3. Core Project Objective

The project should demonstrate the following complete lifecycle:

```text
1. Generate a safe simulated attack
2. Represent it as an incoming web request/event
3. Pass it through a simulated AWS WAF
4. Detect whether the request is suspicious
5. Analyze the threat using the AI enhancement
6. Trigger simulated AWS Lambda processing
7. Store the security event in simulated DynamoDB
8. Update simulated CloudWatch metrics/logs
9. Generate a simulated SNS security notification
10. Apply a simulated security response
11. Update dashboards and analytics
12. Preserve the event in history
```

The system should support both:

- malicious/suspicious simulated requests
- safe/normal simulated requests

This is important because the application should demonstrate that the security layer can distinguish between normal and malicious traffic.

---

# 4. Safety Boundary

CloudShield must remain a **simulation**.

It must NOT:

- attack real websites
- perform real DDoS attacks
- scan real public IP addresses
- exploit real applications
- send real malicious payloads to external targets
- attempt unauthorized access
- perform real credential attacks

All attack data must be generated locally by the application.

Examples of simulated payloads can be displayed as text or represented as predefined test patterns. They are used only to demonstrate detection logic inside the simulator.

The "target" shown in the UI should be a fictional/local application endpoint such as:

```text
/login
/api/users
/search
/admin
/api/auth
```

---

# 5. Target User Experience

The website should feel like a simplified professional Security Operations Center (SOC).

The user should feel that they are operating a cloud-security monitoring platform.

The experience should be:

- Fast
- Smooth
- Responsive
- Visually polished
- Easy to understand
- Interactive
- Professional
- Consistent
- Dark themed
- Animation-rich but not distracting

The application should avoid looking like a basic college CRUD project.

---

# 6. Design Language

## 6.1 Theme

Use a professional dark security/SOC aesthetic.

Recommended visual direction:

- Deep charcoal/near-black background
- Slightly lighter dark panels
- Subtle borders
- White/light-gray primary text
- Muted secondary text
- Cyan/blue for system activity
- Green for successful/healthy states
- Amber/yellow for warnings
- Red for threats
- Purple/indigo for AI-related elements

Do not overuse neon colors.

The interface should look premium rather than "hacker movie" themed.

---

# 7. Global UI Structure

The application should use a persistent layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ CloudShield        System Status     Notifications   Profile │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│ Dashboard    │                                               │
│ Attack       │                 MAIN CONTENT                  │
│ Simulator    │                                               │
│ Security     │                                               │
│ Logs         │                                               │
│ Threat       │                                               │
│ Analytics    │                                               │
│ Blocked IPs  │                                               │
│ Monitoring   │                                               │
│              │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

## Sidebar

Items:

1. Dashboard
2. Attack Simulator
3. Security Logs
4. Threat Analytics
5. Blocked IPs
6. System Monitoring

The active page should be clearly highlighted.

---

# 8. Dashboard

## 8.1 Purpose

The dashboard provides the current overall security state.

## 8.2 Top Summary Cards

Display:

### Total Requests
Number of simulated requests processed.

### Blocked Requests
Number of requests blocked by the WAF/security layer.

### Threats Detected
Number of suspicious events.

### Critical Threats
Number of critical severity events.

### Active Blocked IPs
Number of currently blocked simulated source IPs.

### System Health
Overall health of the simulated AWS services.

---

# 9. Service Health Panel

Show all simulated services:

```text
AWS WAF          ● ACTIVE
AWS Lambda       ● ACTIVE
DynamoDB         ● ACTIVE
CloudWatch       ● ACTIVE
SNS              ● ACTIVE
AI Engine        ● ACTIVE
```

Each service should have:

- icon
- service name
- current status
- short description
- optional request/event count

Clicking a service can open a small details panel explaining its role.

---

# 10. Live Security Activity

The dashboard should contain a live activity feed.

Example:

```text
18:21:43  WAF       SQL Injection detected
18:21:43  AI        Threat classified as CRITICAL
18:21:44  Lambda    Security event processed
18:21:44  DynamoDB  Event stored
18:21:44  CloudWatch Metrics updated
18:21:44  SNS       Security alert generated
18:21:45  WAF       Source IP blocked
```

New events should appear at the top.

Use subtle animations when new events arrive.

---

# 11. Attack Simulator

This is the central feature of the project.

## 11.1 Attack Selection

Provide a clean attack-selection interface.

Available simulated attack types:

### SQL Injection
Purpose:
Demonstrate detection of SQL-injection-like request patterns.

### XSS
Purpose:
Demonstrate detection of suspicious script-injection-like input.

### Brute Force
Purpose:
Demonstrate repeated authentication attempts.

### DDoS / Traffic Spike
Purpose:
Demonstrate abnormal request-volume detection.

### Unauthorized Access
Purpose:
Demonstrate access to a protected endpoint.

### Port Scan
Purpose:
Demonstrate repeated simulated probing behavior.

---

# 12. Attack Configuration

After selecting an attack, show relevant configuration fields.

Common fields:

- Simulated source IP
- Target endpoint
- Request method
- Request count
- Attack intensity
- Payload/test pattern
- Simulation speed

Example:

```text
Attack Type:       SQL Injection
Source IP:         192.168.1.25
Target:            /login
Method:            POST
Intensity:         Medium
Simulation Speed:  Normal
```

The system should use validation.

Do not allow malformed values to break the application.

---

# 13. Launch Simulation

Primary button:

**LAUNCH ATTACK SIMULATION**

Before launching, show a short confirmation/state transition:

```text
Preparing simulation...
Generating controlled request...
Initializing security pipeline...
```

Then transition into the real-time visualization.

During a running simulation:

- disable launching another simulation
- show progress
- show current stage
- show live logs
- show current threat state
- show metrics changing
- allow a safe "Stop Simulation" action if implemented
- prevent duplicate timers or duplicate event processing

---

# 14. Real-Time Attack Visualization

This is one of the most important project requirements.

The user must see the security event move through every stage.

Recommended visual:

```text
[ATTACK]
    │
    ▼
[AWS WAF]
    │
    ▼
[AI ENGINE]
    │
    ▼
[AWS LAMBDA]
    │
    ▼
[DYNAMODB]
    │
    ▼
[CLOUDWATCH]
    │
    ▼
[SNS]
    │
    ▼
[RESPONSE]
```

Each node should have a state.

## Waiting

Gray:

```text
○ AWS Lambda
Waiting
```

## Processing

Blue/cyan:

```text
◉ AWS Lambda
Processing...
```

Use a subtle pulse or progress animation.

## Success

Green:

```text
✓ AWS Lambda
Completed
```

## Threat

Red:

```text
! AWS WAF
Threat Detected
```

The connecting line should visually progress from one service to the next.

---

# 15. Simulation Timeline

Display a timeline beside or below the architecture.

Example:

```text
00:00.0  Attack generated
00:00.7  WAF inspection started
00:01.5  Threat detected
00:02.1  AI analysis started
00:03.0  Threat classified
00:03.6  Lambda triggered
00:04.2  Event stored
00:04.8  CloudWatch updated
00:05.2  SNS alert generated
00:05.8  Source blocked
```

These are simulation timestamps, not claims about real AWS latency.

---

# 16. Service-by-Service Behavior

## 16.1 AWS WAF Simulation

### Responsibility

Inspect incoming simulated web requests.

### Inputs

- source IP
- endpoint
- method
- payload/test pattern
- request frequency
- selected attack type

### Rules

The WAF simulator can contain rules such as:

```text
SQLI-001
XSS-001
AUTH-001
RATE-001
ACCESS-001
SCAN-001
```

### Possible outputs

```text
ALLOW
BLOCK
FLAG
RATE_LIMIT
```

Example:

```text
Rule matched:
SQLI-001

Action:
BLOCK

Reason:
Suspicious SQL-injection pattern detected
```

---

# 17. AI Threat Analysis — Special Enhancement

This is the project's main unique enhancement.

The AI layer should go beyond simple rule matching.

It should analyze the security event and generate:

- Threat category
- Confidence score
- Severity
- Threat score
- Reasoning summary
- Recommended response

Example:

```text
Threat:
SQL Injection

Confidence:
96%

Severity:
CRITICAL

Threat Score:
94 / 100

Analysis:
Request contains a suspicious SQL-injection pattern
targeting an authentication endpoint.

Recommended Action:
Block source IP and record security event.
```

---

# 18. AI Severity Model

Use a consistent conceptual scoring model.

Suggested ranges:

```text
0–24    LOW
25–49   MEDIUM
50–74   HIGH
75–100  CRITICAL
```

The score should be based on simulated characteristics such as:

- attack category
- target sensitivity
- request frequency
- repeated attempts
- suspicious pattern
- historical behavior within the simulator

The exact score should be deterministic or reasonably explainable for demo purposes.

Avoid presenting arbitrary AI output as if it came from a real security provider.

---

# 19. AI Explanation

The AI section should not only show:

> "Threat detected."

It should explain why.

Example:

```text
WHY WAS THIS CLASSIFIED AS CRITICAL?

✓ Authentication endpoint targeted
✓ Suspicious input pattern detected
✓ Source generated repeated requests
✓ Attack signature matches SQLi rule
```

This makes the AI enhancement understandable to the professor.

---

# 20. AWS Lambda Simulation

Lambda represents event-driven processing.

When the WAF detects a suspicious event:

```text
WAF
 ↓
Security Event
 ↓
Lambda
```

The simulated Lambda function should:

1. receive the event
2. validate the event
3. invoke/perform threat analysis
4. calculate severity
5. update security state
6. create a record
7. trigger notification
8. return success/failure

Display:

```text
Function:
processSecurityEvent

Status:
SUCCESS

Execution:
Completed

Result:
Security event processed
```

---

# 21. DynamoDB Simulation

DynamoDB represents cloud NoSQL storage.

Store security events with fields such as:

```text
eventId
timestamp
sourceIp
attackType
target
method
severity
threatScore
confidence
wafAction
lambdaStatus
notificationStatus
finalAction
status
```

Example:

```text
EVT-1042
192.168.1.25
SQL Injection
/login
CRITICAL
94
96%
BLOCK
SUCCESS
SENT
BLOCKED
RESOLVED
```

The application should use the stored data to populate:

- Security Logs
- Threat Analytics
- Blocked IPs
- Dashboard counters

---

# 22. CloudWatch Simulation

CloudWatch represents monitoring, metrics, and logs.

Track metrics such as:

- requests processed
- requests blocked
- threats detected
- critical threats
- active sessions
- request rate
- blocked IP count
- security events
- system health

The monitoring page should show:

```text
Requests / minute
Blocked requests / minute
Threat events
System events
Service status
```

Use charts only where they improve understanding.

---

# 23. SNS Simulation

SNS represents notification delivery.

When a critical security event occurs:

```text
Security Event
      ↓
Lambda
      ↓
SNS
      ↓
Notification
```

Show a notification panel:

```text
🚨 CRITICAL SECURITY ALERT

SQL Injection detected

Source:
192.168.1.25

Target:
/login

Threat Score:
94/100

Action:
SOURCE BLOCKED
```

For the assignment simulator, notification delivery can remain inside the web application.

---

# 24. Security Response

After detection and analysis, the simulator applies an action.

Possible actions:

### ALLOW

For safe requests.

### FLAG

For suspicious but non-critical requests.

### RATE LIMIT

For traffic-abuse patterns.

### BLOCK

For high-confidence malicious events.

### BLOCK + ALERT

For critical threats.

The final response should be visible.

Example:

```text
FINAL RESPONSE

Source IP:
192.168.1.25

Action:
BLOCKED

Reason:
Critical SQL Injection threat

Status:
RESOLVED
```

---

# 25. Safe Request Simulation

Do not make the simulator only generate attacks.

Include a:

**NORMAL REQUEST**

option.

Example:

```text
GET /dashboard

Source:
192.168.1.50

Result:
ALLOWED

Threat Score:
4 / 100
```

The visualization should still pass through the pipeline, but the final action becomes:

```text
ALLOW
```

This demonstrates the difference between legitimate and malicious traffic.

---

# 26. Security Logs Page

Provide a searchable event table.

Columns:

- Event ID
- Time
- Source IP
- Attack Type
- Target
- Severity
- Threat Score
- WAF Action
- Final Action
- Status

Example:

```text
EVT-1042 | 18:21:43 | 192.168.1.25 | SQLi | /login | CRITICAL | 94 | BLOCK | BLOCKED | RESOLVED
```

Filters:

- Attack type
- Severity
- Action
- Status
- Time range

Search:

- event ID
- IP
- endpoint

---

# 27. Threat Analytics Page

This page explains attack trends within the simulated dataset.

Show:

- total threats
- threats by category
- severity distribution
- blocked vs allowed
- top source IPs
- most targeted endpoints
- recent critical events

Example categories:

```text
SQL Injection
XSS
Brute Force
DDoS
Unauthorized Access
Port Scan
```

All numbers should come from the application's generated event history.

---

# 28. Blocked IP Page

Display currently blocked simulated IPs.

Columns:

- IP
- reason
- attack type
- first detected
- last detected
- threat score
- status

Actions:

- View details
- Unblock (simulator only)
- View related events

If an IP is unblocked, make it clear that this changes only the simulator state.

---

# 29. System Monitoring Page

Show the simulated cloud environment.

Services:

```text
AWS WAF
AWS Lambda
DynamoDB
CloudWatch
SNS
AI Engine
```

For each:

- status
- event count
- last activity
- current operation

Example:

```text
AWS WAF
Status: ACTIVE
Events Processed: 128
Last Activity: 18:21:44

AWS Lambda
Status: ACTIVE
Invocations: 97
Last Activity: 18:21:44
```

---

# 30. Event State Machine

Every security event should follow a controlled state progression.

```text
CREATED
  ↓
INSPECTING
  ↓
DETECTED / SAFE
  ↓
ANALYZING
  ↓
PROCESSED
  ↓
STORED
  ↓
MONITORED
  ↓
NOTIFIED
  ↓
RESPONDED
  ↓
RESOLVED
```

For a safe request:

```text
CREATED
 ↓
INSPECTING
 ↓
SAFE
 ↓
PROCESSED
 ↓
STORED
 ↓
MONITORED
 ↓
RESOLVED
```

For a malicious request:

```text
CREATED
 ↓
INSPECTING
 ↓
THREAT DETECTED
 ↓
AI ANALYSIS
 ↓
PROCESSED
 ↓
STORED
 ↓
MONITORED
 ↓
NOTIFIED
 ↓
BLOCKED
 ↓
RESOLVED
```

---

# 31. Attack Simulation Timing

The simulation should feel real-time but remain fast enough for a classroom demonstration.

Recommended total duration:

**Approximately 6–12 seconds per attack.**

Example:

```text
Attack generation       0.7 sec
WAF inspection          0.8 sec
Threat detection        0.7 sec
AI analysis             1.2 sec
Lambda processing       0.8 sec
DynamoDB storage        0.6 sec
CloudWatch update       0.5 sec
SNS notification        0.5 sec
Final response          0.7 sec
```

These are UI simulation timings, not real AWS service timings.

Allow a configurable simulation speed if practical:

- Fast
- Normal
- Slow / Demo Mode

---

# 32. Live Log Panel

During simulation, display a live log panel.

Example:

```text
[18:21:43.201] REQUEST   Incoming request created
[18:21:43.845] WAF       Inspecting request
[18:21:44.412] WAF       Rule SQLI-001 matched
[18:21:44.915] AI        Threat analysis started
[18:21:46.103] AI        CRITICAL / 94 / 96%
[18:21:46.701] LAMBDA    Function invoked
[18:21:47.302] DB        Event EVT-1042 stored
[18:21:47.806] CW        Metrics updated
[18:21:48.221] SNS       Critical alert generated
[18:21:48.842] WAF       IP added to blocked list
```

Logs should appear progressively during the simulation.

---

# 33. Visual Service Pipeline

The architecture visualization should use connected nodes.

Each node:

```text
┌───────────────────────┐
│  🛡 AWS WAF           │
│                       │
│  Inspecting request   │
│  ● PROCESSING         │
└───────────────────────┘
```

When completed:

```text
┌───────────────────────┐
│  ✓ AWS WAF            │
│                       │
│  Threat detected      │
│  ● COMPLETED          │
└───────────────────────┘
```

The active node should be visually prominent.

Do not animate everything simultaneously. The animation must communicate sequence.

---

# 34. Responsive Design

The website must work on:

- Desktop
- Laptop
- Tablet
- Mobile-width screens

Desktop should provide the best experience.

On narrow screens:

```text
Sidebar
  ↓
Collapsible menu

Pipeline
  ↓
Vertical layout

Cards
  ↓
Stack vertically
```

No element should overflow horizontally unnecessarily.

---

# 35. UX Rules

## Buttons

Use clear action labels:

- Launch Simulation
- Stop Simulation
- View Details
- View Logs
- Block IP
- Unblock IP
- Clear History
- Reset Simulator

Avoid vague buttons such as:

- Go
- Run
- Click Here

## Feedback

Every important action should produce visible feedback.

Example:

```text
Simulation started
Simulation completed
Event stored
IP blocked
Notification generated
```

---

# 36. Loading States

Never leave blank panels.

Use:

```text
Analyzing...
Processing...
Storing event...
Updating metrics...
Generating alert...
```

Animations should be subtle.

---

# 37. Empty States

If there are no events:

```text
No security events yet.

Launch a simulation to begin monitoring activity.
```

If there are no blocked IPs:

```text
No blocked IP addresses.

Critical threats will appear here after detection.
```

---

# 38. Error Handling

The application must gracefully handle:

- invalid input
- missing values
- duplicate launch attempts
- simulation reset during processing
- empty event history
- invalid IP format
- zero request count
- extremely large request count
- interrupted simulation

Never display:

```text
undefined
NaN
Infinity
null
```

to the user.

---

# 39. Reset Behavior

Provide:

**Reset Simulator**

This should reset:

- generated events
- dashboard counters
- blocked IPs
- logs
- charts
- active simulation
- service states

Show a confirmation before clearing meaningful session data.

---

# 40. Data Model

## SecurityEvent

Suggested structure:

```text
SecurityEvent
├── eventId
├── timestamp
├── sourceIp
├── attackType
├── target
├── method
├── payloadLabel
├── intensity
├── requestCount
├── wafRule
├── wafAction
├── aiCategory
├── aiConfidence
├── threatScore
├── severity
├── aiReason
├── recommendedAction
├── lambdaStatus
├── storageStatus
├── monitoringStatus
├── notificationStatus
├── finalAction
└── finalStatus
```

## BlockedIP

```text
BlockedIP
├── ip
├── reason
├── attackType
├── firstDetected
├── lastDetected
├── threatScore
└── status
```

## ServiceStatus

```text
ServiceStatus
├── serviceName
├── status
├── eventCount
├── lastActivity
└── currentOperation
```

---

# 41. Attack Definitions

Each simulated attack should have a predefined profile.

## SQL Injection

```text
Category: Web Application Attack
Default Severity: High/Critical
Primary Service: WAF
AI Features:
- suspicious pattern
- sensitive endpoint
- repeated attempts
Recommended Response:
BLOCK
```

## XSS

```text
Category: Web Application Attack
Primary Service: WAF
AI Features:
- suspicious script-like input
- reflected input target
Recommended Response:
BLOCK / FLAG
```

## Brute Force

```text
Category: Authentication Attack
Primary Service: WAF + Lambda
AI Features:
- repeated authentication attempts
- request frequency
Recommended Response:
RATE LIMIT / BLOCK
```

## DDoS / Traffic Spike

```text
Category: Availability Threat
Primary Service: CloudWatch + WAF
AI Features:
- request-rate anomaly
- deviation from baseline
Recommended Response:
RATE LIMIT / BLOCK
```

## Unauthorized Access

```text
Category: Access Control
Primary Service: WAF + Lambda
AI Features:
- protected endpoint
- suspicious access attempt
Recommended Response:
BLOCK + ALERT
```

## Port Scan

```text
Category: Reconnaissance
Primary Service: Monitoring
AI Features:
- repeated probing behavior
- multiple target ports/endpoints
Recommended Response:
FLAG / BLOCK
```

---

# 42. Normal Traffic

Include safe traffic profiles.

Examples:

```text
GET /dashboard
GET /profile
GET /products
POST /feedback
```

Expected result:

```text
WAF:
ALLOW

AI:
Low Risk

Threat Score:
0–24

Final:
ALLOWED
```

This creates a useful contrast during the demo.

---

# 43. Attack History

The system should retain simulation history for the current application session.

History should power:

- dashboard counters
- logs
- analytics
- blocked IPs
- service metrics

Do not maintain contradictory values in separate places.

Use one source of truth for the current application state.

---

# 44. Architecture Principle

The UI should clearly communicate this conceptual architecture:

```text
                  USER
                   │
                   ▼
          ATTACK SIMULATOR
                   │
                   ▼
            ┌─────────────┐
            │ AWS WAF     │
            │ Simulation  │
            └──────┬──────┘
                   │
                   ▼
             AI ANALYSIS
                   │
                   ▼
            ┌─────────────┐
            │ AWS Lambda  │
            │ Simulation  │
            └──────┬──────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       DynamoDB CloudWatch SNS
          │        │        │
          └────────┼────────┘
                   ▼
             RESPONSE
                   │
                   ▼
              DASHBOARD
```

---

# 45. Technology Approach

A practical implementation can use:

## Frontend

- HTML
- CSS
- JavaScript

or a modern frontend framework if preferred.

## Backend

A lightweight backend can be used if required.

Possible approach:

- Python
- Flask/FastAPI
- Node.js/Express

For the first prototype, the system can be implemented primarily with local application state if the objective is a functional simulation rather than real AWS infrastructure.

## Database

For the simulation:

- local/in-memory data for the simplest prototype
- or a local database if persistent storage is desired

The UI should still label the functionality as a **DynamoDB simulation**, not claim that real DynamoDB is being used unless it actually is.

---

# 46. Component Structure

Suggested logical components:

```text
CloudShield
│
├── Layout
│   ├── Sidebar
│   ├── TopBar
│   └── Notifications
│
├── Dashboard
│   ├── MetricCards
│   ├── ServiceHealth
│   ├── LiveActivity
│   └── ThreatSummary
│
├── AttackSimulator
│   ├── AttackSelector
│   ├── ConfigurationPanel
│   ├── SimulationControls
│   ├── PipelineVisualization
│   ├── Timeline
│   ├── LiveLogs
│   └── ResultPanel
│
├── SecurityLogs
│   ├── Filters
│   ├── Search
│   └── EventTable
│
├── ThreatAnalytics
│   ├── ThreatDistribution
│   ├── SeveritySummary
│   └── EndpointAnalysis
│
├── BlockedIPs
│   ├── IPTable
│   └── IPDetails
│
└── Monitoring
    ├── ServiceStatus
    ├── Metrics
    └── SystemEvents
```

---

# 47. Animation Guidelines

Animation is important, but excessive animation will make the application look unprofessional.

Use animation for:

- pipeline progression
- active service state
- new logs
- notification arrival
- metric changes
- threat detection
- completion

Avoid:

- constant screen shaking
- excessive glowing
- unnecessary particle effects
- extremely fast blinking
- animations that make text difficult to read

Provide a reduced-motion-friendly state where practical.

---

# 48. Visual Severity System

Use consistent visual meaning.

```text
GREEN
Healthy / Safe / Allowed / Completed

BLUE/CYAN
Processing / Information / Active

AMBER
Warning / Suspicious / Needs attention

RED
Threat / Critical / Blocked

PURPLE/INDIGO
AI / Intelligence / Analysis
```

Do not use color alone to communicate status. Include icons/text such as:

```text
✓ ACTIVE
! WARNING
✕ BLOCKED
● PROCESSING
```

---

# 49. Accessibility

The website should:

- use readable font sizes
- maintain strong contrast
- provide visible focus states
- use keyboard-accessible controls
- use semantic buttons
- provide labels for form controls
- avoid relying only on color
- provide accessible descriptions for important dynamic updates
- avoid excessively rapid flashing

---

# 50. Main Demo Scenario

The recommended first demonstration is SQL Injection.

## Step 1

Open Dashboard.

Show all services as active.

## Step 2

Open Attack Simulator.

Select:

```text
SQL Injection
```

## Step 3

Configure:

```text
Source IP:
192.168.1.25

Target:
/login

Method:
POST

Intensity:
Medium
```

## Step 4

Click:

**Launch Simulation**

## Step 5

Watch:

```text
Attack Generated
      ↓
WAF Inspection
      ↓
SQLi Rule Matched
      ↓
Threat Detected
      ↓
AI Analysis
      ↓
Threat Score
      ↓
Lambda Processing
      ↓
DynamoDB Storage
      ↓
CloudWatch Update
      ↓
SNS Alert
      ↓
IP Blocked
```

## Step 6

Open Security Logs.

Show the newly generated event.

## Step 7

Open Threat Analytics.

Show the updated threat statistics.

## Step 8

Open Blocked IPs.

Show:

```text
192.168.1.25
```

as blocked.

## Step 9

Run a Normal Request.

Show that the same pipeline can allow legitimate traffic.

This gives the professor a complete story:

```text
Attack
→ Detection
→ Intelligence
→ Processing
→ Storage
→ Monitoring
→ Notification
→ Response
```

---

# 51. Secondary Demo Scenario

Use DDoS / Traffic Spike as the second demonstration.

Configuration:

```text
Attack:
DDoS / Traffic Spike

Request Count:
High

Intensity:
High
```

The dashboard should visibly show:

```text
Request rate ↑
Threat score ↑
CloudWatch anomaly ↑
AI severity ↑
```

Then:

```text
Recommended Action:
RATE LIMIT
```

The final state should show the simulated response.

---

# 52. Third Demo Scenario

Use Brute Force.

Show repeated login attempts:

```text
Attempt 1
Attempt 2
Attempt 3
...
Attempt 10
```

The AI/security logic should recognize repeated behavior.

Example:

```text
Pattern:
Repeated authentication attempts

Risk:
HIGH

Action:
RATE LIMIT / BLOCK
```

---

# 53. AI Enhancement — What Makes It Unique

The AI enhancement should be clearly presented as the project's differentiating feature.

Basic AWS WAF simulation might answer:

```text
Does this request match a known rule?
YES
```

CloudShield's enhancement goes further:

```text
What type of threat is this?
How confident are we?
How severe is it?
Why is it dangerous?
What response is recommended?
```

This produces:

```text
Threat Category
+
Confidence
+
Severity
+
Threat Score
+
Reasoning
+
Recommended Response
```

This is the main feature that differentiates the project from a simple AWS-service UI clone.

---

# 54. AI Result Example

```text
┌─────────────────────────────────────────────┐
│ 🤖 AI THREAT ANALYSIS                       │
├─────────────────────────────────────────────┤
│                                             │
│ Threat Type       SQL Injection             │
│ Confidence        96%                       │
│ Severity          CRITICAL                  │
│ Threat Score      94 / 100                  │
│                                             │
│ Why?                                        │
│ ✓ Sensitive login endpoint                 │
│ ✓ Suspicious request pattern               │
│ ✓ Known SQLi signature                      │
│ ✓ Repeated source activity                 │
│                                             │
│ Recommended Response                        │
│ BLOCK SOURCE IP                             │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 55. Dashboard Final State Example

After several simulations:

```text
TOTAL REQUESTS
12,480

BLOCKED
2,341

THREATS
27

CRITICAL
6

BLOCKED IPS
14
```

Service status:

```text
AWS WAF       ACTIVE
Lambda        ACTIVE
DynamoDB      ACTIVE
CloudWatch    ACTIVE
SNS           ACTIVE
AI Engine     ACTIVE
```

---

# 56. Project Completion Criteria

The project should not be considered complete until all of the following work:

## Core

- [ ] Dashboard works
- [ ] Attack Simulator works
- [ ] Normal Request simulation works
- [ ] SQL Injection simulation works
- [ ] XSS simulation works
- [ ] Brute Force simulation works
- [ ] DDoS simulation works
- [ ] Unauthorized Access simulation works
- [ ] Port Scan simulation works

## AWS Simulations

- [ ] WAF simulation works
- [ ] Lambda simulation works
- [ ] DynamoDB simulation works
- [ ] CloudWatch simulation works
- [ ] SNS simulation works

## AI Enhancement

- [ ] Threat classification
- [ ] Confidence score
- [ ] Severity
- [ ] Threat score
- [ ] Explanation
- [ ] Recommended action

## Visualization

- [ ] Real-time pipeline
- [ ] Active-stage animation
- [ ] Completion states
- [ ] Timeline
- [ ] Live logs
- [ ] Dynamic dashboard counters
- [ ] Notifications

## UX

- [ ] Dark theme
- [ ] Responsive layout
- [ ] Smooth transitions
- [ ] Clear error states
- [ ] Loading states
- [ ] Empty states
- [ ] Accessible controls
- [ ] No broken interactions

---

# 57. What the Professor Should Understand in One Minute

The entire project should be explainable like this:

> "CloudShield is a cloud-security attack simulator. The user generates a controlled simulated attack, which enters our AWS WAF simulation. The event is inspected and then analyzed by our AI enhancement, which determines the threat type, confidence, severity, and recommended action. A simulated AWS Lambda function processes the event, DynamoDB stores it, CloudWatch updates monitoring data, and SNS generates a security alert. The final security response is then displayed on the dashboard. The key enhancement is real-time AI-based threat analysis and a complete visual representation of the event moving through the cloud-security architecture."

---

# 58. Final Product Vision

The final website should feel like a compact cloud-security operations platform.

The ideal experience is:

```text
              CLOUDSHIELD
       Cloud Security Simulator

                  ↓

       ┌─────────────────────┐
       │ Generate Attack     │
       └──────────┬──────────┘
                  ↓
       ┌─────────────────────┐
       │ Real-Time Pipeline  │
       │                     │
       │ Attack              │
       │   ↓                 │
       │ WAF                 │
       │   ↓                 │
       │ AI                  │
       │   ↓                 │
       │ Lambda              │
       │   ↓                 │
       │ DynamoDB            │
       │   ↓                 │
       │ CloudWatch          │
       │   ↓                 │
       │ SNS                 │
       │   ↓                 │
       │ Response            │
       └──────────┬──────────┘
                  ↓
       ┌─────────────────────┐
       │ Security Dashboard  │
       └─────────────────────┘
```

The key principles are:

1. **Everything is interactive.**
2. **Every simulation stage is visible.**
3. **The AWS services have clearly defined roles.**
4. **The AI enhancement adds meaningful intelligence rather than decoration.**
5. **The website uses one consistent source of simulation state.**
6. **The UI remains smooth and readable during animation.**
7. **The system clearly distinguishes simulation from real AWS infrastructure.**
8. **Normal traffic and malicious traffic are both supported.**
9. **Every attack creates a traceable event.**
10. **The final result is explainable to a faculty evaluator.**

---

# 59. Scope Exclusions for the Current Build

The following are intentionally outside the current project-building phase:

- GitHub repository submission
- Deployment
- Faculty approval workflow
- Google Form submission
- Production AWS infrastructure
- Real SMS/email delivery
- Real-world attack traffic
- Real penetration testing
- Real DDoS generation
- Real IP blocking
- Real external security monitoring

These can be considered later if required.

---

# 60. Definition of Done

CloudShield is ready for demonstration when a user can:

1. Open the website.
2. Understand the dashboard immediately.
3. Open Attack Simulator.
4. Select an attack.
5. Configure it.
6. Launch it.
7. Watch the attack move through every security stage in real time.
8. See WAF detection.
9. See AI analysis.
10. See Lambda processing.
11. See database storage.
12. See monitoring updates.
13. See notification generation.
14. See the final security response.
15. Open the resulting security log.
16. See analytics update.
17. See blocked IP information where applicable.
18. Run a normal request and see it allowed.
19. Run another attack without the UI becoming inconsistent.
20. Reset the simulator and return to a clean state.

The final product should therefore demonstrate not merely individual AWS features, but a **coherent, visually understandable, interactive cloud-security event lifecycle**.
