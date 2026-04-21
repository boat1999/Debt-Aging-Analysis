import type { FilterState } from '../../types/debt';
import { validateIsoDate, validatePttypeCode } from '../../utils/sql';

export function buildAlertSummarySql(filters?: FilterState): string {
  const whereConditions = ['d.paid IS NULL'];

  if (filters) {
    if (filters.dateRange) {
      const start = validateIsoDate(filters.dateRange[0]);
      const end = validateIsoDate(filters.dateRange[1]);
      if (start && end) {
        whereConditions.push(`d.debt_date BETWEEN '${start}' AND '${end}'`);
      }
    }
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
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) > 180 AND d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END) AS critical_amount,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) > 180 AND d.ar_transfer IS NULL THEN 1 ELSE 0 END) AS critical_count,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 91 AND 180 AND d.ar_transfer IS NULL THEN d.total_amount ELSE 0 END) AS warning_amount,
      SUM(CASE WHEN (CURRENT_DATE - d.debt_date) BETWEEN 91 AND 180 AND d.ar_transfer IS NULL THEN 1 ELSE 0 END) AS warning_count
    FROM rcpt_debt d
    WHERE ${where}
  `;
}
