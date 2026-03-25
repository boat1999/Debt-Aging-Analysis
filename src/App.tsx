import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import thTH from 'antd/locale/th_TH';
import { useSession } from './hooks/useSession';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingState } from './components/shared/LoadingState';
import { ThemeProvider, useTheme, getThemeConfig } from './contexts/ThemeContext';
import { QUERY_CONFIG } from './config/constants';
import './index.css';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const DebtDetailPage = lazy(() => import('./pages/DebtDetailPage').then((m) => ({ default: m.DebtDetailPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.staleTime,
      refetchInterval: QUERY_CONFIG.refetchInterval,
      retry: QUERY_CONFIG.retry,
      gcTime: QUERY_CONFIG.gcTime,
    },
  },
});

function ThemedApp() {
  const { mode } = useTheme();
  const themeConfig = getThemeConfig(mode);

  return (
    <ConfigProvider locale={thTH} theme={themeConfig}>
      <AppContent />
    </ConfigProvider>
  );
}

function AppContent() {
  const { sessionConfig, isLoading, error, login, logout } = useSession();

  if (isLoading) {
    return <LoadingState tip="กำลังตรวจสอบ Session..." />;
  }

  if (!sessionConfig) {
    return <LoginPage onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <AppLayout userInfo={sessionConfig.userInfo} onLogout={logout}>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<DashboardPage sessionConfig={sessionConfig} />} />
          <Route path="/detail/:pttype" element={<DebtDetailPage sessionConfig={sessionConfig} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemedApp />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
