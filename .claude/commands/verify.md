Verify the component at: $ARGUMENTS

Follow these steps exactly. Do NOT skip any step.

## Step 1 — Read the component

- Read the component file at: $ARGUMENTS
- Identify the component name, its props interface, and all imported dependencies
- Note which props are required vs optional

## Step 2 — Locate the spec and data

- Derive the kebab-case component name from the filename (e.g., `CustomerCard.tsx` → `customer-card`)
- Check if `specs/<kebab-case-name>-spec.md` exists and read it if present — use its Acceptance Criteria as the verification checklist
- Read `src/data/mock-customers.ts` to understand the `Customer` type and available `mockCustomers` data

## Step 3 — TypeScript verification

Use `mcp__ide__getDiagnostics` to get all TypeScript diagnostics for the component file.

Also manually inspect the component for these issues:
- Any use of `any` type (flag each occurrence with line number)
- Props that are used but not declared in the interface
- Props declared in the interface but never used in the component body
- Missing return type on the component function
- Non-null assertions (`!`) that could hide runtime errors
- Incorrect or missing types on event handlers (e.g., `onClick`, `onChange`)

Report every issue found with file path and line number.

## Step 4 — Data compatibility check

Verify the component is compatible with `src/data/mock-customers.ts`:

- Identify every `Customer` field the component accesses (e.g., `customer.name`, `customer.healthScore`)
- Cross-reference against the `Customer` interface — flag any field accessed that does not exist on the type
- Check that optional fields (`email?`, `subscriptionTier?`, `domains?`, `createdAt?`, `updatedAt?`) are guarded before use (e.g., `customer.email && ...` or optional chaining `customer.email?.`)
- Verify the component handles an **empty array** prop without crashing (inspect the render logic)
- Verify the component handles a **single customer** (`mockCustomers.slice(0, 1)`) without layout breakage

## Step 5 — Responsive design audit

Inspect the component's Tailwind CSS classes for responsive behavior. Check each breakpoint:

| Breakpoint | Tailwind prefix | Width |
|---|---|---|
| Mobile | (none / default) | < 640px |
| Small | `sm:` | ≥ 640px |
| Medium | `md:` | ≥ 768px |
| Large | `lg:` | ≥ 1024px |

For each breakpoint:
- Are layout classes (flex, grid, columns, width) defined or inherited correctly?
- Is text truncation or overflow handled so content doesn't break the layout?
- Is touch target size adequate on mobile (buttons/clickable elements should have sufficient padding)?
- Are there any fixed pixel widths that would break on small screens?

If the spec defines specific responsive constraints, check those explicitly.

## Step 6 — Acceptance criteria verification

If a spec was found in Step 2, go through every `- [ ]` acceptance criterion and assess MET or NOT MET based on the code.

If no spec exists, evaluate against these default criteria:
- [ ] Component renders without crashing given valid props
- [ ] Component renders without crashing given an empty data array
- [ ] All required props are typed and non-nullable guards are in place for optional props
- [ ] No TypeScript errors
- [ ] Responsive layout classes present for at least mobile and one larger breakpoint
- [ ] Interactive elements (buttons, inputs) have accessible labels or ARIA attributes

## Step 7 — Return the verification report

Output the report in this exact format:

---

### Verification Report: `<ComponentName>`

#### Overall: PASS / FAIL

| Check | Status | Details |
|---|---|---|
| TypeScript diagnostics | ✅ Clean / ❌ N errors | List errors if any |
| `any` usage | ✅ None / ⚠️ N occurrences | Line numbers if any |
| Data compatibility | ✅ Compatible / ❌ N issues | Field mismatches or unguarded optionals |
| Empty array handling | ✅ Safe / ❌ Crashes | Description |
| Responsive (mobile) | ✅ Handled / ⚠️ Partial / ❌ Missing | Details |
| Responsive (md+) | ✅ Handled / ⚠️ Partial / ❌ Missing | Details |

#### Acceptance Criteria
| Criterion | Status |
|---|---|
| <criterion summary> | ✅ Met / ❌ Not Met |

#### Issues Found
List each issue as an actionable fix:
- **[Category] Line N** — description of issue and what should change

#### Verdict
- **PASS**: No TypeScript errors, no `any`, all required data fields valid, optionals guarded, responsive classes present, all acceptance criteria met
- **FAIL**: One or more of the above not satisfied — list the blockers

---
