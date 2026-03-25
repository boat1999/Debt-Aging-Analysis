import { useQuery } from '@tanstack/react-query';
import { querySql } from '../api/hosxp-client';
import { buildAgingSummarySql } from '../api/queries/aging-summary';
import { QUERY_KEYS } from '../config/query-keys';
import type { SessionConfig } from '../types/session';
import type { AgingSummaryRow, FilterState } from '../types/debt';
import { DEFAULT_FILTERS } from '../types/debt';

export function useAgingSummary(config: SessionConfig, filters: FilterState = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: QUERY_KEYS.agingSummary(filters),
    queryFn: () => querySql<AgingSummaryRow>(config, buildAgingSummarySql(filters)),
    enabled: !!config.apiUrl,
  });
}
