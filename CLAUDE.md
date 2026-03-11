# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit) — no test framework is configured
```

## Architecture

This is a **Next.js 15 App Router** project (React 19, TypeScript strict mode, Tailwind CSS v4). The app is a Customer Intelligence Dashboard built incrementally through workshop exercises.

### Path alias
`@/*` maps to `./src/*` — use `@/components/Foo`, `@/data/mock-customers`, etc.

### Key files
- `src/app/page.tsx` — single dashboard page; new components are added here as exercises complete
- `src/data/mock-customers.ts` — canonical `Customer` type and `mockCustomers` array (8 records); **all components source data from here, no fetching**
- `src/data/mock-market-intelligence.ts` — secondary mock data for market intelligence widgets

### Customer type
```ts
interface Customer {
  id: string;
  name: string;
  company: string;
  healthScore: number;         // 0–100; ≤30 red, ≤70 yellow, >70 green
  email?: string;
  subscriptionTier?: 'basic' | 'premium' | 'enterprise';
  domains?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```
Optional fields must be guarded before use.

### Component conventions
- Components live in `src/components/` as default exports
- No external UI libraries — Tailwind CSS only
- `'use client'` directive required for components with interactivity (state, event handlers)
- Health score color bands are a recurring pattern: red ≤30, yellow ≤70, green >70

## Spec-driven workflow

This repo uses a spec-driven development methodology. The workflow is:

1. **Requirements** (`requirements/`) → raw feature descriptions (input, do not edit)
2. **Specs** (`specs/`) → structured specs generated from requirements using `templates/spec-template.md`
3. **Implementation** → components built from specs

### Custom commands
- `/spec <ComponentName>` — generates a spec from `requirements/<ComponentName>.md` and saves to `specs/<component-name>-spec.md`
- `/implement <path/to/spec.md>` — implements the component, iterates until all acceptance criteria pass, runs TypeScript diagnostics
- `/verify <path/to/component.tsx>` — checks TypeScript, data compatibility, responsive design, and acceptance criteria
- `/spec-review <path/to/spec.md>` — audits a spec for completeness against the four required sections

### Spec structure (required sections)
All specs must have: **Context**, **Requirements**, **Constraints** (includes full TypeScript props interface), **Acceptance Criteria** (testable `- [ ]` checklist).
