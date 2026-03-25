import { describe, it, expect, vi } from 'vitest';
import { EXPORT_CONFIG } from '../../../src/config/constants';
import type { AgingSummaryRow, DebtDetailRow } from '../../../src/types/debt';

// Mock XLSX before importing the module under test
vi.mock('xlsx', () => {
  const jsonToSheet = vi.fn(() => ({}));
  const bookNew = vi.fn(() => ({ Sheets: {}, SheetNames: [] }));
  const bookAppendSheet = vi.fn();
  const writeFile = vi.fn();
  return {
    default: {
      utils: { json_to_sheet: jsonToSheet, book_new: bookNew, book_append_sheet: bookAppendSheet },
      writeFile,
    },
    utils: { json_to_sheet: jsonToSheet, book_new: bookNew, book_append_sheet: bookAppendSheet },
    writeFile,
  };
});

import * as XLSX from 'xlsx';
import { exportAgingSummaryToExcel, exportDetailToExcel } from '../../../src/utils/export';

function makeSummaryRow(overrides: Partial<AgingSummaryRow> = {}): AgingSummaryRow {
  return {
    pttype: 'UC',
    pttype_name: 'Universal Coverage',
    total_count: 10,
    total_amount: 5000,
    aging_0_30: 1000,
    count_0_30: 2,
    aging_31_60: 1000,
    count_31_60: 2,
    aging_61_90: 1000,
    count_61_90: 2,
    aging_91_180: 1000,
    count_91_180: 2,
    aging_over_180: 1000,
    count_over_180: 2,
    ar_transferred: 2000,
    ar_pending: 3000,
    ...overrides,
  };
}

function makeDetailRow(overrides: Partial<DebtDetailRow> = {}): DebtDetailRow {
  return {
    debt_id: 1,
    debt_doc_id: 'D001',
    vn: 'VN001',
    hn: 'HN001',
    patient_name: 'Test Patient',
    debt_date: '2025-01-15',
    total_amount: 500,
    discount_amount: 0,
    ofc_paid_amount: 0,
    outstanding: 500,
    aging_days: 60,
    ar_transfer: null,
    ar_transfer_datetime: null,
    claim_status: null,
    claim_ref_code: null,
    department: 'OPD',
    finance_number: null,
    ...overrides,
  };
}

describe('exportAgingSummaryToExcel', () => {
  it('creates correct worksheet structure with mapped column names', () => {
    const data = [makeSummaryRow()];
    exportAgingSummaryToExcel(data);

    const jsonToSheet = XLSX.utils.json_to_sheet as ReturnType<typeof vi.fn>;
    expect(jsonToSheet).toHaveBeenCalledTimes(1);

    const rows = jsonToSheet.mock.calls[0]![0] as Record<string, unknown>[];
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveProperty('0-30 วัน', 1000);
    expect(rows[0]).toHaveProperty('>180 วัน', 1000);
    expect(rows[0]).toHaveProperty('รวม', 5000);
  });

  it('calls XLSX.writeFile with correct filename', () => {
    const data = [makeSummaryRow()];
    exportAgingSummaryToExcel(data, 'test-output.xlsx');

    const writeFile = XLSX.writeFile as ReturnType<typeof vi.fn>;
    expect(writeFile).toHaveBeenCalledWith(expect.anything(), 'test-output.xlsx');
  });
});

describe('exportDetailToExcel', () => {
  it('limits rows to EXPORT_CONFIG.maxExcelRows', () => {
    // Create more rows than the max
    const count = EXPORT_CONFIG.maxExcelRows + 50;
    const data = Array.from({ length: count }, (_, i) =>
      makeDetailRow({ debt_id: i, debt_doc_id: `D${i}` }),
    );

    const jsonToSheet = XLSX.utils.json_to_sheet as ReturnType<typeof vi.fn>;
    jsonToSheet.mockClear();

    exportDetailToExcel(data);

    const rows = jsonToSheet.mock.calls[0]![0] as Record<string, unknown>[];
    expect(rows).toHaveLength(EXPORT_CONFIG.maxExcelRows);
  });

  it('maps columns correctly for detail rows', () => {
    const data = [makeDetailRow({ ar_transfer: 'Y' })];

    const jsonToSheet = XLSX.utils.json_to_sheet as ReturnType<typeof vi.fn>;
    jsonToSheet.mockClear();

    exportDetailToExcel(data);

    const rows = jsonToSheet.mock.calls[0]![0] as Record<string, unknown>[];
    expect(rows[0]).toHaveProperty('HN', 'HN001');
    expect(rows[0]).toHaveProperty('สถานะ AR', 'โอนแล้ว');
  });
});
