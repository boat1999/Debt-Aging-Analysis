import { memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import type { TrendDataPoint } from '../../types/debt';

interface TrendLineChartProps {
  data: TrendDataPoint[] | undefined;
}

export const TrendLineChart = memo(function TrendLineChart({ data }: TrendLineChartProps) {
  const { isDark } = useTheme();
  if (!data || data.length === 0) return null;

  const months = data.map((d) => d.month);
  const debtAmounts = data.map((d) => d.new_debt_amount);
  const arAmounts = data.map((d) => d.ar_amount);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#111122' : '#ffffff',
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      textStyle: { color: isDark ? '#e4dfd4' : '#1a1a2e', fontSize: 12, fontFamily: "'DM Sans', sans-serif" },
      formatter: (params: Array<{ seriesName: string; value: number; color: string; axisValue: string }>) => {
        let result = `<div style="font-weight:600;margin-bottom:4px">${params[0]?.axisValue ?? ''}</div>`;
        for (const p of params) result += `<span style="color:${p.color}">●</span> ${p.seriesName}: <span style="font-family:'Outfit',sans-serif;font-weight:600">฿${p.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><br/>`;
        return result;
      },
    },
    legend: { bottom: 0, textStyle: { color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: { type: 'category', data: months, axisLabel: { color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 11 }, axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' } } },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#6a6a82' : '#8a8a9a', fontSize: 11, fontFamily: "'Outfit', sans-serif",
        formatter: (val: number) => val >= 1_000_000 ? `${(val / 1_000_000).toFixed(0)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(0)}K` : String(val),
      },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' } },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'หนี้ใหม่', type: 'line', data: debtAmounts, smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: '#c9a96e', width: 2 }, itemStyle: { color: '#c9a96e' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(201,169,110,0.2)' }, { offset: 1, color: 'rgba(201,169,110,0.02)' }] } },
      },
      {
        name: 'โอน AR', type: 'line', data: arAmounts, smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: '#4db891', width: 2 }, itemStyle: { color: '#4db891' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(77,184,145,0.15)' }, { offset: 1, color: 'rgba(77,184,145,0.02)' }] } },
      },
    ],
  };

  return (
    <Card
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border-faint)',
        borderRadius: 16,
        marginBottom: 20,
        animation: 'fade-up .6s .19s cubic-bezier(.16,1,.3,1) forwards',
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
        แนวโน้มหนี้รายเดือน (12 เดือน)
        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 400, color: 'var(--muted)' }}>หนี้ใหม่ vs โอน AR</span>
      </div>
      <ReactECharts option={option} style={{ height: 260 }} />
    </Card>
  );
});
