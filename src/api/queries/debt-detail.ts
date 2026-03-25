import type { FilterState } from '../../types/debt';
import { EXPORT_CONFIG } from '../../config/constants';

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

export function buildDebtDetailSql(pttype: string, filters?: FilterState): string {
  const whereConditions = ['d.paid IS NULL', `d.pttype = '${escapeSql(pttype)}'`];

  if (filters) {
    if (filters.dateRange) {
      whereConditions.push(`d.debt_date BETWEEN '${filters.dateRange[0]}' AND '${filters.dateRange[1]}'`);
    }
    if (filters.arStatus === 'transferred') {
      whereConditions.push(`d.ar_transfer = 'Y'`);
    } else if (filters.arStatus === 'pending') {
      whereConditions.push('d.ar_transfer IS NULL');
    }
    if (filters.department !== 'all') {
      whereConditions.push(`d.department = '${escapeSql(filters.department)}'`);
    }
    if (filters.searchText) {
      const s = filters.searchText.replace(/'/g, "''");
      whereConditions.push(`(d.hn LIKE '%${s}%' OR pt.fname LIKE '%${s}%' OR pt.lname LIKE '%${s}%')`);
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
