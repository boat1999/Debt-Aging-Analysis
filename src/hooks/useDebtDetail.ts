import { useQuery } from '@tanstack/react-query';
import { querySql } from '../api/hosxp-client';
import { buildDebtDetailSql } from '../api/queries/debt-detail';
import { QUERY_KEYS } from '../config/query-keys';
import type { SessionConfig } from '../types/session';
import type { DebtDetailRow, FilterState } from '../types/debt';
import { DEFAULT_FILTERS } from '../types/debt';

export function useDebtDetail(config: SessionConfig, pttype: string, filters: FilterState = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: QUERY_KEYS.debtDetail(pttype, filters),
    queryFn: () => querySql<DebtDetailRow>(config, buildDebtDetailSql(pttype, filters)),
    enabled: !!config.apiUrl && !!pttype,
  });
}
