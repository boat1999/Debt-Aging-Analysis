# Feature Specification: BMS Debt Aging Analysis Dashboard

**Feature Branch**: `001-debt-aging-dashboard`
**Created**: 2026-03-24
**Status**: Draft
**Input**: User description: "Hospital debt aging analysis dashboard with BMS session auth, aging summary table, charts, drill-down by insurance type, alerts, filters, and export"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Debt Aging Overview (Priority: P1)

As a hospital finance officer, I want to see a summary of all outstanding
debts organized by aging buckets (0-30, 31-60, 61-90, 91-180, >180 days)
grouped by patient insurance type, so I can quickly understand which
insurance categories have the oldest and largest outstanding debts.

The dashboard displays four summary cards at the top (total debt amount,
total records, AR transferred amount, AR pending amount) followed by an
aging matrix table that breaks down each insurance type across five aging
buckets with totals.

**Why this priority**: This is the core value proposition. Finance
officers currently have no tool to visualize the ~82.5M baht in
outstanding debt by age and insurance type.

**Independent Test**: Can be fully tested by logging in and viewing
the dashboard page. Delivers immediate value by showing debt aging
distribution across all insurance types.

**Acceptance Scenarios**:

1. **Given** the user has a valid BMS session, **When** they open the
   dashboard, **Then** they see four summary cards showing total debt
   amount, total record count, AR transferred amount, and AR pending
   amount.

2. **Given** the dashboard has loaded, **When** the user views the aging
   table, **Then** each row shows an insurance type with debt amounts
   distributed across five aging buckets (0-30d, 31-60d, 61-90d,
   91-180d, >180d) plus a total column.

3. **Given** the aging table is displayed, **When** the user looks at
   the bottom row, **Then** they see totals for each aging bucket
   across all insurance types.

4. **Given** any money value is displayed, **When** the user views it,
   **Then** the value is right-aligned and formatted with Thai number
   format (comma-separated thousands, two decimal places).

---

### User Story 2 - Authenticate via BMS Session (Priority: P1)

As a hospital staff member using HOSxP desktop application, I want
to be automatically authenticated when I open the debt aging dashboard
through HOSxP, so I do not need to enter separate credentials.

The system accepts a BMS session ID via URL parameter, stores it in
a cookie for 7 days, validates it against the HOSxP API, and retrieves
the API connection details needed to query data. If no session is found,
a manual entry page is shown.

**Why this priority**: Authentication is a prerequisite for all data
access. Co-P1 with the overview because it gates all functionality.

**Independent Test**: Can be tested by opening the app with and without
a session ID parameter, verifying cookie storage and session validation.

**Acceptance Scenarios**:

1. **Given** the user opens the app with `?bms-session-id=VALID_ID`,
   **When** the page loads, **Then** the session ID is stored in a
   cookie (7-day expiry), removed from the URL, validated against
   the HOSxP API, and the user proceeds to the dashboard showing
   their name and hospital name.

2. **Given** the user has a valid session cookie, **When** they open
   the app without URL parameters, **Then** they are automatically
   authenticated using the stored cookie.

3. **Given** no session ID exists (no URL param, no cookie), **When**
   the user opens the app, **Then** they see a login page where they
   can manually enter a session ID.

4. **Given** the user has an expired or invalid session, **When** the
   system validates it, **Then** an error message is displayed in Thai
   and the cookie is cleared.

5. **Given** the user is authenticated, **When** they view the header,
   **Then** they see their username and hospital name with a logout
   option.

---

### User Story 3 - View Aging Charts and Alerts (Priority: P2)

As a finance manager, I want to see visual charts of debt distribution
and receive automated alerts for overdue debts, so I can quickly
identify problem areas and take action on critical items.

Three charts: stacked bar chart (debt by aging bucket and insurance
type), pie chart (debt proportion by insurance type), and trend line
chart (monthly new debt over 12 months). An alert panel highlights
critical (>180 days, no AR transfer) and warning (91-180 days, no AR
transfer) items.

**Why this priority**: Charts and alerts provide analytical value
beyond raw data tables. They enable pattern recognition and early
warning.

**Independent Test**: Can be tested by verifying charts render with
data and alerts display correct severity levels based on aging
thresholds.

**Acceptance Scenarios**:

1. **Given** the dashboard has loaded with data, **When** the user
   views the charts section, **Then** they see a stacked bar chart
   with aging buckets on X-axis, amounts on Y-axis, and colors for
   the top insurance types.

2. **Given** the dashboard has loaded, **When** the user views the
   pie chart, **Then** it shows debt proportion by insurance type.

3. **Given** the dashboard has loaded, **When** the user views the
   trend chart, **Then** it shows monthly new debt amounts for the
   past 12 months.

4. **Given** there are debts older than 180 days without AR transfer,
   **When** the alert panel renders, **Then** a critical alert (red)
   displays the total amount and count.

5. **Given** there are debts between 91-180 days without AR transfer,
   **When** the alert panel renders, **Then** a warning alert (orange)
   displays the total amount and count.

---

### User Story 4 - Filter and Search Debt Data (Priority: P2)

As a finance officer, I want to filter the dashboard by date range,
insurance type, department, AR status, claim status, and search by
patient HN or name, so I can focus on specific subsets of data.

**Why this priority**: Filtering is essential for practical daily use
with 59,000+ records.

**Independent Test**: Can be tested by applying filter combinations
and verifying summary cards, aging table, and charts all update.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** the user selects a date
   range, **Then** all dashboard components update to show only debts
   within that range.

2. **Given** the dashboard is loaded, **When** the user selects
   insurance types from the multi-select, **Then** only those types
   appear in the aging table and charts.

3. **Given** filters are applied, **When** the user clicks Reset,
   **Then** all filters return to defaults and full data is shown.

4. **Given** the user enters a patient HN or name in search, **When**
   the search executes, **Then** data is filtered to matching debts.

---

### User Story 5 - Drill Down into Insurance Type Details (Priority: P3)

As a finance officer, I want to click on an insurance type in the aging
table to see individual debt records, so I can investigate specific
debts and track their status.

**Why this priority**: Drill-down enables actionable follow-up. The
overview provides value even without this detail view.

**Independent Test**: Can be tested by clicking an insurance type row
and verifying the detail table shows correct records.

**Acceptance Scenarios**:

1. **Given** the aging table is displayed, **When** the user clicks an
   insurance type row, **Then** they navigate to a detail page showing
   all unpaid debts for that type.

2. **Given** the detail page is displayed, **When** the user views the
   table, **Then** each row shows: document number, HN, patient name,
   debt date, total amount, outstanding amount, aging days, AR status,
   claim status, and department.

3. **Given** the detail table is displayed, **Then** all money columns
   are right-aligned with Thai number formatting.

4. **Given** many records exist, **Then** results are paginated to
   prevent performance degradation.

---

### User Story 6 - Export Reports (Priority: P3)

As a finance manager, I want to export aging summary and detail data
to Excel and print the dashboard, so I can share reports with
management.

**Why this priority**: Export is a convenience feature. Core analysis
value is delivered through the dashboard itself.

**Independent Test**: Can be tested by clicking export buttons and
verifying generated files contain correct data.

**Acceptance Scenarios**:

1. **Given** the aging summary is displayed, **When** the user clicks
   "Export Excel", **Then** an Excel file downloads with the aging
   summary table, proper Thai formatting, and right-aligned amounts.

2. **Given** the detail page is displayed, **When** the user clicks
   "Export Excel", **Then** an Excel file downloads with detail records
   (maximum 10,000 rows).

3. **Given** the dashboard is displayed, **When** the user clicks
   "Print", **Then** the browser print dialog opens with a
   print-friendly layout.

---

### Edge Cases

- What happens when the HOSxP API is unreachable or returns a 502?
  System displays a user-friendly error with retry option and shows
  last cached data if available.

- What happens when a SQL query takes longer than 10 seconds?
  System cancels the request and displays a timeout message suggesting
  the user narrow their filters.

- What happens when debt_date is NULL or in the future?
  NULL debt_date records are excluded. Future-dated records are placed
  in the 0-30 day bucket.

- What happens when the session expires while viewing the dashboard?
  System detects the 401 response, clears the cookie, and redirects
  to login with a Thai-language session-expired message.

- What happens when there are no unpaid debts?
  Dashboard shows zero values in cards, empty aging table, and a
  message indicating no outstanding debts found.

- What happens when the URL exceeds maximum length due to SQL query?
  System minifies SQL and splits complex queries if necessary.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via BMS Session ID from
  URL parameter, cookie, or manual input.

- **FR-002**: System MUST validate session IDs against the HOSxP
  PasteJSON API and extract API connection details.

- **FR-003**: System MUST store valid session IDs in a cookie with
  7-day expiry and remove the ID from the URL after capture.

- **FR-004**: System MUST display four summary cards: total debt,
  total records, AR transferred, and AR pending for unpaid debts.

- **FR-005**: System MUST display an aging summary table with rows
  per insurance type and columns for five aging buckets plus totals.

- **FR-006**: System MUST calculate aging based on the difference
  between the current date and the debt date.

- **FR-007**: System MUST display a stacked bar chart, pie chart,
  and 12-month trend line chart.

- **FR-008**: System MUST display alerts for critical (>180 days,
  no AR) and warning (91-180 days, no AR) debt levels.

- **FR-009**: System MUST support filtering by date range, insurance
  type, AR status, department, claim status, patient search, and
  minimum amount.

- **FR-010**: System MUST provide drill-down from the aging table to
  individual debt records for a selected insurance type.

- **FR-011**: System MUST display all money values right-aligned with
  Thai number formatting (comma thousands, two decimals).

- **FR-012**: System MUST support Thai language for all user-facing
  text, dates, and messages.

- **FR-013**: System MUST support Excel export (max 10,000 rows) and
  browser printing.

- **FR-014**: System MUST never display the session ID in the URL
  after capture and MUST NOT log the full auth key.

- **FR-015**: System MUST only execute read-only (SELECT) queries.

- **FR-016**: System MUST auto-refresh data every 5 minutes
  (configurable) using stale-while-revalidate caching.

- **FR-017**: System MUST retry failed API calls up to 3 times.

- **FR-018**: System MUST redirect to login on session expiration
  with a Thai-language message.

### Key Entities

- **Debt Record**: An individual outstanding debt with date, amount,
  insurance type, AR transfer status, claim status, department, and
  document reference. Primary entity for aging calculations.

- **Insurance Type**: A patient insurance category with code and Thai
  name. Groups and labels debts in the aging table and charts.

- **Patient**: A hospital patient with HN and name. Used for search
  and detail display.

- **Session Config**: The authenticated connection including API URL,
  auth key, and user info (username, hospital name).

### Assumptions

- The HOSxP API supports CORS or a proxy handles cross-origin requests.
- Data volume (~59,000 records) is manageable for SQL API queries.
- The BMS Session ID API is reliably available during operating hours.
- Users have desktop browsers (Chrome/Firefox/Edge 90+) at 1366px+.
- Money values are Thai Baht only (no multi-currency).
- The system is read-only; no debt modifications are performed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the complete debt aging overview within
  3 seconds of opening the dashboard.

- **SC-002**: Finance officers can identify which insurance type has
  the highest overdue debt (>90 days) within 10 seconds of viewing.

- **SC-003**: Users can filter and drill down to a specific insurance
  type's details within 3 clicks from the main dashboard.

- **SC-004**: The alert panel correctly identifies 100% of critical
  (>180d, no AR) and warning (91-180d, no AR) debts.

- **SC-005**: Exported Excel reports contain accurate data matching
  the dashboard view with proper Thai formatting.

- **SC-006**: The system handles up to 100,000 debt records without
  degradation (queries return within 2 seconds).

- **SC-007**: Session authentication completes within 2 seconds.

- **SC-008**: All money values are right-aligned in Thai number
  format without exception.

- **SC-009**: The dashboard supports desktop (1366px+) and tablet
  (768px+) without layout breaking.

- **SC-010**: Data auto-refreshes every 5 minutes without manual
  page reload.
