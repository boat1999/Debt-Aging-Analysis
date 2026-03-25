import { describe, it, expect } from 'vitest';
import { buildAlertSummarySql } from '../../../src/api/queries/alert-summary';
import { minifySql } from '../../../src/utils/sql';
import type { FilterState } from '../../../src/types/debt';
import { DEFAULT_FILTERS } from '../../../src/types/debt';

describe('buildAlertSummarySql', () => {
  it('SQL selects critical_amount and critical_count', () => {
    const sql = minifySql(buildAlertSummarySql());
    expect(sql).toContain('AS critical_amount');
    expect(sql).toContain('AS critical_count');
  });

  it('SQL selects warning_amount and warning_count', () => {
    const sql = minifySql(buildAlertSummarySql());
    expect(sql).toContain('AS warning_amount');
    expect(sql).toContain('AS warning_count');
  });

  it('filter with dateRange applies BETWEEN clause', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      dateRange: ['2025-06-01', '2025-06-30'],
    };
    const sql = minifySql(buildAlertSummarySql(filters));
    expect(sql).toContain("d.debt_date BETWEEN '2025-06-01' AND '2025-06-30'");
  });

  it('filter with pttypes applies IN clause', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      pttypes: ['UC'],
    };
    const sql = minifySql(buildAlertSummarySql(filters));
    expect(sql).toContain("d.pttype IN ('UC')");
  });

  it('filter with department applies department clause', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      department: 'IPD',
    };
    const sql = minifySql(buildAlertSummarySql(filters));
    expect(sql).toContain("d.department = 'IPD'");
  });
});
