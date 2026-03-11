Implement the component described in the spec file: $ARGUMENTS

Follow these steps exactly:

## Step 1 — Read the spec

- Read the spec file at: $ARGUMENTS
- Extract the component name, file path, props interface, requirements, constraints, and acceptance criteria
- Note every acceptance criterion — these are your definition of done

## Step 2 — Gather context

Before writing any code:
- Read `templates/spec-template.md` to understand the project conventions
- Read any existing files referenced in the spec (e.g., child components, data files, type definitions)
- If the component file already exists at the target path, read it before making changes

## Step 3 — Implement the component

Write the component to the file path specified in the spec's Constraints section (e.g., `src/components/ComponentName.tsx`).

Follow all constraints from the spec:
- Use the exact TypeScript props interface defined in the spec — no deviations
- Tech stack: Next.js 15, React 19, TypeScript, Tailwind CSS only — no external UI libraries
- Follow the file structure and naming conventions from the spec
- Honor all performance, responsive, and design constraints

## Step 4 — Verify against acceptance criteria

After writing the component, go through every acceptance criterion from the spec one by one.

For each criterion:
- State whether it is MET or NOT MET
- If NOT MET, identify exactly what is missing or incorrect

## Step 5 — Iteratively refine

If any criteria are NOT MET:
- Fix the issues in the component file
- Re-check the affected criteria
- Repeat until all criteria are MET

Do not stop until every acceptance criterion is satisfied.

## Step 6 — Run diagnostics

Use the `mcp__ide__getDiagnostics` tool to check for TypeScript errors in the implemented file.

If there are errors:
- Fix each error
- Re-run diagnostics
- Repeat until there are zero TypeScript errors

## Step 7 — Report

Output a final summary in this format:

---

### Implementation Complete: `<ComponentName>`

**File**: `<path to created/modified file>`

#### Acceptance Criteria Verification

| Criterion | Status |
|---|---|
| <criterion summary> | ✅ Met / ❌ Not Met |

#### TypeScript
- Diagnostics: clean / N errors fixed

#### Notes
Any implementation decisions worth calling out (e.g., approach chosen for sessionStorage, virtualization strategy, etc.)

---
