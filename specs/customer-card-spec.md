# Spec: CustomerCard

## Feature: CustomerCard Component

### Context
- Individual customer display card used within the `CustomerSelector` container component
- Part of the Customer Intelligence Dashboard for at-a-glance customer identification
- Used by internal users to quickly scan and select customers for domain health monitoring
- Consumes data from `src/data/mock-customers.ts` via the `Customer` interface

### Requirements
- Display customer `name`, `company`, and `healthScore`
- Show customer `domains` array (website URLs) for health monitoring context
- Color-code the health score indicator based on score range:
  - Red: score 0–30 (poor)
  - Yellow: score 31–70 (moderate)
  - Green: score 71–100 (good)
- When a customer has multiple domains, display the domain count alongside the domain list
- Responsive layout that works on mobile and desktop
- Card-based visual design with clear domain section

### Constraints
- Tech stack: Next.js 15, React 19, TypeScript, Tailwind CSS
- Must accept a `Customer` prop typed against the existing interface in `src/data/mock-customers.ts`:
  ```ts
  interface Customer {
    id: string;
    name: string;
    company: string;
    healthScore: number;
    email?: string;
    subscriptionTier?: 'basic' | 'premium' | 'enterprise';
    domains?: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  ```
- Props interface:
  ```ts
  interface CustomerCardProps {
    customer: Customer;
  }
  ```
- Health indicator must use only Tailwind color utilities (no inline styles)
- Component file: `src/components/CustomerCard.tsx`
- No external UI libraries; use Tailwind CSS only
- No direct data fetching — data is passed via props

### Acceptance Criteria
- [ ] Renders customer name and company name visibly on the card
- [ ] Displays health score with correct color coding (red/yellow/green) based on the defined thresholds
- [ ] Shows the `domains` list when present; renders gracefully when `domains` is undefined or empty
- [ ] Displays domain count when a customer has more than one domain
- [ ] Layout is usable and readable on mobile (small screen) and desktop (wide screen)
- [ ] TypeScript compiles without errors; `CustomerCardProps` uses the `Customer` type from `mock-customers.ts`
- [ ] No runtime errors when rendered with any customer from `mockCustomers` mock data
