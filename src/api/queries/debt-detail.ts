import type { FilterState } from '../../types/debt';
import { EXPORT_CONFIG } from '../../config/constants';
import { escapeLikePattern, validateIsoDate, validatePttypeCode } from '../../utils/sql';

export function buildDebtDetailSql(pttype: string, filters?: FilterState): string {
  const validPttype = validatePttypeCode(pttype);
  if (!validPttype) {
    throw new Error('รหัสสิทธิไม่ถูกต้อง');
  }
  const whereConditions = ['d.paid IS NULL', `d.pttype = '${validPttype}'`];

  if (filters) {
    if (filters.dateRange) {
      const start = validateIsoDate(filters.dateRange[0]);
      const end = validateIsoDate(filters.dateRange[1]);
      if (start && end) {
        whereConditions.push(`d.debt_date BETWEEN '${start}' AND '${end}'`);
      }
    }
    if (filters.arStatus === 'transferred') {
      whereConditions.push(`d.ar_transfer = 'Y'`);
    } else if (filters.arStatus === 'pending') {
      whereConditions.push('d.ar_transfer IS NULL');
    }
    if (filters.department === 'OPD' || filters.department === 'IPD') {
      whereConditions.push(`d.department = '${filters.department}'`);
    }
    if (filters.searchText) {
      const s = escapeLikePattern(filters.searchText);
      whereConditions.push(
        `(d.hn LIKE '%${s}%' ESCAPE '\\' OR pt.fname LIKE '%${s}%' ESCAPE '\\' OR pt.lname LIKE '%${s}%' ESCAPE '\\')`,
      );
    }
  }

  const where = whereConditions.join(' AND ');

  return `
    SELECT
      d.debt_id, d.debt_doc_id, d.vn, d.hn,
      pt.pname || pt.fname || ' ' || pt.lname AS patient_name,
      d.debt_date, d.total_amount, d.discount_amount, d.ofc_paid_amount,
      (d.total_amount - COALESCE(d.ofc_paid_amount, 0)) AS outstanding,
      (CURRENT_DATE - d.debt_date) AS aging_days,
      d.ar_transfer, d.ar_transfer_datetime,
      d.claim_status, d.claim_ref_code,
      d.department, d.finance_number
    FROM rcpt_debt d
    LEFT JOIN patient pt ON d.hn = pt.hn
    WHERE ${where}
    ORDER BY d.debt_date DESC
    LIMIT ${EXPORT_CONFIG.detailQueryLimit}
  `;
}
