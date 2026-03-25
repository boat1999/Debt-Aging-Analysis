import { describe, it, expect } from 'vitest';
import { formatMoney, formatDate, formatNumber } from '../../../src/utils/format';

describe('formatMoney', () => {
  it('formats Thai baht with comma thousands and 2 decimals', () => {
    expect(formatMoney(1234567.89)).toBe('1,234,567.89');
  });

  it('formats zero', () => {
    expect(formatMoney(0)).toBe('0.00');
  });

  it('formats negative values', () => {
    expect(formatMoney(-1234.5)).toBe('-1,234.50');
  });

  it('formats small values with padding', () => {
    expect(formatMoney(0.5)).toBe('0.50');
  });

  it('handles null/undefined as zero', () => {
    expect(formatMoney(null as unknown as number)).toBe('0.00');
    expect(formatMoney(undefined as unknown as number)).toBe('0.00');
  });

  it('formats millions correctly', () => {
    expect(formatMoney(82500000)).toBe('82,500,000.00');
  });
});

describe('formatNumber', () => {
  it('formats integer with comma separators', () => {
    expect(formatNumber(59520)).toBe('59,520');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatDate', () => {
  it('formats ISO date to Thai display format', () => {
    expect(formatDate('2026-01-13')).toBe('13/01/2026');
  });

  it('handles null/empty string', () => {
    expect(formatDate(null as unknown as string)).toBe('-');
    expect(formatDate('')).toBe('-');
  });
});
