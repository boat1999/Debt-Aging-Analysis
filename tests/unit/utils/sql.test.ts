import { describe, it, expect } from 'vitest';
import { minifySql } from '../../../src/utils/sql';

describe('minifySql', () => {
  it('removes single-line comments', () => {
    const sql = 'SELECT * -- this is a comment\nFROM table';
    expect(minifySql(sql)).toBe('SELECT * FROM table');
  });

  it('removes multi-line comments', () => {
    const sql = 'SELECT /* comment */ * FROM table';
    expect(minifySql(sql)).toBe('SELECT * FROM table');
  });

  it('collapses whitespace', () => {
    const sql = 'SELECT  *\n  FROM    table\n  WHERE  x = 1';
    expect(minifySql(sql)).toBe('SELECT * FROM table WHERE x = 1');
  });

  it('trims leading and trailing whitespace', () => {
    const sql = '  SELECT * FROM table  ';
    expect(minifySql(sql)).toBe('SELECT * FROM table');
  });

  it('handles complex SQL with all features', () => {
    const sql = `
      SELECT
        d.pttype, -- insurance type
        p.name AS pttype_name
      /* aging buckets */
      FROM rcpt_debt d
      LEFT JOIN pttype p ON d.pttype = p.pttype
      WHERE d.paid IS NULL
    `;
    const result = minifySql(sql);
    expect(result).not.toContain('--');
    expect(result).not.toContain('/*');
    expect(result).not.toContain('\n');
    expect(result.startsWith('SELECT')).toBe(true);
    expect(result.endsWith('NULL')).toBe(true);
  });
});
