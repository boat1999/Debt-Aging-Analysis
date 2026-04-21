import { describe, it, expect } from 'vitest';
import { AGING_BUCKETS, ALERT_THRESHOLDS, QUERY_CONFIG } from '../../../src/config/constants';

describe('AGING_BUCKETS', () => {
  it('has exactly 5 buckets', () => {
    expect(AGING_BUCKETS).toHaveLength(5);
  });

  it('buckets are contiguous (no gaps)', () => {
    for (let i = 1; i < AGING_BUCKETS.length; i++) {
      expect(AGING_BUCKETS[i]!.minDays).toBe(AGING_BUCKETS[i - 1]!.maxDays + 1);
    }
  });

  it('first bucket starts at 0', () => {
    expect(AGING_BUCKETS[0]!.minDays).toBe(0);
  });

  it('last bucket extends to Infinity', () => {
    expect(AGING_BUCKETS[AGING_BUCKETS.length - 1]!.maxDays).toBe(Infinity);
  });

  it('each bucket has all required properties', () => {
    for (const bucket of AGING_BUCKETS) {
      expect(bucket).toHaveProperty('key');
      expect(bucket).toHaveProperty('label');
      expect(bucket).toHaveProperty('labelTh');
      expect(bucket).toHaveProperty('minDays');
      expect(bucket).toHaveProperty('maxDays');
      expect(bucket).toHaveProperty('color');
      expect(bucket).toHaveProperty('alertLevel');
    }
  });
});

describe('ALERT_THRESHOLDS', () => {
  it('critical threshold is higher than warning', () => {
    expect(ALERT_THRESHOLDS.critical.minDays).toBeGreaterThan(ALERT_THRESHOLDS.warning.minDays);
  });

  it('all thresholds require specific AR conditions', () => {
    expect(ALERT_THRESHOLDS.critical.requireNoAr).toBe(true);
    expect(ALERT_THRESHOLDS.warning.requireNoAr).toBe(true);
  });
});

describe('QUERY_CONFIG', () => {
  it('stale time and refetch interval are both 5 minutes', () => {
    expect(QUERY_CONFIG.staleTime).toBe(5 * 60 * 1000);
    expect(QUERY_CONFIG.refetchInterval).toBe(5 * 60 * 1000);
  });

  it('retry is disabled (querySql handles its own retries)', () => {
    expect(QUERY_CONFIG.retry).toBe(0);
  });
});
