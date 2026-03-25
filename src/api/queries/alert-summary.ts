import type { FilterState } from '../../types/debt';

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

export function buildAlertSummarySql(filters?: FilterState): string {
  const whereConditions = ['d.paid IS NULL'];

  if (filters) {
    if (filters.dateRange) {
      whereConditions.push(`d.debt_date BETWEEN '${filters.dateRange[0]}' AND '${filters.dateRange[1]}'`);
    }
    if (filters.pttypes.length > 0) {
      const list = filters.pttypes.map((p) => `'${escapeSql(p)}'`).join(',');
      whereConditions.push(`d.pttype IN (${list})`);
    }
    if (filters.department !== 'all') {
      whereConditions.push(`d.department = '${escapeSql(filters.department)}'`);
    }
  }

  const where = whereConditions.join(' AND ');

  return `
    SELECT
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) > 180 AND d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END) AS critical_amount,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) > 180 AND d.ar_transfer IS NULL THEN 1 ELSE 0 END) AS critical_count,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 91 AND 180 AND d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END) AS warning_amount,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 91 AND 180 AND d.ar_transfer IS NULL THEN 1 ELSE 0 END) AS warning_count
    FROM rcpt_debt d
    WHERE ${where}
  `;
}
