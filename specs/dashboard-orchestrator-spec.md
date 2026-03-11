# Spec: Dashboard Orchestrator

## Feature: Production-Ready Dashboard Orchestrator

### Context
- Transforms the Customer Intelligence Dashboard from prototype to production-grade application
- `DashboardOrchestrator` is the top-level composition component that wires together all widgets, error boundaries, export utilities, and performance optimizations
- Serves internal business users who rely on the dashboard for customer health decisions — downtime or data loss is high-impact
- Encompasses four cross-cutting concerns: error resilience, data export, performance, and accessibility (WCAG 2.1 AA)
- Deployment target: production Next.js 15 app with security headers, CSP, and monitoring hooks

### Requirements

#### Error Handling and Resilience
- Multi-level React error boundary hierarchy:
  - `DashboardErrorBoundary` — catches application-level failures, renders a full-page recovery UI
  - `WidgetErrorBoundary` — isolates individual widget failures so the rest of the dashboard stays functional
- User-friendly error messages with retry buttons; retry limit of 3 per boundary before showing a permanent failure state
- Development mode: show full stack traces; production mode: show sanitized messages only
- Automatic error logging on boundary catch (no sensitive customer data in log payloads)
- Fallback UI components that preserve core navigation and `CustomerSelector` functionality

#### Data Export
- Export customer data, health score reports, alert history, and market intelligence summaries
- Supported formats: CSV and JSON
- Configurable filters: date range, customer segment, data fields
- Streaming export for large datasets with a progress indicator and cancellation button
- File naming: `{dataType}_{dateRange}_{timestamp}.{ext}`
- Export actions logged to audit trail with user ID and timestamp
- Rate limiting: max 5 concurrent exports per session

#### Performance Optimization
- `React.memo` on all leaf widget components; `useMemo`/`useCallback` for expensive computations and handlers
- `React.lazy` + `Suspense` boundaries for all widget imports (code splitting)
- Virtual scrolling for `CustomerSelector` lists >50 items
- Service worker for caching static assets and API responses (stale-while-revalidate strategy)
- Core Web Vitals targets: FCP <1.5s, LCP <2.5s, CLS <0.1, TTI <3.5s, 60fps interactions
- Memory leak prevention: clean up subscriptions and timers in `useEffect` returns

#### Accessibility (WCAG 2.1 AA)
- Semantic HTML landmarks (`<main>`, `<nav>`, `<aside>`, `<section>`) throughout
- Logical tab order; skip-to-main-content link at page top
- All interactive elements keyboard-operable with visible focus indicators meeting WCAG contrast ratios
- ARIA live regions for dynamic alert updates and async loading state announcements
- Descriptive alt text on all informational visuals; form inputs with associated `<label>` elements
- High contrast mode support via Tailwind `dark:` or CSS media query `prefers-contrast`

#### Security Hardening
- Content Security Policy (CSP) via `next.config` headers — restrict script/style/connect sources
- Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`
- Input sanitization on all search queries, export filters, and URL parameters
- CSRF protection on export and mutation endpoints
- Rate limiting on all API routes; client-side request throttling for rapid user interactions
- HTTPS enforcement; secure cookie flags for any session state

### Constraints
- Tech stack: Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS
- No new UI library dependencies — extend existing Tailwind-based component patterns
- Error boundary components must be React class components (React requirement for `componentDidCatch`)
- TypeScript interfaces:
  ```ts
  interface ExportConfig {
    dataType: 'customers' | 'health-scores' | 'alerts' | 'market-intelligence';
    format: 'csv' | 'json';
    dateRange?: { from: string; to: string };
    customerSegment?: string[];
    fields?: string[];
  }

  interface ErrorBoundaryState {
    hasError: boolean;
    retryCount: number;
    errorId: string | null;
  }
  ```
- File locations:
  - `src/components/DashboardErrorBoundary.tsx`
  - `src/components/WidgetErrorBoundary.tsx`
  - `src/utils/exportUtils.ts`
  - `src/app/page.tsx` — orchestration root
  - `next.config.ts` — security headers and build config
- axe-core integrated in test suite for automated accessibility checks
- Bundle size budget: main chunk <200 KB gzipped

### Acceptance Criteria

#### Error Resilience
- [ ] A widget throwing an error renders that widget's fallback without affecting other widgets
- [ ] Retry button re-mounts the failed component; after 3 retries the permanent failure state is shown
- [ ] Production builds show no stack traces or internal paths in error UI
- [ ] Error boundary catch events are logged (without PII or sensitive data)

#### Data Export
- [ ] CSV and JSON exports contain correct, complete data for the selected filters
- [ ] Progress indicator updates during streaming export; cancel button aborts mid-export
- [ ] Exported filenames follow the `{dataType}_{dateRange}_{timestamp}.{ext}` convention
- [ ] Exceeding the 5-export rate limit shows a clear error message to the user

#### Performance
- [ ] Lighthouse CI passes all Core Web Vitals targets (FCP <1.5s, LCP <2.5s, CLS <0.1, TTI <3.5s)
- [ ] `CustomerSelector` with 100+ customers renders and filters without visible lag (virtual scrolling active)
- [ ] No memory leaks detected after repeated customer selection and widget refresh cycles
- [ ] All widgets lazy-load; initial bundle does not include widget code

#### Accessibility
- [ ] axe-core automated scan reports zero violations on the dashboard page
- [ ] All interactive elements reachable and operable by keyboard alone
- [ ] Screen reader announces loading states, alert updates, and export progress
- [ ] Skip-to-content link is the first focusable element on the page

#### Security
- [ ] CSP header present on all responses; inline scripts blocked
- [ ] `X-Frame-Options` and `X-Content-Type-Options` headers present
- [ ] Malformed export filter inputs are rejected with a 400 and sanitized error message
- [ ] API endpoints return 429 when rate limit is exceeded
