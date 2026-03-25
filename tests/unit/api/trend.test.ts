import { describe, it, expect } from 'vitest';
import { buildTrendSql } from '../../../src/api/queries/trend';
import { minifySql } from '../../../src/utils/sql';
import type { FilterState } from '../../../src/types/debt';
import { DEFAULT_FILTERS } from '../../../src/types/debt';

describe('buildTrendSql', () => {
  it('SQL includes 12-month interval', () => {
    const sql = minifySql(buildTrendSql());
    expect(sql).toContain('INTERVAL 12 MONTH');
  });

  it('SQL groups by month', () => {
    const sql = minifySql(buildTrendSql());
    expect(sql).toContain("GROUP BY DATE_FORMAT(d.debt_date, '%Y-%m')");
  });

  it('pttype filter is applied', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      pttypes: ['A1', 'C3'],
    };
    const sql = minifySql(buildTrendSql(filters));
    expect(sql).toContain("d.pttype IN ('A1','C3')");
  });

  it('department filter is applied', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      department: 'OPD',
    };
    const sql = minifySql(buildTrendSql(filters));
    expect(sql).toContain("d.department = 'OPD'");
  });
});
