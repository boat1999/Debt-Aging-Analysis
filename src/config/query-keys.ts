import type { FilterState } from '../types/debt';

export const QUERY_KEYS = {
  session: (sessionId: string) => ['session', sessionId] as const,
  agingSummary: (filters: FilterState) => ['aging-summary', filters] as const,
  alertSummary: (filters: FilterState) => ['alert-summary', filters] as const,
  trendData: (filters: FilterState) => ['trend-data', filters] as const,
  debtDetail: (pttype: string, filters?: FilterState) => ['debt-detail', pttype, filters] as const,
} as const;
