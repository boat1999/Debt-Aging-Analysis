import { useQuery } from '@tanstack/react-query';
import { querySql } from '../api/hosxp-client';
import { buildAlertSummarySql } from '../api/queries/alert-summary';
import { QUERY_KEYS } from '../config/query-keys';
import type { SessionConfig } from '../types/session';
import type { AlertSummary, FilterState } from '../types/debt';
import { DEFAULT_FILTERS } from '../types/debt';

export function useAlertSummary(config: SessionConfig, filters: FilterState = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: QUERY_KEYS.alertSummary(filters),
    queryFn: async () => {
      const rows = await querySql<AlertSummary>(config, buildAlertSummarySql(filters));
      return rows[0] ?? { critical_amount: 0, critical_count: 0, warning_amount: 0, warning_count: 0 };
    },
    enabled: !!config.apiUrl,
  });
}
