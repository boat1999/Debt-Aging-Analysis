import { memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { AGING_BUCKETS } from '../../config/constants';
import { useTheme } from '../../contexts/ThemeContext';
import type { AgingSummaryRow } from '../../types/debt';

const CHART_COLORS = ['#c9a96e', '#4db891', '#e8a53a', '#e05555', '#7eb3f5', '#a78bfa', '#f472b6', '#60a5fa'];

interface AgingBarChartProps {
  data: AgingSummaryRow[] | undefined;
}

export const AgingBarChart = memo(function AgingBarChart({ data }: AgingBarChartProps) {
  const { isDark } = useTheme();
  if (!data || data.length === 0) return null;

  const topData = data.slice(0, 8);
  const categories = AGING_BUCKETS.map((b) => b.labelTh);

  const series = topData.map((row, i) => ({
    name: `${row.pttype} ${row.pttype_name}`,
    type: 'bar' as const,
    stack: 'total',
    data: AGING_BUCKETS.map((b) => row[b.key as keyof AgingSummaryRow] as number),
    itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
  }));

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#111122' : '#ffffff',
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      textStyle: { color: isDark ? '#e4dfd4' : '#1a1a2e', fontSize: 12, fontFamily: "'DM Sans', sans-serif" },
      formatter: (params: Array<{ seriesName: string; value: number; color: string; axisValue?: string }>) => {
        let result = `<div style="font-weight:600;margin-bottom:4px">${params[0]?.axisValue ?? ''}</div>`;
        for (const p of params) {
          if (p.value > 0) result += `<span style="color:${p.color}">●</span> ${p.seriesName}: <span style="font-family:'Outfit',sans-serif;font-weight:600">฿${p.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><br/>`;
        }
        return result;
      },
    },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 10 }, pageTextStyle: { color: isDark ? '#6a6a82' : '#8a8a9a' } },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: categories, axisLabel: { color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 11 }, axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' } } },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 11, fontFamily: "'Outfit', sans-serif",
        formatter: (val: number) => val >= 1_000_000 ? `${(val / 1_000_000).toFixed(0)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(0)}K` : String(val),
      },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' } },
      axisLine: { show: false },
    },
    series,
  };

  return (
    <Card
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border-faint)',
        borderRadius: 16,
        marginBottom: 14,
        animation: 'fade-up .6s .1s cubic-bezier(.16,1,.3,1) forwards',
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
        Aging by สิทธิ
        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 400, color: 'var(--muted)' }}>จำแนกตามช่วงอายุหนี้</span>
      </div>
      <ReactECharts option={option} style={{ height: 300 }} />
    </Card>
  );
});
