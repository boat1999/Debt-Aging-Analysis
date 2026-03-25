import { AGING_BUCKETS } from '../config/constants';

export function calculateAgingBucket(days: number): string {
  if (days < 0) return 'aging_0_30';
  for (const bucket of AGING_BUCKETS) {
    if (days >= bucket.minDays && days <= bucket.maxDays) {
      return bucket.key;
    }
  }
  return 'aging_over_180';
}

export function getAgingColor(days: number): string {
  const first = AGING_BUCKETS[0];
  if (days < 0) return first?.color ?? '#52c41a';
  for (const bucket of AGING_BUCKETS) {
    if (days >= bucket.minDays && days <= bucket.maxDays) {
      return bucket.color;
    }
  }
  const last = AGING_BUCKETS[AGING_BUCKETS.length - 1];
  return last?.color ?? '#f5222d';
}

export function getAgingLabel(bucketKey: string): string {
  const bucket = AGING_BUCKETS.find((b) => b.key === bucketKey);
  return bucket?.labelTh ?? bucketKey;
}
