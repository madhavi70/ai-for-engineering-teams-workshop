# Spec: Market Intelligence Widget

## Feature: MarketIntelligenceWidget (API + Service + UI)

### Context
- Provides real-time market sentiment and news analysis for customer companies within the Customer Intelligence Dashboard
- Three-layer architecture: Next.js API route → `MarketIntelligenceService` → `MarketIntelligenceWidget` UI component
- Displayed alongside other dashboard widgets (Domain Health, Predictive Alerts) in a responsive grid
- Receives the selected customer's company name from `CustomerSelector` and fetches sentiment data on change
- Uses mock data generation (`src/data/mock-market-intelligence.ts`) for reliable, external-API-free operation

### Requirements

#### API Layer — `/api/market-intelligence/[company]`
- Next.js App Router Route Handler accepting a `company` path parameter
- Validate and sanitize the `company` input before processing
- Call `MarketIntelligenceService` to generate and return mock market data
- Return a consistent JSON response:
  ```ts
  {
    company: string;
    sentiment: { score: number; label: 'positive' | 'neutral' | 'negative'; confidence: number; };
    articleCount: number;
    headlines: { title: string; source: string; publishedAt: string; }[];
    lastUpdated: string; // ISO timestamp
  }
  ```
- Simulate a realistic API delay (e.g. 300–800 ms) for authentic UX
- Return 400 for missing/invalid company name; 500 for unexpected errors — sanitize error messages

#### Service Layer — `MarketIntelligenceService`
- Class-based service at `src/services/marketIntelligenceService.ts`
- Uses `generateMockMarketData` and `calculateMockSentiment` from `src/data/mock-market-intelligence.ts`
- Implements in-memory cache with 10-minute TTL; returns cached result for repeated company lookups
- Throws `MarketIntelligenceError` (extends `Error`) with descriptive messages on validation failure
- All data-generation methods are pure functions (no side effects beyond cache writes)

#### UI Component — `MarketIntelligenceWidget`
- Component file: `src/components/MarketIntelligenceWidget.tsx`
- Accepts `company` prop (string); fetches data from `/api/market-intelligence/[company]` on mount and on prop change
- Color-coded sentiment indicator using the same Tailwind green/yellow/red system as other dashboard widgets:
  - Green: `positive`
  - Yellow: `neutral`
  - Red: `negative`
- Displays: sentiment label + score, article count, last updated timestamp, top 3 headlines (title, source, date)
- Loading skeleton/spinner while fetching
- Error state with a user-friendly message (no raw error details exposed)
- Layout and typography consistent with existing dashboard widget style

#### Dashboard Integration
- Rendered inside the dashboard grid in `src/app/page.tsx` alongside Domain Health and Predictive Alerts widgets
- Receives `company` from the selected `Customer` object passed down from `CustomerSelector`
- Follows same prop-passing and `useState`/`useEffect` patterns used by other widgets

### Constraints
- Tech stack: Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS
- No external news or sentiment APIs — mock data only
- TypeScript interfaces for all inputs, service responses, and component props:
  ```ts
  interface MarketIntelligenceWidgetProps {
    company: string;
  }

  interface MarketIntelligenceResponse {
    company: string;
    sentiment: { score: number; label: 'positive' | 'neutral' | 'negative'; confidence: number; };
    articleCount: number;
    headlines: MockHeadline[];
    lastUpdated: string;
  }
  ```
- Reuse `MockHeadline` and `MockMarketData` types from `src/data/mock-market-intelligence.ts`
- Input sanitization: strip HTML/script tags and limit company name to 100 characters
- No sensitive data in API error responses
- File locations:
  - `src/app/api/market-intelligence/[company]/route.ts` — API route
  - `src/services/marketIntelligenceService.ts` — service class
  - `src/components/MarketIntelligenceWidget.tsx` — UI component
- Color coding must match the green/yellow/red Tailwind utilities used in `CustomerCard`

### Acceptance Criteria

#### API
- [ ] `GET /api/market-intelligence/Acme` returns a valid JSON response matching `MarketIntelligenceResponse`
- [ ] Missing or empty company name returns HTTP 400 with a sanitized error message
- [ ] Response includes `lastUpdated` ISO timestamp
- [ ] Simulated delay is present and realistic (observable in network tab)

#### Service
- [ ] Repeated calls for the same company within 10 minutes return the cached result without regenerating data
- [ ] Cache expires after 10 minutes and fresh data is generated on next call
- [ ] Invalid company input throws `MarketIntelligenceError` with a descriptive message
- [ ] All service methods are pure except for cache read/write operations

#### UI Component
- [ ] Sentiment indicator renders with correct color (green/yellow/red) matching sentiment label
- [ ] Top 3 headlines display title, source, and formatted publication date
- [ ] Article count and last updated timestamp are visible
- [ ] Loading state is shown while the API request is in flight
- [ ] Error state renders a friendly message when the API call fails — no raw error details shown
- [ ] Widget re-fetches when the `company` prop changes (e.g., user selects a different customer)

#### Integration
- [ ] Widget renders correctly inside the dashboard grid without breaking existing layout
- [ ] Company name flows correctly from selected `Customer` in `CustomerSelector` to widget prop
- [ ] Responsive grid maintains correct layout on mobile and desktop

#### Security
- [ ] Company name parameter is validated and sanitized before use in mock data generation
- [ ] API error responses contain no stack traces or internal system details
