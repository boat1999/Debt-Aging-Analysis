# Tasks: BMS Debt Aging Analysis Dashboard

**Input**: Design documents from `/specs/001-debt-aging-dashboard/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/hosxp-api.md

**Tests**: TDD is NON-NEGOTIABLE per constitution. All test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and shared configuration

- [x] T001 Initialize Vite + React + TypeScript project with `npm create vite@latest . -- --template react-ts` and install dependencies (react, react-dom, react-router-dom, antd, @ant-design/icons, @tanstack/react-query, echarts, echarts-for-react, js-cookie, xlsx, dayjs, tailwindcss)
- [x] T002 Configure TailwindCSS with `tailwind.config.ts` and add Tailwind directives to `src/index.css`
- [x] T003 [P] Configure ESLint + Prettier in `.eslintrc.cjs` and `.prettierrc`
- [x] T004 [P] Configure Vitest + React Testing Library + MSW in `vitest.config.ts` and `tests/setup.ts`
- [x] T005 [P] Create TypeScript type definitions in `src/types/debt.ts`, `src/types/session.ts`, `src/types/pttype.ts` based on data-model.md
- [x] T006 [P] Create centralized constants in `src/config/constants.ts` — aging bucket definitions (0-30, 31-60, 61-90, 91-180, >180), alert thresholds, query cache times, refresh intervals
- [x] T007 [P] Create React Query key constants in `src/config/query-keys.ts`

**Checkpoint**: Project builds, lints, and tests run (even if no tests yet)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and API client that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] Unit tests for money/date formatting in `tests/unit/utils/format.test.ts` — test formatMoney (Thai number format, right-align data), formatDate (Thai date), formatNumber (comma-separated)
- [x] T009 [P] Unit tests for aging calculation in `tests/unit/utils/aging.test.ts` — test calculateAgingBucket for all 5 buckets, edge cases (NULL date, future date, exactly on boundary)
- [x] T010 [P] Unit tests for SQL minification in `tests/unit/utils/sql.test.ts` — test comment removal, whitespace collapse, trim
- [x] T011 [P] Unit tests for constants validation in `tests/unit/config/constants.test.ts` — verify aging buckets are contiguous, thresholds are ordered

### Implementation for Foundational

- [x] T012 [P] Implement formatMoney, formatDate, formatNumber utilities in `src/utils/format.ts`
- [x] T013 [P] Implement calculateAgingBucket, getAgingColor, getAgingLabel utilities in `src/utils/aging.ts`
- [x] T014 [P] Implement minifySql utility in `src/utils/sql.ts`
- [x] T015 Implement HOSxP API client in `src/api/hosxp-client.ts` — validateSession(sessionId), querySql<T>(config, sql) with retry logic (3 attempts), error handling (401/502), SQL minification
- [x] T016 [P] Create MSW handlers for HOSxP API in `tests/setup.ts` — mock PasteJSON validation endpoint and SQL query endpoint
- [x] T017 [P] Create shared LoadingState component in `src/components/shared/LoadingState.tsx`
- [x] T018 [P] Create shared ErrorState component in `src/components/shared/ErrorState.tsx`
- [x] T019 [P] Create shared EmptyState component in `src/components/shared/EmptyState.tsx`
- [x] T020 [P] Create shared MoneyCell component in `src/components/shared/MoneyCell.tsx` — right-aligned, Thai format, uses formatMoney
- [x] T021 [P] Create shared AgingBadge component in `src/components/shared/AgingBadge.tsx` — color-coded badge using getAgingColor

**Checkpoint**: Foundation ready — all utilities tested and passing, API client works, shared components available

---

## Phase 3: User Story 2 - Authenticate via BMS Session (Priority: P1)

**Goal**: Users can authenticate via BMS Session ID from URL param, cookie, or manual input

**Independent Test**: Open app with/without session ID, verify cookie storage, validation, and login page

> **Note**: US2 (auth) is implemented before US1 (overview) because authentication gates all data access.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T022 [P] [US2] Integration test for session flow in `tests/integration/session.test.ts` — test URL param capture + cookie storage, cookie-based auto-login, manual login page display, expired session handling, logout

### Implementation for User Story 2

- [x] T023 [US2] Implement useSession hook in `src/hooks/useSession.ts` — 3-tier acquisition (URL param > cookie > manual), validate via hosxp-client, store in cookie (7-day expiry), remove param from URL, expose sessionConfig + userInfo + isLoading + error + logout
- [x] T024 [US2] Create LoginPage in `src/pages/LoginPage.tsx` — session ID input form with Ant Design Form, validation feedback, Thai error messages, submit calls useSession
- [x] T025 [US2] Create AppLayout in `src/components/layout/AppLayout.tsx` — Ant Design Layout with header, content area, responsive for 1366px+ and 768px+
- [x] T026 [US2] Create UserInfo component in `src/components/layout/UserInfo.tsx` — display username + hospital name in header, logout button
- [x] T027 [US2] Configure App router in `src/App.tsx` — React Router with protected routes (redirect to LoginPage if no session), QueryClientProvider with 5-min stale time + 5-min refetch interval
- [x] T028 [US2] Wire entry point in `src/main.tsx` — render App with React StrictMode

**Checkpoint**: User can authenticate via URL param, cookie, or manual entry. Invalid sessions show Thai error. Header shows user info.

---

## Phase 4: User Story 1 - View Debt Aging Overview (Priority: P1) MVP

**Goal**: Dashboard displays summary cards and aging matrix table

**Independent Test**: Log in and view dashboard with summary cards (total debt, records, AR transferred, AR pending) and aging table with insurance types across 5 aging buckets

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T029 [P] [US1] Unit test for aging summary SQL builder in `tests/unit/api/aging-summary.test.ts` — verify generated SQL matches contract, filter params applied correctly
- [x] T030 [P] [US1] Integration test for aging summary display in `tests/integration/aging-summary.test.ts` — mock API returns data, verify cards show correct totals, table rows match insurance types, money values are right-aligned Thai format

### Implementation for User Story 1

- [x] T031 [US1] Implement aging summary SQL query builder in `src/api/queries/aging-summary.ts` — build SQL from contracts/hosxp-api.md with optional filter params (date range, pttype, department, AR status)
- [x] T032 [US1] Implement useAgingSummary hook in `src/hooks/useAgingSummary.ts` — React Query wrapper calling querySql with aging summary SQL, returns AgingSummaryRow[], loading, error states
- [x] T033 [US1] Create SummaryCards component in `src/components/dashboard/SummaryCards.tsx` — 4 Ant Design Statistic cards (total debt, record count, AR transferred, AR pending) using MoneyCell formatting, loading/error/empty states
- [x] T034 [US1] Create AgingTable component in `src/components/dashboard/AgingTable.tsx` — Ant Design Table with insurance type rows, 5 aging bucket columns + total column, totals row at bottom, all amounts via MoneyCell, clickable rows (onClick prop for drill-down), loading/empty states
- [x] T035 [US1] Create DashboardPage in `src/pages/DashboardPage.tsx` — compose SummaryCards + AgingTable, pass data from useAgingSummary

**Checkpoint**: Dashboard shows real data — 4 summary cards with totals, aging table with insurance types across 5 buckets. All money right-aligned Thai format.

---

## Phase 5: User Story 3 - View Aging Charts and Alerts (Priority: P2)

**Goal**: Dashboard displays stacked bar, pie, trend charts and alert panel

**Independent Test**: Verify charts render with correct data, alerts show critical/warning with amounts and counts

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T036 [P] [US3] Unit test for alert summary SQL builder in `tests/unit/api/alert-summary.test.ts`
- [x] T037 [P] [US3] Unit test for trend SQL builder in `tests/unit/api/trend.test.ts`
- [x] T038 [P] [US3] Integration test for alert panel in `tests/integration/alert-panel.test.ts` — verify critical (red) and warning (orange) alerts display correct amounts/counts

### Implementation for User Story 3

- [x] T039 [P] [US3] Implement alert summary SQL query builder in `src/api/queries/alert-summary.ts`
- [x] T040 [P] [US3] Implement trend SQL query builder in `src/api/queries/trend.ts`
- [x] T041 [P] [US3] Implement useAlertSummary hook in `src/hooks/useAlertSummary.ts`
- [x] T042 [P] [US3] Implement useTrendData hook in `src/hooks/useTrendData.ts`
- [x] T043 [US3] Create AlertPanel component in `src/components/dashboard/AlertPanel.tsx` — Ant Design Alert components, critical (red) for >180d no AR, warning (orange) for 91-180d no AR, info (yellow) for 61-90d, show amounts (MoneyCell) + counts
- [x] T044 [US3] Create AgingBarChart component in `src/components/dashboard/AgingBarChart.tsx` — ECharts stacked bar, X-axis = aging buckets, Y-axis = amounts, series per top insurance type, Thai labels, responsive
- [x] T045 [US3] Create PttypePieChart component in `src/components/dashboard/PttypePieChart.tsx` — ECharts pie chart, slices per insurance type, Thai labels, amounts in tooltip
- [x] T046 [US3] Create TrendLineChart component in `src/components/dashboard/TrendLineChart.tsx` — ECharts line chart, X-axis = months (12), Y-axis = new debt amount, AR amount overlay, Thai labels
- [x] T047 [US3] Update DashboardPage in `src/pages/DashboardPage.tsx` — add AlertPanel, AgingBarChart, PttypePieChart, TrendLineChart below aging table, lazy-load chart components

**Checkpoint**: Dashboard shows alerts + 3 charts. Charts render with correct data. Alerts reflect actual thresholds.

---

## Phase 6: User Story 4 - Filter and Search (Priority: P2)

**Goal**: Users can filter dashboard by date range, insurance type, department, AR status, claim status, patient search, and minimum amount

**Independent Test**: Apply filter combinations, verify all dashboard components (cards, table, charts, alerts) update to reflect filtered data

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T048 [P] [US4] Integration test for filter application in `tests/integration/filters.test.ts` — apply date range filter, verify aging summary query includes WHERE clause, verify cards/table update

### Implementation for User Story 4

- [x] T049 [US4] Create DashboardFilters component in `src/components/dashboard/DashboardFilters.tsx` — Ant Design Form with: DateRangePicker (debt_date), Multi-Select (pttype), Select (AR status: all/transferred/pending), Select (department: all/OPD/IPD), Select (claim status), Search input (HN/name), NumberInput (min amount), Search + Reset buttons
- [x] T050 [US4] Update aging summary SQL builder in `src/api/queries/aging-summary.ts` — accept FilterState, append WHERE clauses for each active filter
- [x] T051 [US4] Update alert summary and trend SQL builders in `src/api/queries/alert-summary.ts` and `src/api/queries/trend.ts` — accept FilterState
- [x] T052 [US4] Update DashboardPage in `src/pages/DashboardPage.tsx` — add DashboardFilters, manage FilterState with useState, pass filters to all hooks (useAgingSummary, useAlertSummary, useTrendData), implement reset handler

**Checkpoint**: All filters work. Applying filters updates cards, table, charts, and alerts. Reset returns to defaults.

---

## Phase 7: User Story 5 - Drill Down Details (Priority: P3)

**Goal**: Click insurance type in aging table to see individual debt records

**Independent Test**: Click insurance type row, navigate to detail page showing individual debts with correct columns and formatting

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T053 [P] [US5] Unit test for debt detail SQL builder in `tests/unit/api/debt-detail.test.ts` — verify SQL includes pttype filter and LIMIT
- [x] T054 [P] [US5] Integration test for drill-down navigation in `tests/integration/drill-down.test.ts` — click insurance row, verify navigation to detail page, verify table columns

### Implementation for User Story 5

- [x] T055 [US5] Implement debt detail SQL query builder in `src/api/queries/debt-detail.ts` — parameterized by pttype, includes patient JOIN, LIMIT 1000
- [x] T056 [US5] Implement useDebtDetail hook in `src/hooks/useDebtDetail.ts` — React Query wrapper, accepts pttype param
- [x] T057 [US5] Create DetailFilters component in `src/components/detail/DetailFilters.tsx` — date range, AR status, department, claim status, HN/name search for detail page
- [x] T058 [US5] Create DebtTable component in `src/components/detail/DebtTable.tsx` — Ant Design Table with columns: #, document number, HN, patient name, debt date, total amount (MoneyCell), outstanding (MoneyCell), aging days (AgingBadge), AR status, claim status, department. Pagination, sorting by debt_date
- [x] T059 [US5] Create DebtDetailPage in `src/pages/DebtDetailPage.tsx` — receive pttype from route params, display insurance type name as header, compose DetailFilters + DebtTable, back navigation to dashboard
- [x] T060 [US5] Update AgingTable in `src/components/dashboard/AgingTable.tsx` — add onClick handler to navigate to `/detail/:pttype` using React Router
- [x] T061 [US5] Update App router in `src/App.tsx` — add route for `/detail/:pttype` pointing to DebtDetailPage

**Checkpoint**: Clicking insurance type navigates to detail page. Detail table shows individual debts with all columns. Money right-aligned. Back navigation works.

---

## Phase 8: User Story 6 - Export Reports (Priority: P3)

**Goal**: Export aging summary and detail data to Excel, print dashboard

**Independent Test**: Click export buttons, verify Excel files download with correct data and formatting

### Tests for User Story 6

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T062 [P] [US6] Unit test for export utilities in `tests/unit/utils/export.test.ts` — test Excel worksheet generation with Thai formatting, right-aligned money columns, max row limit

### Implementation for User Story 6

- [x] T063 [US6] Implement export utilities in `src/utils/export.ts` — exportAgingSummaryToExcel (aging table data → xlsx with formatted columns), exportDetailToExcel (detail rows → xlsx, max 10,000 rows), triggerPrint (window.print with print media CSS)
- [x] T064 [US6] Create ExportButton component in `src/components/shared/ExportButton.tsx` — Ant Design Button with dropdown: Export Excel, Print. Accepts data and export type props
- [x] T065 [US6] Add print CSS in `src/index.css` — @media print rules for dashboard layout (hide filters, full-width tables, page breaks)
- [x] T066 [US6] Update DashboardPage in `src/pages/DashboardPage.tsx` — add ExportButton with aging summary data export
- [x] T067 [US6] Update DebtDetailPage in `src/pages/DebtDetailPage.tsx` — add ExportButton with detail data export

**Checkpoint**: Excel export downloads correctly formatted file. Print shows clean layout. Detail export respects 10K row limit.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T068 [P] Add responsive breakpoints for tablet (768px) across all pages in `src/index.css` and component styles
- [x] T069 [P] Verify Thai language strings across all components — labels, error messages, date formats, empty states
- [x] T070 Implement lazy loading for chart components and detail page via React.lazy in `src/App.tsx`
- [x] T071 [P] Add Vite proxy configuration for HOSxP API in `vite.config.ts`
- [x] T072 Bundle size audit — verify < 500KB gzipped with `npx vite-bundle-visualizer`, tree-shake ECharts
- [x] T073 Run quickstart.md validation — verify all setup steps work from clean clone
- [x] T074 Final type-check and lint pass — `npm run type-check && npm run lint`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US2 Auth (Phase 3)**: Depends on Phase 2 — BLOCKS US1 (need session to fetch data)
- **US1 Overview (Phase 4)**: Depends on Phase 3 (auth required for API calls)
- **US3 Charts (Phase 5)**: Depends on Phase 4 (needs aging data + dashboard page)
- **US4 Filters (Phase 6)**: Depends on Phase 4 (needs dashboard components to filter)
- **US5 Drill-down (Phase 7)**: Depends on Phase 4 (needs aging table to click)
- **US6 Export (Phase 8)**: Depends on Phase 4 (needs data to export)
- **Polish (Phase 9)**: Depends on all desired user stories

### User Story Dependencies

- **US2 (P1 Auth)**: Can start after Phase 2 — no story dependencies
- **US1 (P1 Overview)**: Depends on US2 (needs authenticated session)
- **US3 (P2 Charts)**: Depends on US1 (extends dashboard page)
- **US4 (P2 Filters)**: Depends on US1 (filters affect dashboard data)
- **US5 (P3 Drill-down)**: Depends on US1 (navigates from aging table)
- **US6 (P3 Export)**: Depends on US1 (exports dashboard data)

> **Note**: US3, US4, US5, US6 can run in parallel after US1 is complete.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Types/models before hooks
- Hooks before components
- Components before page composition
- Commit after each task

### Parallel Opportunities

- Phase 1: T003, T004, T005, T006, T007 can run in parallel
- Phase 2: T008-T011 (tests) in parallel, then T012-T014 (utils) in parallel, then T017-T021 (shared components) in parallel
- After US1 complete: US3, US4, US5, US6 can proceed in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tests together:
Task: "Unit tests for formatting in tests/unit/utils/format.test.ts"
Task: "Unit tests for aging in tests/unit/utils/aging.test.ts"
Task: "Unit tests for SQL minification in tests/unit/utils/sql.test.ts"
Task: "Unit tests for constants in tests/unit/config/constants.test.ts"

# Launch all utility implementations together:
Task: "Implement format utilities in src/utils/format.ts"
Task: "Implement aging utilities in src/utils/aging.ts"
Task: "Implement SQL utility in src/utils/sql.ts"

# Launch all shared components together:
Task: "Create LoadingState in src/components/shared/LoadingState.tsx"
Task: "Create ErrorState in src/components/shared/ErrorState.tsx"
Task: "Create EmptyState in src/components/shared/EmptyState.tsx"
Task: "Create MoneyCell in src/components/shared/MoneyCell.tsx"
Task: "Create AgingBadge in src/components/shared/AgingBadge.tsx"
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US2 Auth
4. Complete Phase 4: US1 Overview
5. **STOP and VALIDATE**: Login works, dashboard shows aging data
6. Deploy/demo if ready — finance officers can already see aging summary

### Incremental Delivery

1. Setup + Foundational + US2 + US1 → MVP (auth + overview)
2. Add US3 → Charts + Alerts
3. Add US4 → Filters
4. Add US5 → Drill-down detail
5. Add US6 → Export
6. Polish → Responsive, performance, Thai verification

### Parallel After MVP

Once US1 is complete, US3/US4/US5/US6 can proceed in parallel:
- Developer A: US3 (Charts + Alerts)
- Developer B: US4 (Filters)
- Developer C: US5 (Drill-down) + US6 (Export)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently testable after completion
- TDD is NON-NEGOTIABLE per constitution — write tests first
- Commit after each task per constitution commit standards
- All money values MUST be right-aligned Thai format (constitution Principle III)
- All business logic in `src/config/` and `src/utils/` (constitution Principle VI)
