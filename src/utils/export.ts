import * as XLSX from 'xlsx';
import { EXPORT_CONFIG } from '../config/constants';
import type { AgingSummaryRow, DebtDetailRow } from '../types/debt';

export function exportAgingSummaryToExcel(data: AgingSummaryRow[], filename = 'aging-summary.xlsx') {
  const rows = data.map((r) => ({
    'สิทธิ': `${r.pttype} ${r.pttype_name}`,
    '0-30 วัน': r.aging_0_30,
    '31-60 วัน': r.aging_31_60,
    '61-90 วัน': r.aging_61_90,
    '91-180 วัน': r.aging_91_180,
    '>180 วัน': r.aging_over_180,
    'รวม': r.total_amount,
    'โอน AR แล้ว': r.ar_transferred,
    'ยังไม่โอน AR': r.ar_pending,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Aging Summary');
  XLSX.writeFile(wb, filename);
}

export function exportDetailToExcel(data: DebtDetailRow[], filename = 'debt-detail.xlsx') {
  const limited = data.slice(0, EXPORT_CONFIG.maxExcelRows);
  const rows = limited.map((r) => ({
    'เลขที่เอกสาร': r.debt_doc_id,
    'HN': r.hn,
    'ชื่อผู้ป่วย': r.patient_name,
    'วันที่หนี้': r.debt_date,
    'จำนวนเงิน': r.total_amount,
    'ค้างจ่าย': r.outstanding,
    'อายุหนี้ (วัน)': r.aging_days,
    'สถานะ AR': r.ar_transfer === 'Y' ? 'โอนแล้ว' : 'ยังไม่โอน',
    'สถานะเคลม': r.claim_status ?? '',
    'แผนก': r.department,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Debt Detail');
  XLSX.writeFile(wb, filename);
}

export function triggerPrint() {
  window.print();
}
