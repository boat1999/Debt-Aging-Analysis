import { Layout, Tooltip } from 'antd';
import {
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import type { UserInfo as UserInfoType } from '../../types/session';
import { useTheme } from '../../contexts/ThemeContext';

const { Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
  userInfo: UserInfoType;
  onLogout: () => void;
}

export function AppLayout({ children, userInfo, onLogout }: AppLayoutProps) {
  const { isDark, toggle } = useTheme();

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--ink)' }}>
      {/* Background layers */}
      <div className="bg-layer bg-noise" />
      <div className="bg-layer bg-glow" />
      <div className="bg-line bg-line-1" />
      <div className="bg-line bg-line-2" />

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        height: 58,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-faint)',
        boxShadow: '0 1px 0 rgba(201,169,110,0.08)',
      }}>
        {/* Left: Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(201,169,110,0.3)',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: -0.2,
          }}>
            BMS Debt Aging Analysis
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--gold)',
            padding: '2px 7px',
            borderRadius: 5,
            border: '1px solid rgba(201,169,110,0.3)',
            background: 'rgba(201,169,110,0.08)',
            letterSpacing: 0.5,
            lineHeight: 1.4,
          }}>
            v{__APP_VERSION__}
          </span>
        </div>

        {/* Right: Hospital + Theme + User + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-dim)', fontWeight: 400 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ opacity: 0.7 }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {userInfo.hospital_name}
          </div>

          <div style={{ width: 1, height: 20, background: 'var(--border-faint)' }} />

          <Tooltip title="เปลี่ยน Theme">
            <div
              onClick={toggle}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--card)',
                border: '1px solid var(--border-faint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--muted)',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? <MoonOutlined style={{ fontSize: 14 }} /> : <SunOutlined style={{ fontSize: 14 }} />}
            </div>
          </Tooltip>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--ink)',
              boxShadow: '0 2px 10px rgba(201,169,110,0.25)',
            }}>
              {userInfo.fullname.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              {userInfo.fullname}
            </span>
          </div>

          <div style={{ width: 1, height: 20, background: 'var(--border-faint)' }} />

          <div
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--critical)';
              e.currentTarget.style.borderColor = 'rgba(220,80,80,0.2)';
              e.currentTarget.style.background = 'rgba(220,80,80,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogoutOutlined style={{ fontSize: 13 }} />
            ออกจากระบบ
          </div>
        </div>
      </nav>

      <Content style={{ padding: '28px 28px 40px', background: 'transparent', position: 'relative', zIndex: 10 }}>
        {children}
      </Content>
    </Layout>
  );
}
