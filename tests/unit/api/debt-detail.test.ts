import { describe, it, expect } from 'vitest';
import { buildDebtDetailSql } from '../../../src/api/queries/debt-detail';
import { minifySql } from '../../../src/utils/sql';
import { EXPORT_CONFIG } from '../../../src/config/constants';
import type { FilterState } from '../../../src/types/debt';
import { DEFAULT_FILTERS } from '../../../src/types/debt';

describe('buildDebtDetailSql', () => {
  it('SQL includes pttype filter', () => {
    const sql = minifySql(buildDebtDetailSql('UC'));
    expect(sql).toContain("d.pttype = 'UC'");
  });

  it('SQL includes LIMIT', () => {
    const sql = minifySql(buildDebtDetailSql('UC'));
    expect(sql).toContain(`LIMIT ${EXPORT_CONFIG.detailQueryLimit}`);
  });

  it('SQL includes patient JOIN', () => {
    const sql = minifySql(buildDebtDetailSql('UC'));
    expect(sql).toContain('LEFT JOIN patient pt ON d.hn = pt.hn');
  });

  it('search text filter is applied', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      searchText: 'john',
    };
    const sql = minifySql(buildDebtDetailSql('UC', filters));
    expect(sql).toContain("d.hn LIKE '%john%'");
    expect(sql).toContain("pt.fname LIKE '%john%'");
    expect(sql).toContain("pt.lname LIKE '%john%'");
  });

  it('SQL includes d.paid IS NULL', () => {
    const sql = minifySql(buildDebtDetailSql('UC'));
    expect(sql).toContain('d.paid IS NULL');
  });
});
