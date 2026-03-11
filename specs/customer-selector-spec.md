# Spec: CustomerSelector

## Feature: CustomerSelector Component

### Context
- Main customer selection interface for the Customer Intelligence Dashboard
- Container component that renders a list of `CustomerCard` components
- Used by internal users to quickly find and select a customer from a potentially large list (100+)
- Selected customer drives downstream views (e.g., domain health monitoring)
- Selection state must persist across page interactions within the same session

### Requirements
- Render a scrollable list of `CustomerCard` components from `mockCustomers` data
- Provide a search/filter input that filters customers by `name` or `company` in real time
- Highlight the currently selected customer card with a distinct visual selection state
- Persist the selected customer across page interactions (e.g., navigating away and returning within the same session)
- Handle 100+ customers without noticeable performance degradation

### Constraints
- Tech stack: Next.js 15, React 19, TypeScript, Tailwind CSS
- Must use the `CustomerCard` component (`src/components/CustomerCard.tsx`) for each list item
- Data sourced from `src/data/mock-customers.ts` — no direct data fetching
- Props interface:
  ```ts
  interface CustomerSelectorProps {
    customers: Customer[];
    selectedCustomerId?: string;
    onSelectCustomer: (customer: Customer) => void;
  }
  ```
- Component file: `src/components/CustomerSelector.tsx`
- Selection persistence via React state lifted to the parent or `sessionStorage` — no external state library required
- Filter logic must be case-insensitive and match partial strings
- No external UI libraries; Tailwind CSS only
- Responsive layout: stacked single-column on mobile, can expand on desktop

### Acceptance Criteria
- [ ] Renders all customers from the provided `customers` prop as `CustomerCard` components
- [ ] Search input filters the list in real time by customer name or company (case-insensitive, partial match)
- [ ] When no customers match the search query, a clear empty-state message is displayed
- [ ] Clicking a customer card calls `onSelectCustomer` with the correct `Customer` object
- [ ] Selected customer card is visually distinguished from unselected cards
- [ ] Selected customer persists when the user navigates away and returns within the same session
- [ ] List renders and filters without lag with 100+ customer records
- [ ] TypeScript compiles without errors; all props use types from `src/data/mock-customers.ts`
- [ ] No runtime errors when rendered with any subset of `mockCustomers`, including an empty array
