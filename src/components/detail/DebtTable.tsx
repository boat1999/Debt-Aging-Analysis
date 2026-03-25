import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MoneyCell } from '../shared/MoneyCell';
import { AgingBadge } from '../shared/AgingBadge';
import { formatDate } from '../../utils/format';
import { LoadingState } from '../shared/LoadingState';
import { EmptyState } from '../shared/EmptyState';
import type { DebtDetailRow } from '../../types/debt';

interface DebtTableProps {
  data: DebtDetailRow[] | undefined;
  isLoading: boolean;
}

export function DebtTable({ data, isLoading }: DebtTableProps) {
  if (isLoading) return <LoadingState />;
  if (!data || data.length === 0) return <EmptyState description="ไม่พบรายการหนี้" />;

  const columns: ColumnsType<DebtDetailRow> = [
    { title: '#', key: 'index', width: 50, render: (_: unknown, __: DebtDetailRow, index: number) => index + 1 },
    { title: 'เลขที่เอกสาร', dataIndex: 'debt_doc_id', key: 'debt_doc_id', width: 120 },
    { title: 'HN', dataIndex: 'hn', key: 'hn', width: 100 },
    { title: 'ชื่อผู้ป่วย', dataIndex: 'patient_name', key: 'patient_name', width: 180, ellipsis: true },
    {
      title: 'วันที่หนี้', dataIndex: 'debt_date', key: 'debt_date', width: 110,
      render: (val: string) => formatDate(val),
      sorter: (a: DebtDetailRow, b: DebtDetailRow) => a.debt_date.localeCompare(b.debt_date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'จำนวนเงิน', dataIndex: 'total_amount', key: 'total_amount', width: 130,
      align: 'right', render: (val: number) => <MoneyCell value={val} />,
      sorter: (a: DebtDetailRow, b: DebtDetailRow) => a.total_amount - b.total_amount,
    },
    {
      title: 'ค้างจ่าย', dataIndex: 'outstanding', key: 'outstanding', width: 130,
      align: 'right', render: (val: number) => <MoneyCell value={val} />,
    },
    {
      title: 'อายุหนี้', dataIndex: 'aging_days', key: 'aging_days', width: 100,
      render: (val: number) => <AgingBadge days={val} />,
      sorter: (a: DebtDetailRow, b: DebtDetailRow) => a.aging_days - b.aging_days,
    },
    {
      title: 'สถานะ AR', dataIndex: 'ar_transfer', key: 'ar_transfer', width: 100,
      render: (val: string | null) => val === 'Y' ? 'โอนแล้ว' : 'ยังไม่โอน',
    },
    { title: 'สถานะเคลม', dataIndex: 'claim_status', key: 'claim_status', width: 100 },
    { title: 'แผนก', dataIndex: 'department', key: 'department', width: 80 },
  ];

  return (
    <Table<DebtDetailRow>
      columns={columns}
      dataSource={data}
      rowKey="debt_id"
      pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
      scroll={{ x: 1300 }}
      size="middle"
      bordered
    />
  );
}
