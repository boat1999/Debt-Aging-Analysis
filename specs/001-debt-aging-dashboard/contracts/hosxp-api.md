# HOSxP API Contract

**Date**: 2026-03-24
**Type**: External REST API (read-only consumer)

## Overview

This application consumes two HOSxP API endpoints. We do not control
these APIs — they are provided by the hospital information system.

---

## 1. Session Validation

**Endpoint**: `GET https://hosxp.net/phapi/PasteJSON`

**Purpose**: Validate a BMS session ID and retrieve API connection
details.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Action | string | Yes | Always "GET" |
| code | string | Yes | BMS Session ID (URL-encoded) |

**Success Response** (HTTP 200):

```json
{
  "MessageCode": 200,
  "Message": "Success",
  "result": {
    "key_value": {
      "hosxp.api_url": "https://hospital.example.com",
      "hosxp.api_auth_key": "AUTH_KEY_HERE"
    },
    "user_info": {
      "fullname": "นพ.สมชาย",
      "hospital_name": "รพ.อุตรดิตถ์",
      "hosxp.api_url": "https://hospital.example.com",
      "hosxp.api_auth_key": "AUTH_KEY_HERE",
      "bms_url": "https://hospital.example.com",
      "bms_session_code": "AUTH_KEY_HERE"
    }
  }
}
```

**API URL Resolution** (fallback chain):
1. `result.key_value['hosxp.api_url']`
2. `result.user_info['hosxp.api_url']`
3. `result.user_info.bms_url`

**Auth Key Resolution** (fallback chain):
1. `result.key_value['hosxp.api_auth_key']`
2. `result.user_info['hosxp.api_auth_key']`
3. `result.user_info.bms_session_code`
4. `result.key_value` (if it is a plain string)

**Error Response** (HTTP 200 with error code, or HTTP 500):

```json
{
  "MessageCode": 500,
  "Message": "Session expired or invalid"
}
```

---

## 2. SQL Query Execution

**Endpoint**: `GET {apiUrl}/api/sql`

**Purpose**: Execute read-only SQL queries against HOSxP MySQL.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sql | string | Yes | SQL query (URL-encoded, minified) |
| app | string | Yes | Application identifier ("BMS.Dashboard.React") |

**Headers**:

| Header | Value |
|--------|-------|
| Authorization | `Bearer {apiAuthKey}` |
| Content-Type | `application/json` |

**Success Response** (HTTP 200):

```json
{
  "MessageCode": 200,
  "Message": "Success",
  "data": [
    { "column1": "value1", "column2": 123 }
  ]
}
```

**Error Responses**:

| HTTP Status | Meaning | Application Action |
|-------------|---------|-------------------|
| 200 + MessageCode != 200 | Query error | Show error message |
| 401 | Auth key expired | Redirect to login |
| 502 | Tunnel connection error | Show connectivity error + retry |

**Constraints**:
- GET only — no POST support
- SQL must be minified (no comments, collapsed whitespace)
- URL total length should stay under ~2000 characters
- Only SELECT queries (read-only)
- Results returned as JSON array of objects

---

## SQL Queries Used

### Aging Summary

```sql
SELECT d.pttype, p.name AS pttype_name, COUNT(*) AS total_count,
SUM(d.total_amount) AS total_amount,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 0 AND 30
THEN d.total_amount ELSE 0 END) AS aging_0_30,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 0 AND 30
THEN 1 ELSE 0 END) AS count_0_30,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 31 AND 60
THEN d.total_amount ELSE 0 END) AS aging_31_60,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 31 AND 60
THEN 1 ELSE 0 END) AS count_31_60,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 61 AND 90
THEN d.total_amount ELSE 0 END) AS aging_61_90,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 61 AND 90
THEN 1 ELSE 0 END) AS count_61_90,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 91 AND 180
THEN d.total_amount ELSE 0 END) AS aging_91_180,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 91 AND 180
THEN 1 ELSE 0 END) AS count_91_180,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) > 180
THEN d.total_amount ELSE 0 END) AS aging_over_180,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) > 180
THEN 1 ELSE 0 END) AS count_over_180,
SUM(CASE WHEN d.ar_transfer='Y' THEN d.total_amount ELSE 0 END)
AS ar_transferred,
SUM(CASE WHEN d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END)
AS ar_pending
FROM rcpt_debt d LEFT JOIN pttype p ON d.pttype=p.pttype
WHERE d.paid IS NULL GROUP BY d.pttype,p.name
ORDER BY total_amount DESC
```

### Alert Summary

```sql
SELECT
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date)>180
AND d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END)
AS critical_amount,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date)>180
AND d.ar_transfer IS NULL THEN 1 ELSE 0 END) AS critical_count,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 91 AND 180
AND d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END)
AS warning_amount,
SUM(CASE WHEN DATEDIFF(CURDATE(),d.debt_date) BETWEEN 91 AND 180
AND d.ar_transfer IS NULL THEN 1 ELSE 0 END) AS warning_count
FROM rcpt_debt d WHERE d.paid IS NULL
```

### Monthly Trend

```sql
SELECT DATE_FORMAT(d.debt_date,'%Y-%m') AS month,
SUM(d.total_amount) AS new_debt_amount,
COUNT(*) AS new_debt_count,
SUM(CASE WHEN d.ar_transfer='Y' THEN d.total_amount ELSE 0 END)
AS ar_amount
FROM rcpt_debt d
WHERE d.debt_date>=DATE_SUB(CURDATE(),INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(d.debt_date,'%Y-%m') ORDER BY month
```

### Debt Detail

```sql
SELECT d.debt_id,d.debt_doc_id,d.vn,d.hn,
CONCAT(pt.pname,pt.fname,' ',pt.lname) AS patient_name,
d.debt_date,d.total_amount,d.discount_amount,d.ofc_paid_amount,
(d.total_amount-COALESCE(d.ofc_paid_amount,0)) AS outstanding,
DATEDIFF(CURDATE(),d.debt_date) AS aging_days,
d.ar_transfer,d.ar_transfer_datetime,d.claim_status,
d.claim_ref_code,d.department,d.finance_number
FROM rcpt_debt d LEFT JOIN patient pt ON d.hn=pt.hn
WHERE d.paid IS NULL AND d.pttype='{pttype}'
ORDER BY d.debt_date DESC LIMIT 1000
```
