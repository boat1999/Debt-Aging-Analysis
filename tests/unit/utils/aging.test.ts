import { describe, it, expect } from 'vitest';
import { calculateAgingBucket, getAgingColor, getAgingLabel } from '../../../src/utils/aging';

describe('calculateAgingBucket', () => {
  it('returns aging_0_30 for 0-30 days', () => {
    expect(calculateAgingBucket(0)).toBe('aging_0_30');
    expect(calculateAgingBucket(15)).toBe('aging_0_30');
    expect(calculateAgingBucket(30)).toBe('aging_0_30');
  });

  it('returns aging_31_60 for 31-60 days', () => {
    expect(calculateAgingBucket(31)).toBe('aging_31_60');
    expect(calculateAgingBucket(60)).toBe('aging_31_60');
  });

  it('returns aging_61_90 for 61-90 days', () => {
    expect(calculateAgingBucket(61)).toBe('aging_61_90');
    expect(calculateAgingBucket(90)).toBe('aging_61_90');
  });

  it('returns aging_91_180 for 91-180 days', () => {
    expect(calculateAgingBucket(91)).toBe('aging_91_180');
    expect(calculateAgingBucket(180)).toBe('aging_91_180');
  });

  it('returns aging_over_180 for >180 days', () => {
    expect(calculateAgingBucket(181)).toBe('aging_over_180');
    expect(calculateAgingBucket(365)).toBe('aging_over_180');
  });

  it('handles negative days (future dates) as aging_0_30', () => {
    expect(calculateAgingBucket(-5)).toBe('aging_0_30');
  });
});

describe('getAgingColor', () => {
  it('returns green for 0-60 days', () => {
    expect(getAgingColor(15)).toBe('#52c41a');
    expect(getAgingColor(45)).toBe('#52c41a');
  });

  it('returns yellow for 61-90 days', () => {
    expect(getAgingColor(75)).toBe('#faad14');
  });

  it('returns orange for 91-180 days', () => {
    expect(getAgingColor(120)).toBe('#fa8c16');
  });

  it('returns red for >180 days', () => {
    expect(getAgingColor(200)).toBe('#f5222d');
  });
});

describe('getAgingLabel', () => {
  it('returns Thai label for aging bucket key', () => {
    expect(getAgingLabel('aging_0_30')).toBe('0-30 วัน');
    expect(getAgingLabel('aging_over_180')).toBe('>180 วัน');
  });
});
