import { formatMoney, formatNumber } from '../../utils/format';
import type { AlertSummary } from '../../types/debt';

interface AlertPanelProps {
  data: AlertSummary | undefined;
  isLoading: boolean;
}

export function AlertPanel({ data, isLoading }: AlertPanelProps) {
  if (isLoading || !data) return null;

  const alerts: { type: 'critical' | 'warning'; title: string; body: string }[] = [];

  if (data.critical_count > 0) {
    alerts.push({
      type: 'critical',
      title: `Critical: หนี้เกิน 180 วัน ยังไม่โอน AR — ${formatNumber(data.critical_count)} รายการ`,
      body: `รวม ฿${formatMoney(data.critical_amount)} · ต้องดำเนินการโดยด่วน`,
    });
  }

  if (data.warning_count > 0) {
    alerts.push({
      type: 'warning',
      title: `Warning: หนี้ 91-180 วัน ยังไม่โอน AR — ${formatNumber(data.warning_count)} รายการ`,
      body: `รวม ฿${formatMoney(data.warning_amount)}`,
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginBottom: 20,
      animation: 'fade-up .6s .15s cubic-bezier(.16,1,.3,1) forwards',
      opacity: 0,
    }}>
      {alerts.map((alert) => (
        <div
          key={alert.type}
          style={{
            borderRadius: 12,
            padding: '16px 20px',
            borderLeft: `3px solid ${alert.type === 'critical' ? 'var(--critical)' : 'var(--warning)'}`,
            background: alert.type === 'critical' ? 'var(--critical-bg)' : 'var(--warning-bg)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={alert.type === 'critical' ? 'var(--critical)' : 'var(--warning)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: alert.type === 'critical' ? 'var(--critical)' : 'var(--warning)',
            }}>
              {alert.title}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 300, marginLeft: 22 }}>
            {alert.body}
          </div>
        </div>
      ))}
    </div>
  );
}
