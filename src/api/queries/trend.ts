import type { FilterState } from '../../types/debt';
import { validatePttypeCode } from '../../utils/sql';

export function buildTrendSql(filters?: FilterState): string {
  const whereConditions = [`d.debt_date >= CURRENT_DATE - 365`];

  if (filters) {
    if (filters.pttypes.length > 0) {
      const list = filters.pttypes
        .map((p) => validatePttypeCode(p))
        .filter((p): p is string => p !== null)
        .map((p) => `'${p}'`)
        .join(',');
      if (list) whereConditions.push(`d.pttype IN (${list})`);
    }
    if (filters.department === 'OPD' || filters.department === 'IPD') {
      whereConditions.push(`d.department = '${filters.department}'`);
    }
  }

  const where = whereConditions.join(' AND ');

  return `
    SELECT
      SUBSTRING(CAST(d.debt_date AS text), 1, 7) AS month,
      SUM(d.total_amount) AS new_debt_amount,
      COUNT(*) AS new_debt_count,
      SUM(CASE WHEN d.ar_transfer = 'Y' THEN d.total_amount ELSE 0 END) AS ar_amount
    FROM rcpt_debt d
    WHERE ${where}
    GROUP BY SUBSTRING(CAST(d.debt_date AS text), 1, 7)
    ORDER BY month
  `;
}
