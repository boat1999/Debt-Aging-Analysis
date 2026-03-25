import { memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { formatMoney } from '../../utils/format';
import { useTheme } from '../../contexts/ThemeContext';
import type { AgingSummaryRow } from '../../types/debt';

const CHART_COLORS = ['#c9a96e', '#4db891', '#e8a53a', '#e05555', '#7eb3f5', '#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fb923c'];

interface PttypePieChartProps {
  data: AgingSummaryRow[] | undefined;
}

export const PttypePieChart = memo(function PttypePieChart({ data }: PttypePieChartProps) {
  const { isDark } = useTheme();
  if (!data || data.length === 0) return null;

  const total = data.reduce((s, r) => s + r.total_amount, 0);
  const pieData = data.slice(0, 10).map((row, i) => ({
    name: `${row.pttype} ${row.pttype_name}`,
    value: row.total_amount,
    itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#111122' : '#ffffff',
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      textStyle: { color: isDark ? '#e4dfd4' : '#1a1a2e', fontSize: 12, fontFamily: "'DM Sans', sans-serif" },
      formatter: (params: { name: string; value: number; percent: number }) =>
        `${params.name}<br/><span style="font-family:'Outfit',sans-serif;font-weight:600">฿${params.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${params.percent}%)</span>`,
    },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 10 }, pageTextStyle: { color: isDark ? '#6a6a82' : '#8a8a9a' } },
    graphic: [
      { type: 'text', left: 'center', top: '38%', style: { text: `฿${formatMoney(total)}`, fill: isDark ? '#c9a96e' : '#9a7a45', fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif" } },
      { type: 'text', left: 'center', top: '46%', style: { text: 'ยอดรวม', fill: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 10.5, fontFamily: "'DM Sans', sans-serif" } },
    ],
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 2,
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold', color: isDark ? '#e4dfd4' : '#1a1a2e' } },
      data: pieData,
    }],
  };

  return (
    <Card
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border-faint)',
        borderRadius: 16,
        marginBottom: 14,
        animation: 'fade-up .6s .12s cubic-bezier(.16,1,.3,1) forwards',
        opacity: 0,
      }}
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        สัดส่วนหนี้ตามสิทธิ
        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 400, color: 'var(--muted)' }}>% ของยอดรวม</span>
      </div>
      <ReactECharts option={option} style={{ height: 300 }} />
    </Card>
  );
});
