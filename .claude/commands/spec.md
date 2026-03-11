Generate a spec for the component: $ARGUMENTS

Follow these steps exactly:

## Step 1 — Read inputs

- The component name is: $ARGUMENTS
- Derive the kebab-case filename: lowercase the component name and insert hyphens between words (e.g., "CustomerCard" → "customer-card")
- Check if `requirements/$ARGUMENTS.md` exists and read it if present — this is the primary input
- Read `templates/spec-template.md` as the structural reference

## Step 2 — Gather context

Search the codebase for any existing evidence about this component:
- Look for an existing file at `src/components/$ARGUMENTS.tsx` (or similar path)
- Look for references to the component in other source files to understand how it is used
- Note the `Customer` type and any relevant data shapes from `src/data/mock-customers.ts` if applicable

## Step 3 — Generate the spec

Using all gathered information, produce a spec with ALL four required sections. Follow the structure from `templates/spec-template.md` exactly.

### Context
- Purpose and role in the application
- How it fits into the larger system (what consumes it, what it drives)
- Who uses it and when

### Requirements
- **Functional requirements**: what the component must do, user interactions
- **UI requirements**: visual behavior, states (default, selected, hover, empty, loading/error if applicable)
- **Data requirements**: the `Customer` type shape with all fields, data source
- **Integration requirements**: parent component contract, how props flow in, any callbacks

### Constraints
- **Tech stack**: Next.js 15, React 19, TypeScript, Tailwind CSS — no external UI libraries
- **Performance requirements**: rendering thresholds, debounce timing, virtualization if needed
- **Design constraints**: responsive breakpoints (explicit Tailwind classes), scroll behavior, sizing
- **File structure and naming**: component file path, export style
- **Props interface**: full TypeScript interface with all props typed (no `any`)
- **Security considerations**: data handling, storage scope, no PII leaving the client

### Acceptance Criteria
Write testable checklist items covering:
- [ ] Core rendering behavior
- [ ] Interactive behavior (clicks, inputs, callbacks)
- [ ] Edge cases (empty array, no match, missing optional props)
- [ ] TypeScript: compiles without errors
- [ ] Accessibility: keyboard navigation and ARIA roles where appropriate
- [ ] Responsive layout at relevant breakpoints
- [ ] Integration: correct props passed to child components

## Step 4 — Save the output

Write the completed spec to `specs/<kebab-case-name>-spec.md`.

Confirm the file was saved and print a one-line summary of what was generated.
