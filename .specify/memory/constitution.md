<!--
  Sync Impact Report
  Version change: N/A → 1.0.0 (initial ratification)
  Added principles:
    - I. Code Quality First
    - II. Test-Driven Development (TDD)
    - III. User Experience Consistency
    - IV. Performance Requirements
    - V. Reusable Components & Functions
    - VI. Centralized Business Logic
    - VII. Skill-Driven Development
  Added sections:
    - Commit & Safety Standards
    - Development Workflow
    - Governance
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (Constitution Check aligns)
    - .specify/templates/spec-template.md ✅ (user stories + acceptance criteria align)
    - .specify/templates/tasks-template.md ✅ (TDD + commit-per-task aligns)
  Follow-up TODOs: None
-->

# Debt Aging Analysis Constitution

## Core Principles

### I. Code Quality First

All code MUST pass linting and type-checking before merge.
Every function MUST have a single, clear responsibility.
Dead code, unused imports, and commented-out code MUST be removed
immediately — not left for "later cleanup."
Magic numbers and hardcoded strings MUST be extracted into named
constants or configuration.
All public interfaces MUST have explicit TypeScript types — no `any`
escape hatches without documented justification.

### II. Test-Driven Development (TDD)

TDD is NON-NEGOTIABLE for all feature and bugfix work.

1. **Red**: Write a failing test that defines the expected behavior.
2. **Green**: Write the minimum code to make the test pass.
3. **Refactor**: Clean up while keeping tests green.

Every pull request MUST include tests that cover the changed behavior.
Tests MUST be deterministic — no flaky tests allowed in the suite.
Integration tests MUST cover critical user journeys (debt aging
calculations, report generation, data filtering).
Unit tests MUST cover all business logic functions and utility helpers.
Mocks MUST only be used at system boundaries (database, external APIs),
never for internal module interactions.

### III. User Experience Consistency

All UI components MUST follow a single design system (component library
+ consistent spacing, typography, and color tokens).
Loading states, error states, and empty states MUST be handled for
every data-dependent view — no blank screens.
Form validation MUST provide inline, immediate feedback — not just
on submit.
Navigation and layout patterns MUST remain consistent across all
pages and views.
Thai language support MUST be verified for all user-facing text
(labels, messages, date formats, currency formatting).
Accessibility basics MUST be met: keyboard navigation, sufficient
contrast, semantic HTML elements.

### IV. Performance Requirements

Initial page load MUST complete within 3 seconds on standard
hospital network conditions.
Data queries for aging reports MUST return results within 2 seconds
for datasets up to 100,000 records.
Client-side bundle size MUST stay under 500KB gzipped for the
main entry point.
Large data tables MUST use virtualization or pagination — never
render more than 100 rows in the DOM at once.
API responses MUST be cached where appropriate, with clear
invalidation strategies.

### V. Reusable Components & Functions

Before writing new code, developers MUST search for existing
components and utilities that solve the same problem.
Shared UI elements (buttons, modals, tables, date pickers, filters)
MUST be implemented as reusable components in a shared directory.
Common data transformations (date formatting, currency formatting,
aging bucket calculations) MUST be extracted into shared utility
functions.
Duplicated logic across two or more locations MUST be refactored
into a single shared implementation.
Reusable components MUST be documented with usage examples
and prop definitions.

### VI. Centralized Business Logic

All business rules (aging bucket definitions, debt classification,
calculation formulas, threshold values) MUST live in a single,
clearly identified layer — not scattered across UI components,
API handlers, and database queries.
Business logic MUST be pure functions where possible: given the
same input, always produce the same output, with no side effects.
Configuration values that drive business behavior (aging periods,
warning thresholds, report parameters) MUST be defined in a
central configuration — not hardcoded in multiple files.
Changes to business rules MUST require updating only one location.
If a rule change requires edits in multiple files, the architecture
MUST be refactored to centralize it first.

### VII. Skill-Driven Development

Available Claude Code skills MUST be used when they apply to the
task at hand — including but not limited to: brainstorming,
TDD, debugging, code review, frontend design, and verification.
Before starting implementation, the brainstorming skill MUST be
invoked to explore requirements and design.
After completing implementation, the verification skill MUST be
used to confirm end-to-end correctness.
The code-review skill MUST be used before merging any significant
change to catch issues early.

## Commit & Safety Standards

Every completed task or logical unit of work MUST be committed
immediately — do not batch multiple unrelated changes.
Commit messages MUST be descriptive: `type(scope): description`
format (e.g., `feat(aging-report): add 90-day bucket filter`).
No force-pushes to shared branches without team agreement.
Sensitive data (credentials, patient data, API keys) MUST never
appear in commits — use environment variables exclusively.
Before marking work as done, `git status` MUST show a clean
working tree with all changes committed.

## Development Workflow

1. **Brainstorm**: Use the brainstorming skill to clarify
   requirements before touching code.
2. **Plan**: Break work into testable tasks using speckit tools.
3. **TDD Loop**: For each task — write failing test, implement,
   refactor, commit.
4. **Review**: Use code-review skill on completed work.
5. **Verify**: Use verification skill to confirm end-to-end
   behavior.
6. **Commit & Push**: Ensure all changes are committed with
   descriptive messages.

Code review checklist gates:
- All tests pass
- No linting errors
- No type errors
- Business logic is centralized
- UI components are reusable (not duplicated)
- Performance budgets are met
- Thai language strings are correct

## Governance

This constitution is the authoritative source of development
standards for the Debt Aging Analysis project. All code
contributions MUST comply with these principles.

**Amendment procedure**:
1. Propose the change with rationale.
2. Update the constitution with version bump.
3. Propagate changes to dependent templates.
4. Document the change in the Sync Impact Report.

**Versioning policy**: Semantic versioning (MAJOR.MINOR.PATCH).
- MAJOR: Principle removed or fundamentally redefined.
- MINOR: New principle added or existing one materially expanded.
- PATCH: Clarifications, wording fixes, non-semantic refinements.

**Compliance review**: Every code review MUST verify adherence
to these principles. Violations MUST be resolved before merge.

**Version**: 1.0.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-24
