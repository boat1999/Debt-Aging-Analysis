import type { FilterState } from '../../types/debt';

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

export function buildAgingSummarySql(filters?: FilterState): string {
  const whereConditions = ['d.paid IS NULL'];

  if (filters) {
    if (filters.dateRange) {
      whereConditions.push(`d.debt_date BETWEEN '${filters.dateRange[0]}' AND '${filters.dateRange[1]}'`);
    }
    if (filters.pttypes.length > 0) {
      const list = filters.pttypes.map((p) => `'${escapeSql(p)}'`).join(',');
      whereConditions.push(`d.pttype IN (${list})`);
    }
    if (filters.arStatus === 'transferred') {
      whereConditions.push(`d.ar_transfer = 'Y'`);
    } else if (filters.arStatus === 'pending') {
      whereConditions.push('d.ar_transfer IS NULL');
    }
    if (filters.department !== 'all') {
      whereConditions.push(`d.department = '${escapeSql(filters.department)}'`);
    }
    if (filters.claimStatus) {
      whereConditions.push(`d.claim_status = '${escapeSql(filters.claimStatus)}'`);
    }
    if (filters.minAmount !== null && filters.minAmount > 0) {
      whereConditions.push(`d.total_amount >= ${filters.minAmount}`);
    }
  }

  const where = whereConditions.join(' AND ');

  return `
    SELECT
      d.pttype,
      p.name AS pttype_name,
      COUNT(*) AS total_count,
      SUM(d.total_amount) AS total_amount,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 0 AND 30 THEN d.total_amount ELSE 0 END) AS aging_0_30,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 0 AND 30 THEN 1 ELSE 0 END) AS count_0_30,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 31 AND 60 THEN d.total_amount ELSE 0 END) AS aging_31_60,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 31 AND 60 THEN 1 ELSE 0 END) AS count_31_60,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 61 AND 90 THEN d.total_amount ELSE 0 END) AS aging_61_90,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 61 AND 90 THEN 1 ELSE 0 END) AS count_61_90,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 91 AND 180 THEN d.total_amount ELSE 0 END) AS aging_91_180,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 91 AND 180 THEN 1 ELSE 0 END) AS count_91_180,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) > 180 THEN d.total_amount ELSE 0 END) AS aging_over_180,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) > 180 THEN 1 ELSE 0 END) AS count_over_180,
      SUM(CASE WHEN d.ar_transfer = 'Y' THEN d.total_amount ELSE 0 END) AS ar_transferred,
      SUM(CASE WHEN d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END) AS ar_pending
    FROM rcpt_debt d
    LEFT JOIN pttype p ON d.pttype = p.pttype
    WHERE ${where}
    GROUP BY d.pttype, p.name
    ORDER BY total_amount DESC
  `;
}
