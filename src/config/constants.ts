export interface AgingBucket {
  key: string;
  label: string;
  labelTh: string;
  minDays: number;
  maxDays: number;
  color: string;
  alertLevel: 'normal' | 'info' | 'warning' | 'critical';
}

export const AGING_BUCKETS: AgingBucket[] = [
  { key: 'aging_0_30', label: '0-30d', labelTh: '0-30 วัน', minDays: 0, maxDays: 30, color: '#52c41a', alertLevel: 'normal' },
  { key: 'aging_31_60', label: '31-60d', labelTh: '31-60 วัน', minDays: 31, maxDays: 60, color: '#52c41a', alertLevel: 'normal' },
  { key: 'aging_61_90', label: '61-90d', labelTh: '61-90 วัน', minDays: 61, maxDays: 90, color: '#faad14', alertLevel: 'info' },
  { key: 'aging_91_180', label: '91-180d', labelTh: '91-180 วัน', minDays: 91, maxDays: 180, color: '#fa8c16', alertLevel: 'warning' },
  { key: 'aging_over_180', label: '>180d', labelTh: '>180 วัน', minDays: 181, maxDays: Infinity, color: '#f5222d', alertLevel: 'critical' },
];

export const ALERT_THRESHOLDS = {
  critical: { minDays: 181, requireNoAr: true },
  warning: { minDays: 91, maxDays: 180, requireNoAr: true },
  info: { minDays: 61, maxDays: 90, requireNoAr: false },
} as const;

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,       // 5 minutes
  refetchInterval: 5 * 60 * 1000,  // 5 minutes
  retry: 3,
  gcTime: 10 * 60 * 1000,         // 10 minutes
} as const;

export const EXPORT_CONFIG = {
  maxExcelRows: 10_000,
  detailQueryLimit: 1_000,
} as const;

export const SESSION_CONFIG = {
  cookieName: 'bms-session-id',
  cookieExpiry: 7,                  // days
  urlParamName: 'bms-session-id',
  appIdentifier: 'debt-aging-analysis',
} as const;
