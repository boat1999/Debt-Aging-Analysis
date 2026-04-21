import { describe, it, expect } from 'vitest';
import {
  minifySql,
  escapeSqlString,
  escapeLikePattern,
  validateIsoDate,
  toFiniteNumber,
  validatePttypeCode,
} from '../../../src/utils/sql';

describe('minifySql', () => {
  it('collapses whitespace', () => {
    const sql = 'SELECT  *\n  FROM    table\n  WHERE  x = 1';
    expect(minifySql(sql)).toBe('SELECT * FROM table WHERE x = 1');
  });

  it('trims leading and trailing whitespace', () => {
    const sql = '  SELECT * FROM table  ';
    expect(minifySql(sql)).toBe('SELECT * FROM table');
  });

  it('preserves -- and /* inside quoted strings (no comment stripping)', () => {
    const sql = "SELECT * FROM t WHERE name LIKE '%foo--bar%'";
    expect(minifySql(sql)).toBe("SELECT * FROM t WHERE name LIKE '%foo--bar%'");
  });
});

describe('escapeSqlString', () => {
  it('escapes single quotes', () => {
    expect(escapeSqlString("O'Brien")).toBe("O''Brien");
  });

  it('escapes backslashes', () => {
    expect(escapeSqlString('back\\slash')).toBe('back\\\\slash');
  });

  it('coerces non-string input', () => {
    expect(escapeSqlString(123 as unknown as string)).toBe('123');
  });
});

describe('escapeLikePattern', () => {
  it('escapes wildcards and quotes', () => {
    expect(escapeLikePattern("50%_'foo")).toBe("50\\%\\_''foo");
  });
});

describe('validateIsoDate', () => {
  it('accepts valid YYYY-MM-DD', () => {
    expect(validateIsoDate('2026-04-21')).toBe('2026-04-21');
  });

  it('rejects other formats', () => {
    expect(validateIsoDate('21/04/2026')).toBe(null);
    expect(validateIsoDate("2026-04-21' OR 1=1--")).toBe(null);
    expect(validateIsoDate(null)).toBe(null);
    expect(validateIsoDate(12345)).toBe(null);
  });
});

describe('toFiniteNumber', () => {
  it('returns number for numeric input', () => {
    expect(toFiniteNumber(42)).toBe(42);
    expect(toFiniteNumber('42')).toBe(42);
  });

  it('returns null for non-finite or non-numeric', () => {
    expect(toFiniteNumber('abc')).toBe(null);
    expect(toFiniteNumber("0 OR 1=1")).toBe(null);
    expect(toFiniteNumber(Infinity)).toBe(null);
    expect(toFiniteNumber(NaN)).toBe(null);
    expect(toFiniteNumber(null)).toBe(null);
  });
});

describe('validatePttypeCode', () => {
  it('accepts alphanumeric codes', () => {
    expect(validatePttypeCode('UC')).toBe('UC');
    expect(validatePttypeCode('SSO_01')).toBe('SSO_01');
  });

  it('rejects codes with injection characters', () => {
    expect(validatePttypeCode("UC' OR 1=1--")).toBe(null);
    expect(validatePttypeCode('UC;DROP')).toBe(null);
    expect(validatePttypeCode('')).toBe(null);
    expect(validatePttypeCode('A'.repeat(21))).toBe(null);
  });
});
