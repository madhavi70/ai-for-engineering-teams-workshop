# Spec: Health Score Calculator

## Feature: HealthScoreCalculator (lib + CustomerHealthDisplay)

### Context
- Provides predictive customer health scoring and churn risk analytics for the Customer Intelligence Dashboard
- Implemented as a pure-function library (`lib/healthCalculator.ts`) consumed by a `CustomerHealthDisplay` UI widget
- Used by internal users to assess relationship health across payment, engagement, contract, and support dimensions
- Integrates with `CustomerSelector` to update scores in real time when the selected customer changes
- Intended to demonstrate AI-assisted algorithm design with transparent, explainable business logic

### Requirements

#### Core Algorithm
- Calculate a customer health score on a 0–100 scale using a weighted multi-factor model:
  | Factor | Weight |
  |--------|--------|
  | Payment history | 40% |
  | Engagement metrics | 30% |
  | Contract information | 20% |
  | Support satisfaction | 10% |
- Classify scores into risk levels:
  - **Healthy**: 71–100
  - **Warning**: 31–70
  - **Critical**: 0–30
- Each factor scored independently (0–100) then combined into a final weighted score

#### Input Data
- **Payment**: days since last payment, average payment delay, overdue amounts
- **Engagement**: login frequency, feature usage count, support ticket count
- **Contract**: days until renewal, contract value, recent upgrades
- **Support**: average resolution time, satisfaction scores, escalation counts

#### Pure Function Library (`lib/healthCalculator.ts`)
- Individual scoring functions per factor: `calculatePaymentScore`, `calculateEngagementScore`, `calculateContractScore`, `calculateSupportScore`
- Main `calculateHealthScore` function combining all factor scores
- Input validation with descriptive error messages for all data inputs
- Edge case handling for new customers and missing/partial data
- JSDoc comments on every function explaining business logic and formulas

#### UI Component (`CustomerHealthDisplay`)
- Overall health score displayed with color-coded indicator (consistent with dashboard red/yellow/green scheme)
- Expandable breakdown showing each factor's individual score and weight
- Loading state while score is being computed
- Error state when input data is invalid or unavailable
- Integrates with `CustomerSelector` — rerenders on customer selection change

### Constraints
- Tech stack: Next.js 15, React 19, TypeScript (strict), Tailwind CSS
- All library functions must be pure (no side effects)
- TypeScript interfaces required for all inputs and return types:
  ```ts
  interface PaymentData { daysSinceLastPayment: number; avgPaymentDelayDays: number; overdueAmount: number; }
  interface EngagementData { loginFrequencyPerMonth: number; featureUsageCount: number; supportTicketCount: number; }
  interface ContractData { daysUntilRenewal: number; contractValue: number; recentUpgrades: number; }
  interface SupportData { avgResolutionTimeDays: number; satisfactionScore: number; escalationCount: number; }
  interface HealthScoreInput { payment: PaymentData; engagement: EngagementData; contract: ContractData; support: SupportData; }
  interface HealthScoreResult { score: number; riskLevel: 'healthy' | 'warning' | 'critical'; breakdown: { payment: number; engagement: number; contract: number; support: number; }; }
  ```
- Custom error classes extending `Error` for input validation failures
- No external calculation or charting libraries — pure TypeScript + Tailwind
- Caching strategy for repeated identical inputs to avoid redundant computation
- File locations:
  - `src/lib/healthCalculator.ts` — pure function library
  - `src/components/CustomerHealthDisplay.tsx` — UI widget
- Color coding must reuse the same Tailwind utility classes as `CustomerCard` health indicator

### Acceptance Criteria

#### Algorithm
- [ ] `calculateHealthScore` returns a score between 0 and 100 for all valid inputs
- [ ] Weighted combination matches specification: Payment 40%, Engagement 30%, Contract 20%, Support 10%
- [ ] Risk level classification is correct at all boundary values (0, 30, 31, 70, 71, 100)
- [ ] New customers with missing data receive a sensible default score rather than an error
- [ ] Invalid or out-of-range inputs throw a descriptive custom error

#### Library
- [ ] Each factor has its own isolated scoring function returning 0–100
- [ ] All functions are pure — identical inputs always produce identical outputs
- [ ] All TypeScript interfaces compile under strict mode without errors
- [ ] JSDoc comments present on all exported functions explaining formulas and weights

#### UI Component
- [ ] Displays overall score with correct color coding (red/yellow/green) matching dashboard conventions
- [ ] Factor breakdown is hidden by default and expands on user interaction
- [ ] Score updates immediately when a new customer is selected in `CustomerSelector`
- [ ] Loading state is shown while score computation is in progress
- [ ] Error state renders a clear message when data is invalid or unavailable

#### Testing
- [ ] Unit tests cover all individual factor scoring functions
- [ ] Boundary condition tests for risk level thresholds (30/31 and 70/71)
- [ ] Edge case tests for new customers and missing data fields
- [ ] Mathematical accuracy verified against manually calculated expected values
- [ ] Input validation tests confirm correct errors are thrown for bad data
