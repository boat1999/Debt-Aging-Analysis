# Data Model: BMS Debt Aging Analysis Dashboard

**Date**: 2026-03-24
**Branch**: `001-debt-aging-dashboard`

## Overview

This application reads data from an external HOSxP MySQL database via
REST API. It does not manage its own database. The entities below
describe the data structures used within the application — both the
source database schema (read-only) and the application-level types
for transformed/aggregated data.

## Source Entities (HOSxP Database — Read-Only)

### DebtRecord (source: `rcpt_debt`)

Represents an individual outstanding debt record in the hospital
billing system.

| Field | Type | Description | Used In |
|-------|------|-------------|---------|
| debt_id | integer | Primary key | All features |
| vn | string | Visit number | Detail view |
| hn | string | Hospital number (FK to patient) | Search, detail |
| debt_date | date | Date the debt was incurred | Aging calculation |
| amount | number | Original amount | Reports |
| total_amount | number | Amount after discounts | Primary amount field |
| discount_amount | number | Discount applied | Detail view |
| paid | string/null | 'Y' if paid, null if unpaid | Filter unpaid |
| pttype | string | Insurance type code (FK) | Group by type |
| ar_transfer | string/null | 'Y' if AR transferred | AR status |
| ar_transfer_datetime | datetime/null | When AR was transferred | Detail view |
| claim_status | string/null | Claim status code | Filter, detail |
| claim_ref_code | string/null | Claim reference | Detail view |
| debt_doc_id | string | Document number (e.g. "3D/150") | Detail view |
| department | string | 'OPD' or 'IPD' | Filter |
| finance_number | string/null | Finance reference | Detail view |
| ofc_paid_amount | number/null | Amount paid by agency | Outstanding calc |

**Key constraint**: Only records where `paid IS NULL` are relevant.

### InsuranceType (source: `pttype`)

| Field | Type | Description |
|-------|------|-------------|
| pttype | string | Primary key — insurance code |
| name | string | Thai name of insurance type |
| debtor | string | Whether this type is a debtor |
| pcode | string | Insurance group code |

### Patient (source: `patient`)

| Field | Type | Description |
|-------|------|-------------|
| hn | string | Primary key — hospital number |
| pname | string | Title/prefix |
| fname | string | First name |
| lname | string | Last name |

**Patient name**: Concatenated as `pname + fname + ' ' + lname`.

## Application Entities (TypeScript Types)

### SessionConfig

Represents an authenticated API connection.

| Field | Type | Description |
|-------|------|-------------|
| apiUrl | string | Base URL for HOSxP API |
| apiAuthKey | string | Bearer token for API requests |
| userInfo | UserInfo | Authenticated user details |

### UserInfo

| Field | Type | Description |
|-------|------|-------------|
| fullname | string | User's display name |
| hospital_name | string | Hospital name |

### AgingSummaryRow

Aggregated aging data for one insurance type.

| Field | Type | Description |
|-------|------|-------------|
| pttype | string | Insurance type code |
| pttype_name | string | Insurance type Thai name |
| total_count | number | Total unpaid records |
| total_amount | number | Total unpaid amount |
| aging_0_30 | number | Amount in 0-30 day bucket |
| count_0_30 | number | Count in 0-30 day bucket |
| aging_31_60 | number | Amount in 31-60 day bucket |
| count_31_60 | number | Count in 31-60 day bucket |
| aging_61_90 | number | Amount in 61-90 day bucket |
| count_61_90 | number | Count in 61-90 day bucket |
| aging_91_180 | number | Amount in 91-180 day bucket |
| count_91_180 | number | Count in 91-180 day bucket |
| aging_over_180 | number | Amount in >180 day bucket |
| count_over_180 | number | Count in >180 day bucket |
| ar_transferred | number | AR transferred amount |
| ar_pending | number | AR pending amount |

### AlertSummary

| Field | Type | Description |
|-------|------|-------------|
| critical_amount | number | Total amount >180d, no AR |
| critical_count | number | Record count >180d, no AR |
| warning_amount | number | Total amount 91-180d, no AR |
| warning_count | number | Record count 91-180d, no AR |

### TrendDataPoint

| Field | Type | Description |
|-------|------|-------------|
| month | string | Year-month (YYYY-MM) |
| new_debt_amount | number | New debt amount in month |
| new_debt_count | number | New debt count in month |
| ar_amount | number | AR transferred in month |

### DebtDetailRow

Individual debt record for drill-down view.

| Field | Type | Description |
|-------|------|-------------|
| debt_id | number | Record identifier |
| debt_doc_id | string | Document reference |
| vn | string | Visit number |
| hn | string | Hospital number |
| patient_name | string | Full patient name |
| debt_date | string | Debt date (YYYY-MM-DD) |
| total_amount | number | Total debt amount |
| discount_amount | number | Discount applied |
| ofc_paid_amount | number | Agency paid amount |
| outstanding | number | Remaining outstanding |
| aging_days | number | Days since debt_date |
| ar_transfer | string/null | AR transfer status |
| ar_transfer_datetime | string/null | AR transfer date |
| claim_status | string/null | Claim status |
| claim_ref_code | string/null | Claim reference |
| department | string | OPD or IPD |
| finance_number | string/null | Finance reference |

### FilterState

| Field | Type | Description |
|-------|------|-------------|
| dateRange | [Date, Date]/null | Debt date range |
| pttypes | string[] | Selected insurance types |
| arStatus | 'all'/'transferred'/'pending' | AR filter |
| department | 'all'/'OPD'/'IPD' | Department filter |
| claimStatus | string/null | Claim status filter |
| searchText | string | HN or patient name search |
| minAmount | number/null | Minimum amount filter |

## Relationships

```
Patient (hn) ──1:N──> DebtRecord (hn)
InsuranceType (pttype) ──1:N──> DebtRecord (pttype)
```

## Aging Bucket Definitions (Centralized)

| Bucket | Label (Thai) | Days Range | Alert Level |
|--------|-------------|------------|-------------|
| current | 0-30 วัน | 0-30 | Normal (green) |
| early | 31-60 วัน | 31-60 | Normal (green) |
| mid | 61-90 วัน | 61-90 | Info (yellow) |
| late | 91-180 วัน | 91-180 | Warning (orange) |
| overdue | >180 วัน | 181+ | Critical (red) |

These definitions MUST be centralized in `src/config/constants.ts`
per constitution Principle VI.
