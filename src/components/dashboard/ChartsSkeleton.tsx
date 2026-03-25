import { Row, Col, Card, Skeleton, theme } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const { useToken } = theme;

const BAR_HEIGHTS = [80, 20, 30, 15, 180];
const BAR_SEGMENTS = [0.35, 0.25, 0.2, 0.12, 0.08];

export function ChartsSkeleton() {
  const { isDark } = useTheme();
  const { token } = useToken();

  const cardStyle = {
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: 12,
    marginBottom: 14,
    boxShadow: isDark ? 'none' as const : '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <Row gutter={[14, 14]}>
      {/* Bar Chart Skeleton */}
      <Col xs={24} lg={12}>
        <Card style={cardStyle} styles={{ body: { padding: '16px 18px' } }}>
          <Skeleton.Input active size="small" style={{ width: 130, height: 16, borderRadius: 4, marginBottom: 12, display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 220, padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingBottom: 20 }}>
              {[...Array(5)].map((_, i) => (
                <Skeleton.Input key={i} active size="small" style={{ width: 32, height: 10, borderRadius: 3 }} />
              ))}
            </div>
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '60%', gap: 1 }}>
                  {BAR_SEGMENTS.map((seg, si) => (
                    <Skeleton.Input key={si} active size="small" style={{
                      width: '100%', height: Math.max(h * seg, 3), borderRadius: si === 0 ? '4px 4px 0 0' : 0, display: 'block',
                    }} />
                  ))}
                </div>
                <Skeleton.Input active size="small" style={{ width: '80%', height: 10, borderRadius: 3, marginTop: 4 }} />
              </div>
            ))}
          </div>
        </Card>
      </Col>

      {/* Donut Chart Skeleton */}
      <Col xs={24} lg={12}>
        <Card style={cardStyle} styles={{ body: { padding: '16px 18px' } }}>
          <Skeleton.Input active size="small" style={{ width: 150, height: 16, borderRadius: 4, marginBottom: 12, display: 'block' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '8px 0' }}>
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              <Skeleton.Avatar active size={180} shape="circle" />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 100, height: 100, borderRadius: '50%',
                background: token.colorBgContainer,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Skeleton.Input active size="small" style={{ width: 50, height: 10, borderRadius: 3 }} />
                <Skeleton.Input active size="small" style={{ width: 70, height: 14, borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {[60, 68, 76, 64, 72].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Skeleton.Avatar active size={10} shape="square" style={{ borderRadius: 2 }} />
                  <Skeleton.Input active size="small" style={{ width: w, height: 10, borderRadius: 3 }} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Col>

      {/* Trend Line/Area Chart Skeleton */}
      <Col span={24}>
        <Card style={{ ...cardStyle, marginBottom: 20 }} styles={{ body: { padding: '16px 18px' } }}>
          <Skeleton.Input active size="small" style={{ width: 200, height: 16, borderRadius: 4, marginBottom: 12, display: 'block' }} />
          <div style={{ position: 'relative', height: 200, padding: '8px 0' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {[...Array(5)].map((_, i) => (
                <Skeleton.Input key={i} active size="small" style={{ width: 28, height: 10, borderRadius: 3 }} />
              ))}
            </div>
            <div style={{ marginLeft: 40, height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 720 180">
                <defs>
                  <linearGradient id="skelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDark ? '#252836' : '#E8E6FF'} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={isDark ? '#1A1D2A' : '#F8F9FC'} stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0,140 C60,130 120,90 200,70 C280,50 360,30 440,20 C520,10 600,15 720,25 L720,180 L0,180 Z" fill="url(#skelGrad)" />
                <path d="M0,160 C60,155 120,145 200,135 C280,125 360,110 440,95 C520,80 600,65 720,50 L720,180 L0,180 Z" fill="url(#skelGrad)" opacity="0.5" />
              </svg>
            </div>
            <div style={{ marginLeft: 40, display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton.Input key={i} active size="small" style={{ width: 48, height: 10, borderRadius: 3 }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, marginLeft: 40 }}>
            {[48, 40].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Skeleton.Input active size="small" style={{ width: 24, height: 3, borderRadius: 2 }} />
                <Skeleton.Input active size="small" style={{ width: w, height: 10, borderRadius: 3 }} />
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
