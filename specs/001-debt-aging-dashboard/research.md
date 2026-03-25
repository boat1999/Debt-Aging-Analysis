# Research: BMS Debt Aging Analysis Dashboard

**Date**: 2026-03-24
**Branch**: `001-debt-aging-dashboard`

## R1: CORS Handling for HOSxP API

**Decision**: Use Vite dev proxy for development; deploy same-origin
or behind BMS Accounting backend proxy for production.

**Rationale**: The HOSxP SQL API likely does not set CORS headers for
arbitrary origins. Vite's `server.proxy` configuration provides
seamless proxying during development. For production, deploying as
a static site on the same server as BMS Accounting (same origin) or
routing API calls through BMS Accounting's backend proxy eliminates
CORS issues without requiring HOSxP API changes.

**Alternatives considered**:
- Modifying HOSxP API to add CORS headers: Not feasible — we do not
  control the HOSxP API server.
- Using a standalone CORS proxy: Adds infrastructure complexity and
  a security concern (auth keys transit through an additional hop).

## R2: Authentication via BMS Session ID

**Decision**: Use cookie-based session storage with 3-tier acquisition
(URL param > cookie > manual input). Validate against
`hosxp.net/phapi/PasteJSON` API.

**Rationale**: The BMS Session ID is the standard auth mechanism used
across BMS applications. The HOSxP desktop app injects the session ID
via URL parameter when opening embedded web apps. Storing in a cookie
(7-day expiry) provides persistence across page reloads. The PasteJSON
endpoint returns both the API URL and auth key needed for SQL queries.

**Alternatives considered**:
- OAuth2/OIDC: HOSxP does not provide an OAuth endpoint.
- JWT tokens: The BMS Session ID already serves as a bearer token
  equivalent through the PasteJSON exchange.

## R3: SQL Query Execution via GET Request

**Decision**: Use GET requests with SQL in query string, minified to
reduce URL length. Apply LIMIT/pagination for large result sets.

**Rationale**: The HOSxP API exposes a GET endpoint at
`{apiUrl}/api/sql?sql=...` that accepts raw SQL. URL length limits
(~2000 chars) require SQL minification (remove comments, collapse
whitespace). All queries are read-only SELECT statements. Complex
queries with many CASE expressions (aging buckets) fit within limits
after minification.

**Alternatives considered**:
- POST requests: The HOSxP API does not support POST for SQL queries
  based on the TLS documentation.
- GraphQL: Not available from HOSxP.

## R4: Charting Library

**Decision**: Apache ECharts via `echarts-for-react` wrapper.

**Rationale**: ECharts handles all required chart types (stacked bar,
pie, line) with excellent performance for the data volumes involved.
It is free and open-source. The `echarts-for-react` wrapper provides
clean React integration with declarative options. Tree-shaking support
helps control bundle size.

**Alternatives considered**:
- Chart.js: Simpler API but less capable for complex stacked charts
  and lacks built-in Thai locale support.
- Recharts: React-native but limited customization for complex
  financial charts.
- D3.js: Too low-level for this use case; would require significantly
  more development time.

## R5: State Management

**Decision**: TanStack Query (React Query) v5 for server state. No
additional client state library needed.

**Rationale**: All state in this application is server state (fetched
from HOSxP API). React Query provides built-in caching (5-minute
stale time), stale-while-revalidate, auto-refresh (refetchInterval),
retry logic, and loading/error states. Filter state can be managed
with React useState + URL search params. No Redux/Zustand needed.

**Alternatives considered**:
- Redux Toolkit + RTK Query: Heavier, adds complexity for a read-only
  dashboard with no complex client-side state.
- SWR: Similar to React Query but fewer features for retry and
  cache management.

## R6: Testing Strategy

**Decision**: Vitest + React Testing Library + MSW (Mock Service Worker).

**Rationale**: Vitest integrates natively with Vite (shared config,
fast HMR-aware test runs). React Testing Library tests components
from the user's perspective. MSW intercepts network requests at the
service worker level, providing realistic API mocking at the system
boundary (constitution: "Mocks MUST only be used at system
boundaries"). Unit tests cover pure business logic (aging
calculations, formatting). Integration tests cover data fetch +
transform + display flows.

**Alternatives considered**:
- Jest: Requires separate configuration from Vite, slower for
  TypeScript projects.
- Cypress: Excellent for E2E but heavyweight for unit/integration
  testing. Can be added later for E2E.

## R7: Export Implementation

**Decision**: SheetJS (xlsx) for Excel export. Browser `window.print()`
with CSS `@media print` for printing.

**Rationale**: SheetJS generates proper .xlsx files client-side without
a server. It supports Thai text, number formatting, and right-aligned
cells. Browser print with CSS print media queries is the simplest
approach for printing and requires no additional library. PDF export
was specified in the TLS but the spec simplified to Excel + print,
which covers the stated need (sharing reports with management).

**Alternatives considered**:
- jsPDF: Adds bundle size and complexity for PDF generation that
  browser print already handles.
- Server-side export: Not feasible — no backend server in this
  architecture.

## R8: Bundle Size Management

**Decision**: Tree-shake ECharts components, lazy-load detail page and
chart components, use Ant Design's modular imports.

**Rationale**: Constitution requires bundle < 500KB gzipped. ECharts
is the largest dependency (~300KB full). Using only required chart
types (bar, pie, line) with tree-shaking reduces this to ~150KB.
Ant Design v5 supports tree-shaking by default. React.lazy for the
detail page and chart components keeps the initial bundle focused on
the critical path (auth + summary cards + aging table).

**Alternatives considered**:
- Removing ECharts for a lighter library: Sacrifices chart quality
  and features that the finance team expects.
- SSR/SSG: Not applicable — this is a SPA with dynamic API data.
