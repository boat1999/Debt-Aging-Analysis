# Implementation Plan: BMS Debt Aging Analysis Dashboard

**Branch**: `001-debt-aging-dashboard` | **Date**: 2026-03-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-debt-aging-dashboard/spec.md`

## Summary

Build a React SPA dashboard for analyzing hospital accounts receivable
aging data (~82.5M baht across ~59,000 records). The dashboard connects
to HOSxP MySQL database via BMS Session ID API, displays aging summary
by insurance type across 5 time buckets, provides visual charts
(stacked bar, pie, trend line), alerts for overdue debts, drill-down
detail views, comprehensive filtering, and Excel/print export.
Authentication uses BMS Session ID passed via URL parameter from the
HOSxP desktop application.

## Technical Context

**Language/Version**: TypeScript 5.6+ with React 18.3
**Primary Dependencies**: React 18, Ant Design 5, TanStack Query 5,
Apache ECharts 5, TailwindCSS 3.4, React Router 6, js-cookie 3,
xlsx 0.18, dayjs 1.11
**Storage**: HOSxP MySQL (read-only via REST SQL API) — no local storage
beyond cookie for session ID
**Testing**: Vitest + React Testing Library + MSW (Mock Service Worker)
**Target Platform**: Web browser (Chrome/Firefox/Edge 90+), Desktop
1366px+, Tablet 768px+
**Project Type**: Single-page web application (Vite-built React SPA)
**Performance Goals**: Initial load < 3s, SQL queries < 2s for 100K
records, bundle < 500KB gzipped
**Constraints**: Read-only SQL via GET requests (URL length limits),
Thai language UI, BMS Session ID auth (not standard OAuth), CORS
may require proxy
**Scale/Scope**: ~59,000 debt records, 354 insurance types, 118K
patients, 3 pages, ~20 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality First | PASS | TypeScript strict mode, ESLint + Prettier configured, explicit types for all API responses and business logic |
| II. Test-Driven Development | PASS | Vitest + RTL for unit/integration tests. TDD workflow: test aging calculations first, then implement. MSW for API boundary mocks only |
| III. User Experience Consistency | PASS | Ant Design 5 design system throughout. Loading/error/empty states for all data views. Thai language for all UI text |
| IV. Performance Requirements | PASS | Bundle target < 500KB. Pagination/virtualization for tables > 100 rows. React Query cache with 5min stale-while-revalidate |
| V. Reusable Components | PASS | Shared components: MoneyCell, AgingBadge, ExportButton. Shared utils: formatMoney, formatDate, calculateAgingBucket |
| VI. Centralized Business Logic | PASS | Aging bucket definitions, alert thresholds, and format rules in `src/config/` constants. Pure functions in `src/utils/aging.ts` |
| VII. Skill-Driven Development | PASS | Using speckit for planning. TDD skill for implementation. Code review before merge |

No violations. All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-debt-aging-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── hosxp-api.md     # HOSxP API contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.tsx                          # Entry point + providers
├── App.tsx                           # Router + Layout
├── config/
│   ├── constants.ts                  # Aging buckets, thresholds, defaults
│   └── query-keys.ts                 # React Query key constants
├── api/
│   ├── hosxp-client.ts               # Session validation + SQL execution
│   └── queries/
│       ├── aging-summary.ts          # Aging SQL query builder
│       ├── debt-detail.ts            # Detail SQL query builder
│       ├── alert-summary.ts          # Alert SQL query builder
│       └── trend.ts                  # Monthly trend SQL query builder
├── hooks/
│   ├── useSession.ts                 # Session management (URL/cookie/manual)
│   ├── useAgingSummary.ts            # React Query: aging data
│   ├── useDebtDetail.ts              # React Query: debt detail
│   ├── useAlertSummary.ts            # React Query: alert data
│   └── useTrendData.ts              # React Query: trend data
├── pages/
│   ├── LoginPage.tsx                  # Session ID input
│   ├── DashboardPage.tsx              # Main dashboard
│   └── DebtDetailPage.tsx             # Drill-down by pttype
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx              # Ant Design Layout wrapper
│   │   └── UserInfo.tsx               # Header user/hospital info
│   ├── dashboard/
│   │   ├── SummaryCards.tsx            # 4 summary statistic cards
│   │   ├── AgingTable.tsx             # Aging matrix table
│   │   ├── AgingBarChart.tsx          # Stacked bar chart
│   │   ├── PttypePieChart.tsx         # Pie chart by insurance type
│   │   ├── TrendLineChart.tsx         # Monthly trend line
│   │   ├── AlertPanel.tsx             # Critical/warning alerts
│   │   └── DashboardFilters.tsx       # Filter controls
│   ├── detail/
│   │   ├── DebtTable.tsx              # Debt detail table
│   │   └── DetailFilters.tsx          # Detail page filters
│   └── shared/
│       ├── MoneyCell.tsx              # Right-aligned Thai money format
│       ├── AgingBadge.tsx             # Color badge by aging days
│       ├── ExportButton.tsx           # Excel/print export
│       ├── LoadingState.tsx           # Consistent loading spinner
│       ├── ErrorState.tsx             # Consistent error display
│       └── EmptyState.tsx             # Consistent empty data message
├── utils/
│   ├── format.ts                      # formatMoney, formatDate, formatNumber
│   ├── aging.ts                       # calculateAgingBucket, getAgingColor
│   ├── sql.ts                         # minifySql utility
│   └── export.ts                      # Excel/print export logic
└── types/
    ├── debt.ts                        # DebtRecord, AgingSummary, AgingBucket
    ├── session.ts                     # SessionConfig, UserInfo
    └── pttype.ts                      # PttypeInfo

tests/
├── unit/
│   ├── utils/
│   │   ├── format.test.ts             # Money/date formatting tests
│   │   ├── aging.test.ts              # Aging bucket calculation tests
│   │   └── sql.test.ts                # SQL minification tests
│   └── config/
│       └── constants.test.ts          # Constants validation tests
├── integration/
│   ├── session.test.ts                # Session flow tests
│   ├── aging-summary.test.ts          # Aging data fetch + transform tests
│   └── filters.test.ts               # Filter application tests
└── setup.ts                           # Test setup (MSW handlers)
```

**Structure Decision**: Single project (Option 1 adapted for React SPA).
This is a frontend-only application that queries an external API directly.
No backend component needed — the HOSxP API serves as the data layer.
The `src/` structure follows React conventions with clear separation:
`api/` for data access, `hooks/` for React Query wrappers, `utils/`
for pure business logic, `components/` for UI, `config/` for centralized
constants.

## Complexity Tracking

No violations to justify. All architecture decisions align with
constitution principles.
