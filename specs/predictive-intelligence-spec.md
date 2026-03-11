# Spec: Predictive Intelligence

## Feature: PredictiveIntelligence (AlertsEngine + MarketIntelligence fusion)

### Context
- Fuses real-time predictive alert signals with external market sentiment to provide a holistic customer risk picture
- Sits above `lib/alerts.ts` and `MarketIntelligenceService` — correlates internal behavioral alerts with market-context signals for enhanced early-warning
- Used by customer success teams to prioritise outreach: e.g., a "Contract Expiration Risk" alert combined with negative market sentiment is a higher-urgency situation than either signal alone
- `PredictiveIntelligenceWidget` renders the combined output on the dashboard alongside existing widgets
- Integrates with `CustomerSelector` — re-evaluates on customer selection change

### Requirements

#### Signal Fusion Engine (`lib/predictiveIntelligence.ts`)
- Consume alert outputs from `lib/alerts.ts` and market sentiment from `MarketIntelligenceService`
- Compute a **composite risk score** (0–100) combining:
  - Internal alert priority scores (weighted 70%)
  - Market sentiment (negative = +risk, positive = −risk, neutral = no change) (weighted 30%)
- Classify composite score into action tiers:
  - **Immediate Action** (71–100): high-priority alert + negative/neutral sentiment
  - **Monitor Closely** (31–70): medium-priority alerts or mixed signals
  - **Stable** (0–30): no active alerts + positive/neutral sentiment
- Emit a fused `PredictiveIntelligenceResult` with: composite score, action tier, contributing alerts, market sentiment summary, and recommended next action text

#### Alert Rules (from `lib/alerts.ts`)
- **High Priority:**
  - Payment Risk: overdue >30 days OR health score drops >20 pts in 7 days
  - Engagement Cliff: login frequency drops >50% vs 30-day average
  - Contract Expiration Risk: expires <90 days AND health score <50
- **Medium Priority:**
  - Support Ticket Spike: >3 tickets in 7 days OR any escalation
  - Feature Adoption Stall: no new feature usage in 30 days (growing accounts)
- Cooldown periods per rule; deduplication across evaluation cycles

#### Market Sentiment Integration
- Fetch sentiment via `MarketIntelligenceService` for the customer's company name
- Map sentiment label to risk modifier: `negative` → +15 pts, `neutral` → 0 pts, `positive` → −10 pts
- Cache sentiment per company for 10 minutes (reuse `MarketIntelligenceService` cache)
- Graceful degradation: if market data is unavailable, compute composite score from alerts alone and flag data gap in result

#### Recommended Actions
- Generate plain-language recommended action text based on the dominant alert type and sentiment:
  - Payment Risk + negative sentiment → "Escalate to account manager immediately"
  - Engagement Cliff → "Schedule customer health check call within 48 hours"
  - Contract Expiration Risk → "Initiate renewal conversation; prepare retention offer"
  - Support Spike → "Review open tickets; proactively contact customer"
  - Feature Stall → "Schedule adoption review and training session"
  - Stable → "No action required; continue routine monitoring"

#### UI Component — `PredictiveIntelligenceWidget`
- Display composite risk score with color-coded action tier badge (red/yellow/green)
- List contributing alerts with priority badges
- Show market sentiment summary (label, score, top headline)
- Recommended action displayed prominently
- Loading state while fetching alerts + market data
- Error/degraded state when market data is unavailable (alerts-only mode)
- Expandable detail panel for full alert breakdown and sentiment context

### Constraints
- Tech stack: Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS
- All fusion logic in `lib/predictiveIntelligence.ts` must be pure functions
- TypeScript interfaces:
  ```ts
  type ActionTier = 'immediate_action' | 'monitor_closely' | 'stable';

  interface PredictiveIntelligenceResult {
    compositeScore: number;
    actionTier: ActionTier;
    alerts: Alert[];                         // from lib/alerts.ts
    marketSentiment: {
      label: 'positive' | 'neutral' | 'negative';
      score: number;
      topHeadline?: string;
      dataAvailable: boolean;
    };
    recommendedAction: string;
    evaluatedAt: string;
  }

  interface PredictiveIntelligenceWidgetProps {
    customer: Customer;
  }
  ```
- Reuse `Alert` type from `lib/alerts.ts` and `MarketIntelligenceResponse` from `MarketIntelligenceService`
- Color coding consistent with existing dashboard widgets (Tailwind red/yellow/green utilities)
- No new external dependencies
- File locations:
  - `src/lib/predictiveIntelligence.ts` — fusion engine
  - `src/components/PredictiveIntelligenceWidget.tsx` — UI widget
- Composite score weights (70/30) must be defined as named constants, not magic numbers

### Acceptance Criteria

#### Signal Fusion
- [ ] Composite score is correctly calculated as 70% alert priority score + 30% sentiment modifier
- [ ] Action tier thresholds (31 and 71) are correctly applied at boundaries
- [ ] Negative sentiment adds +15 pts, neutral adds 0, positive subtracts 10 pts from composite score
- [ ] When market data is unavailable, composite score is computed from alerts only and `dataAvailable: false` is set

#### Alert Integration
- [ ] All five alert rule types are evaluated and appear in `PredictiveIntelligenceResult.alerts` when triggered
- [ ] Cooldown and deduplication are respected — no duplicate alerts in result
- [ ] Alerts are sorted by priority score descending in the result

#### Market Sentiment Integration
- [ ] Correct sentiment label and score are included in the result for a given company
- [ ] Cached sentiment is reused within the 10-minute TTL; fresh data fetched after expiry
- [ ] Widget renders in alerts-only degraded mode without crashing when market API fails

#### UI Component
- [ ] Composite score and action tier badge display with correct color (red/yellow/green)
- [ ] Recommended action text matches the dominant alert type and sentiment combination
- [ ] Expandable detail panel shows full alert list and sentiment breakdown
- [ ] Widget re-evaluates and re-renders when a new customer is selected in `CustomerSelector`
- [ ] Loading state shown while both alerts and market data are being fetched

#### Testing
- [ ] Unit tests for composite score calculation covering all sentiment modifier combinations
- [ ] Boundary tests for action tier thresholds (30/31 and 70/71)
- [ ] Degraded-mode test: alerts-only path when `dataAvailable: false`
- [ ] Recommended action text tested for each of the six alert/sentiment scenarios
