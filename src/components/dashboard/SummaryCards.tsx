import { Row, Col, Card } from 'antd';
import { formatMoney, formatNumber } from '../../utils/format';
import { LoadingState } from '../shared/LoadingState';
import type { AgingSummaryRow } from '../../types/debt';

interface SummaryCardsProps {
  data: AgingSummaryRow[] | undefined;
  isLoading: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading) return <LoadingState />;

  const totals = (data ?? []).reduce(
    (acc, row) => ({
      totalAmount: acc.totalAmount + (row.total_amount ?? 0),
      totalCount: acc.totalCount + (row.total_count ?? 0),
      arTransferred: acc.arTransferred + (row.ar_transferred ?? 0),
      arPending: acc.arPending + (row.ar_pending ?? 0),
    }),
    { totalAmount: 0, totalCount: 0, arTransferred: 0, arPending: 0 },
  );

  const pendingPercent = totals.totalAmount > 0
    ? ((totals.arPending / totals.totalAmount) * 100).toFixed(1)
    : '0';

  const cards = [
    {
      title: 'ยอดหนี้รวม',
      value: `฿${formatMoney(totals.totalAmount)}`,
      sub: 'ยอดรวมทั้งหมดในระบบ',
      color: 'var(--gold)',
      barWidth: '100%',
      barGradient: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      title: 'จำนวนรายการ',
      value: `${formatNumber(totals.totalCount)}`,
      valueSuffix: ' รายการ',
      sub: 'รายการทั้งหมดในฐานข้อมูล',
      color: '#7eb3f5',
      barWidth: '72%',
      barGradient: 'linear-gradient(90deg, #4a7ac0, #7eb3f5)',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      title: 'โอน AR แล้ว',
      value: `฿${formatMoney(totals.arTransferred)}`,
      sub: 'ดำเนินการสำเร็จแล้ว',
      color: 'var(--success)',
      barWidth: totals.totalAmount > 0 ? `${Math.max((totals.arTransferred / totals.totalAmount) * 100, 0.5)}%` : '0%',
      barGradient: 'linear-gradient(90deg, #2a8f65, var(--success))',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      title: 'ยังไม่โอน AR',
      value: `฿${formatMoney(totals.arPending)}`,
      sub: `รอดำเนินการ · ${pendingPercent}% ของยอดรวม`,
      color: 'var(--warning)',
      barWidth: `${pendingPercent}%`,
      barGradient: 'linear-gradient(90deg, #a0601a, var(--warning))',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24, animation: 'fade-up .6s cubic-bezier(.16,1,.3,1) forwards', opacity: 0 }}>
      {cards.map((card, i) => (
        <Col xs={12} lg={6} key={card.title}>
          <Card
            className="kpi-card"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border-faint)',
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              animation: `fade-up .6s ${0.05 + i * 0.05}s cubic-bezier(.16,1,.3,1) forwards`,
              opacity: 0,
            }}
            styles={{ body: { padding: '22px 24px' } }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: card.color,
              marginBottom: 14,
            }}>
              <span style={{ flexShrink: 0 }}>{card.icon}</span>
              {card.title}
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -0.5,
              color: card.color,
            }}>
              {card.value}
              {card.valueSuffix && (
                <span style={{ fontSize: 16, color: 'var(--text-dim)' }}>{card.valueSuffix}</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontWeight: 300 }}>
              {card.sub}
            </div>
            {/* Bottom bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 2,
              width: card.barWidth,
              background: card.barGradient,
              borderRadius: '0 0 0 16px',
            }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
