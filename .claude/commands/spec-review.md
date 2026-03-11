Review the spec file at: $ARGUMENTS

Follow these steps exactly:

## Step 1 — Read inputs
- Read the spec file provided in the argument
- Read `templates/spec-template.md` as the reference template

## Step 2 — Validate required sections
Check that the spec contains ALL four required top-level sections. For each section, assess whether it is present, and if present, whether it is substantive (not just a heading with no content):

| Section | Required subsections / content |
|---|---|
| **Context** | Purpose and role, how it fits the system, who uses it and when |
| **Requirements** | Functional requirements, UI requirements, data requirements, integration requirements |
| **Constraints** | Tech stack (Next.js 15, React 19, TypeScript, Tailwind CSS), performance requirements, design constraints, file structure and naming, props interface and TypeScript definitions, security considerations |
| **Acceptance Criteria** | Testable checklist items (using `- [ ]`), edge cases handled, UX validated, integration points verified |

## Step 3 — Evaluate quality
For each section that is present, evaluate:
- **Specificity**: Are requirements concrete and measurable, or vague?
- **Completeness**: Are any obvious subsections missing?
- **Testability**: Can each acceptance criterion be verified by a developer or tester?
- **TypeScript**: Are interfaces and prop types defined with enough detail to implement without guessing?

## Step 4 — Return a structured report

Output the report in this exact format:

---

### Spec Review: `<filename>`

#### Overall Status: PASS / NEEDS WORK / FAIL

| Section | Status | Notes |
|---|---|---|
| Context | ✅ Complete / ⚠️ Incomplete / ❌ Missing | Brief note |
| Requirements | ✅ Complete / ⚠️ Incomplete / ❌ Missing | Brief note |
| Constraints | ✅ Complete / ⚠️ Incomplete / ❌ Missing | Brief note |
| Acceptance Criteria | ✅ Complete / ⚠️ Incomplete / ❌ Missing | Brief note |

#### Issues Found
List each issue as an actionable item:
- **[Section]** — what is missing or unclear, and what should be added

#### Strengths
List 2–3 things the spec does well.

#### Recommended Next Steps
Ordered list of the most important fixes before this spec is implementation-ready.

---

Scoring rules:
- **PASS**: All four sections present and substantive, all acceptance criteria are testable
- **NEEDS WORK**: All sections present but one or more are vague, missing subsections, or have non-testable criteria
- **FAIL**: One or more required sections are missing entirely
