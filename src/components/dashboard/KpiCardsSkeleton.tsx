import { Row, Col, Card, Skeleton, theme } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const { useToken } = theme;

export function KpiCardsSkeleton() {
  const { isDark } = useTheme();
  const { token } = useToken();

  const accents = ['#6C63FF', isDark ? '#00D4AA' : '#00B896', '#22C55E', '#F59E0B'];

  return (
    <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
      {accents.map((accent, i) => (
        <Col xs={12} lg={6} key={i}>
          <Card
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderLeft: `3px solid ${accent}`,
              borderRadius: 12,
              boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
            }}
            styles={{ body: { padding: '16px 18px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Skeleton.Avatar active size={20} shape="square" style={{ borderRadius: 6 }} />
              <Skeleton.Input active size="small" style={{ width: 80, height: 12, borderRadius: 4 }} />
            </div>
            <Skeleton.Input active size="large" style={{ width: '70%', height: 28, borderRadius: 6, marginBottom: 8, display: 'block' }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
