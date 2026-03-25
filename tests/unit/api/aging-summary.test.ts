import { describe, it, expect } from 'vitest';
import { buildAgingSummarySql } from '../../../src/api/queries/aging-summary';
import { minifySql } from '../../../src/utils/sql';
import type { FilterState } from '../../../src/types/debt';
import { DEFAULT_FILTERS } from '../../../src/types/debt';

describe('buildAgingSummarySql', () => {
  it('default SQL contains d.paid IS NULL', () => {
    const sql = minifySql(buildAgingSummarySql());
    expect(sql).toContain('d.paid IS NULL');
  });

  it('SQL with date range filter includes BETWEEN clause', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      dateRange: ['2025-01-01', '2025-03-31'],
    };
    const sql = minifySql(buildAgingSummarySql(filters));
    expect(sql).toContain("d.debt_date BETWEEN '2025-01-01' AND '2025-03-31'");
  });

  it('SQL with pttype filter includes IN clause', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      pttypes: ['A1', 'B2'],
    };
    const sql = minifySql(buildAgingSummarySql(filters));
    expect(sql).toContain("d.pttype IN ('A1','B2')");
  });

  it('SQL with arStatus transferred includes ar_transfer = Y', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      arStatus: 'transferred',
    };
    const sql = minifySql(buildAgingSummarySql(filters));
    expect(sql).toContain("d.ar_transfer = 'Y'");
  });

  it('SQL with department filter includes department clause', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      department: 'OPD',
    };
    const sql = minifySql(buildAgingSummarySql(filters));
    expect(sql).toContain("d.department = 'OPD'");
  });
});
