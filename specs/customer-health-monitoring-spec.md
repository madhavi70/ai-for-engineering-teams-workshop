# Spec: Customer Health Monitoring

## Feature: CustomerHealthMonitoring (HealthScoreCalculator + PredictiveAlerts integration)

### Context
- Unified health monitoring subsystem combining real-time health score calculation with proactive alert generation
- Sits between raw customer data and the dashboard UI — computes scores, evaluates alert rules, and surfaces results
- Used by the Customer Intelligence Dashboard to give internal teams early warning of at-risk customers
- Builds on `lib/healthCalculator.ts` (scoring) and `lib/alerts.ts` (rules engine) as coordinated pure-function libraries
- `CustomerHealthDisplay` widget and `AlertsWidget` consume the outputs for visual presentation

### Requirements

#### Health Score Calculation (see health-score-calculator-spec.md)
- Calculate a 0–100 weighted health score per customer across four factors:
  - Payment (40%), Engagement (30%), Contract (20%), Support (10%)
- Classify into risk levels: Healthy (71–100), Warning (31–70), Critical (0–30)
- Individual factor scoring functions + main `calculateHealthScore` combinator

#### Predictive Alert Rules Engine (`lib/alerts.ts`)
- Evaluate all alert rules against a customer's current and historical data
- **High Priority alerts:**
  - Payment Risk: payment overdue >30 days OR health score drops >20 points in 7 days
  - Engagement Cliff: login frequency drops >50% vs 30-day average
  - Contract Expiration Risk: contract expires in <90 days AND health score <50
- **Medium Priority alerts:**
  - Support Ticket Spike: >3 tickets in 7 days OR any escalated ticket
  - Feature Adoption Stall: no new feature usage in 30 days for growing accounts
- Deduplication: suppress re-firing the same alert for the same customer within a cooldown window
- Business hours gating: flag alerts raised outside business hours for deferred delivery
- Cooldown periods per rule to prevent alert fatigue

#### Alert Prioritization
- Priority score = weighted combination of: customer ARR, urgency (rule severity), recency (time since trigger)
- Output a sorted list of alerts, highest priority first

#### Data Monitoring
- Track health score deltas over time (7-day and 30-day windows)
- Detect login frequency trends (gradual decline vs sudden drop)
- Monitor payment timing patterns and support ticket escalation rates
- Feature usage depth tracking for adoption stall detection

### Constraints
- Tech stack: Next.js 15, React 19, TypeScript (strict), Tailwind CSS
- All rule evaluation and scoring functions must be pure (no side effects)
- TypeScript interfaces for all data structures:
  ```ts
  type RiskLevel = 'healthy' | 'warning' | 'critical';
  type AlertPriority = 'high' | 'medium';

  interface Alert {
    id: string;
    customerId: string;
    type: 'payment_risk' | 'engagement_cliff' | 'contract_expiration' | 'support_spike' | 'feature_stall';
    priority: AlertPriority;
    message: string;
    triggeredAt: string;
    cooldownUntil: string;
    priorityScore: number;
  }

  interface CustomerMonitoringState {
    healthScore: HealthScoreResult;       // from lib/healthCalculator.ts
    alerts: Alert[];
    lastEvaluatedAt: string;
  }
  ```
- Custom error classes for invalid inputs; no sensitive data in error messages
- Audit trail: every triggered alert logged with customer ID, rule type, timestamp, and resolved status
- File locations:
  - `src/lib/healthCalculator.ts` — scoring functions
  - `src/lib/alerts.ts` — rules engine
  - `src/components/CustomerHealthDisplay.tsx` — health score UI
  - `src/components/AlertsWidget.tsx` — alerts UI
- Color coding consistent across both widgets (red/yellow/green Tailwind utilities)

### Acceptance Criteria

#### Health Scoring
- [ ] `calculateHealthScore` returns 0–100 for all valid inputs with correct weighting
- [ ] Risk level boundaries (30/31 and 70/71) are correctly classified
- [ ] Missing/partial data produces a sensible default score, not an error

#### Alert Rules
- [ ] Each of the five alert types fires correctly at its defined threshold
- [ ] Duplicate alerts for the same customer and rule are suppressed during cooldown
- [ ] Priority scoring sorts alerts so high-ARR + high-urgency customers appear first
- [ ] Alerts generated outside business hours are flagged for deferred delivery

#### Integration
- [ ] `CustomerHealthDisplay` updates score and risk level when a new customer is selected
- [ ] `AlertsWidget` shows current alerts sorted by priority score, with color-coded priority badges
- [ ] Dismissing an alert removes it from the active list and logs the action to the audit trail

#### Testing
- [ ] Unit tests for all five alert rule functions with boundary condition coverage
- [ ] Deduplication and cooldown logic tested for same-customer repeated triggers
- [ ] Priority scoring tested with varying ARR, urgency, and recency combinations
- [ ] Health score delta tracking tested over simulated 7-day and 30-day windows
