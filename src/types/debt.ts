export interface AgingSummaryRow {
  pttype: string;
  pttype_name: string;
  total_count: number;
  total_amount: number;
  aging_0_30: number;
  count_0_30: number;
  aging_31_60: number;
  count_31_60: number;
  aging_61_90: number;
  count_61_90: number;
  aging_91_180: number;
  count_91_180: number;
  aging_over_180: number;
  count_over_180: number;
  ar_transferred: number;
  ar_pending: number;
}

export interface AlertSummary {
  critical_amount: number;
  critical_count: number;
  warning_amount: number;
  warning_count: number;
}

export interface TrendDataPoint {
  month: string;
  new_debt_amount: number;
  new_debt_count: number;
  ar_amount: number;
}

export interface DebtDetailRow {
  debt_id: number;
  debt_doc_id: string;
  vn: string;
  hn: string;
  patient_name: string;
  debt_date: string;
  total_amount: number;
  discount_amount: number;
  ofc_paid_amount: number;
  outstanding: number;
  aging_days: number;
  ar_transfer: string | null;
  ar_transfer_datetime: string | null;
  claim_status: string | null;
  claim_ref_code: string | null;
  department: string;
  finance_number: string | null;
}

export type ArStatusFilter = 'all' | 'transferred' | 'pending';
export type DepartmentFilter = 'all' | 'OPD' | 'IPD';

export interface FilterState {
  dateRange: [string, string] | null;
  pttypes: string[];
  arStatus: ArStatusFilter;
  department: DepartmentFilter;
  claimStatus: string | null;
  searchText: string;
  minAmount: number | null;
}

export const DEFAULT_FILTERS: FilterState = {
  dateRange: null,
  pttypes: [],
  arStatus: 'all',
  department: 'all',
  claimStatus: null,
  searchText: '',
  minAmount: null,
};
