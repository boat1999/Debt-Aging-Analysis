import { memo } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MoneyCell } from '../shared/MoneyCell';
import { AGING_BUCKETS } from '../../config/constants';
import { LoadingState } from '../shared/LoadingState';
import { EmptyState } from '../shared/EmptyState';
import type { AgingSummaryRow } from '../../types/debt';

interface AgingTableProps {
  data: AgingSummaryRow[] | undefined;
  isLoading: boolean;
  onRowClick?: (pttype: string) => void;
}

const agingColors: Record<string, string> = {
  aging_0_30: '#86EFAC',
  aging_31_60: '#86EFAC',
  aging_61_90: '#FCD34D',
  aging_91_180: '#FDBA74',
  aging_over_180: '#FCA5A5',
};

export const AgingTable = memo(function AgingTable({ data, isLoading, onRowClick }: AgingTableProps) {
  if (isLoading) return <LoadingState />;
  if (!data || data.length === 0) return <EmptyState description="ไม่พบข้อมูลหนี้ค้างชำระ" />;

  const mutedColor = 'rgba(106,106,130,0.4)';

  const columns: ColumnsType<AgingSummaryRow> = [
    {
      title: 'สิทธิผู้ป่วย',
      key: 'pttype',
      fixed: 'left',
      width: 260,
      render: (_: unknown, record: AgingSummaryRow) => (
        <span style={{ color: 'var(--text)', fontWeight: 400, fontSize: 12.5 }}>{record.pttype} {record.pttype_name}</span>
      ),
    },
    ...AGING_BUCKETS.map((bucket) => ({
      title: bucket.labelTh,
      key: bucket.key,
      align: 'right' as const,
      width: 130,
      render: (_: unknown, record: AgingSummaryRow) => {
        const val = record[bucket.key as keyof AgingSummaryRow] as number;
        const color = val > 0 ? agingColors[bucket.key] ?? 'var(--text)' : mutedColor;
        return <MoneyCell value={val} style={{ color, fontWeight: val > 0 ? 500 : 300 }} />;
      },
    })),
    {
      title: 'รวม',
      key: 'total',
      align: 'right' as const,
      width: 140,
      render: (_: unknown, record: AgingSummaryRow) => (
        <MoneyCell value={record.total_amount} style={{ color: 'var(--text)', fontWeight: 600 }} />
      ),
    },
  ];

  const totalsRow: AgingSummaryRow = {
    pttype: '', pttype_name: 'รวมทั้งหมด',
    total_count: data.reduce((s, r) => s + r.total_count, 0),
    total_amount: data.reduce((s, r) => s + r.total_amount, 0),
    aging_0_30: data.reduce((s, r) => s + r.aging_0_30, 0),
    count_0_30: data.reduce((s, r) => s + r.count_0_30, 0),
    aging_31_60: data.reduce((s, r) => s + r.aging_31_60, 0),
    count_31_60: data.reduce((s, r) => s + r.count_31_60, 0),
    aging_61_90: data.reduce((s, r) => s + r.aging_61_90, 0),
    count_61_90: data.reduce((s, r) => s + r.count_61_90, 0),
    aging_91_180: data.reduce((s, r) => s + r.aging_91_180, 0),
    count_91_180: data.reduce((s, r) => s + r.count_91_180, 0),
    aging_over_180: data.reduce((s, r) => s + r.aging_over_180, 0),
    count_over_180: data.reduce((s, r) => s + r.count_over_180, 0),
    ar_transferred: data.reduce((s, r) => s + r.ar_transferred, 0),
    ar_pending: data.reduce((s, r) => s + r.ar_pending, 0),
  };

  return (
    <Card
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border-faint)',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        animation: 'fade-up .6s .2s cubic-bezier(.16,1,.3,1) forwards',
        opacity: 0,
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--border-faint)',
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--text)',
        }}>
          Aging Summary
        </span>
      </div>
      <div style={{ padding: '0' }}>
        <Table<AgingSummaryRow>
          columns={columns}
          dataSource={data}
          rowKey="pttype"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `ทั้งหมด ${total} สิทธิ`,
            size: 'small',
            style: { padding: '12px 24px', margin: 0 },
          }}
          scroll={{ x: 1100 }}
          size="small"
          onRow={(record) => ({
            onClick: () => onRowClick?.(record.pttype),
            style: { cursor: onRowClick ? 'pointer' : 'default' },
          })}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{
                background: 'rgba(201,169,110,0.04)',
                borderTop: '1px solid var(--border)',
              }}>
                <Table.Summary.Cell index={0}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14,
                    color: 'var(--gold-light)',
                    fontWeight: 600,
                  }}>
                    {totalsRow.pttype_name}
                  </span>
                </Table.Summary.Cell>
                {AGING_BUCKETS.map((bucket, i) => (
                  <Table.Summary.Cell key={bucket.key} index={i + 1} align="right">
                    <MoneyCell value={totalsRow[bucket.key as keyof AgingSummaryRow] as number} style={{ color: 'var(--gold)', fontWeight: 600 }} />
                  </Table.Summary.Cell>
                ))}
                <Table.Summary.Cell index={AGING_BUCKETS.length + 1} align="right">
                  <MoneyCell value={totalsRow.total_amount} style={{ color: 'var(--gold)', fontWeight: 600 }} />
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Card>
  );
});
