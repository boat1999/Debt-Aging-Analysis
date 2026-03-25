import { useQuery } from '@tanstack/react-query';
import { querySql } from '../api/hosxp-client';
import { buildTrendSql } from '../api/queries/trend';
import { QUERY_KEYS } from '../config/query-keys';
import type { SessionConfig } from '../types/session';
import type { TrendDataPoint, FilterState } from '../types/debt';
import { DEFAULT_FILTERS } from '../types/debt';

export function useTrendData(config: SessionConfig, filters: FilterState = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: QUERY_KEYS.trendData(filters),
    queryFn: () => querySql<TrendDataPoint>(config, buildTrendSql(filters)),
    enabled: !!config.apiUrl,
  });
}
