import { Card, Skeleton, theme } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const { useToken } = theme;

const COL_WIDTHS = [
  ['55%', '80%', '40%', '40%', '80%', '40%', '80%'],
  ['70%', '40%', '40%', '40%', '40%', '80%', '80%'],
  ['45%', '80%', '80%', '40%', '80%', '80%', '40%'],
  ['60%', '40%', '40%', '80%', '40%', '40%', '80%'],
  ['50%', '80%', '40%', '80%', '80%', '40%', '40%'],
  ['65%', '40%', '80%', '40%', '40%', '80%', '80%'],
  ['45%', '80%', '80%', '80%', '80%', '80%', '80%'],
];

export function AgingTableSkeleton() {
  const { isDark } = useTheme();
  const { token } = useToken();

  const gridCols = '2fr 1fr 1fr 1fr 1fr 1fr 1fr';

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 12,
        marginBottom: 20,
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
      styles={{ body: { padding: '16px 18px' } }}
    >
      <Skeleton.Input active size="small" style={{ width: 160, height: 18, borderRadius: 4, marginBottom: 14, display: 'block' }} />

      {/* Header row */}
      <div style={{
        display: 'grid', gridTemplateColumns: gridCols, gap: 8,
        padding: '10px 14px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: isDark ? '#1A1D2A' : '#F1F3F9',
        borderRadius: '8px 8px 0 0',
      }}>
        {['40%', 60, 60, 60, 60, 70, 70].map((w, i) => (
          <Skeleton.Input key={i} active size="small" style={{ width: w, height: 11, borderRadius: 3 }} />
        ))}
      </div>

      {/* Data rows */}
      {COL_WIDTHS.map((widths, rowIdx) => (
        <div key={rowIdx} style={{
          display: 'grid', gridTemplateColumns: gridCols, gap: 8,
          padding: '11px 14px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: rowIdx % 2 === 1 ? (isDark ? '#1A1D2A' : '#FAFAFC') : 'transparent',
        }}>
          {widths.map((w, colIdx) => (
            <Skeleton.Input
              key={colIdx}
              active
              size="small"
              style={{
                width: w,
                height: 12,
                borderRadius: 3,
                marginLeft: colIdx > 0 ? 'auto' : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </Card>
  );
}
