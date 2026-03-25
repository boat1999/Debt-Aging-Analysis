import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { theme as antTheme } from 'antd';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  toggle: () => {},
  isDark: true,
});

const STORAGE_KEY = 'bms-theme';

function getInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  return 'dark';
}

const DARK_TOKENS = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorBgBase: '#07070f',
    colorBgContainer: '#0d0d1a',
    colorBgElevated: '#111122',
    colorBorder: 'rgba(201,169,110,0.18)',
    colorBorderSecondary: 'rgba(255,255,255,0.06)',
    colorPrimary: '#c9a96e',
    colorSuccess: '#4db891',
    colorWarning: '#e8a53a',
    colorError: '#e05555',
    colorTextBase: '#e4dfd4',
    colorTextSecondary: '#6a6a82',
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
};

const LIGHT_TOKENS = {
  algorithm: antTheme.defaultAlgorithm,
  token: {
    colorBgBase: '#F8F9FC',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#F1F3F9',
    colorBorder: '#E4E7EF',
    colorBorderSecondary: '#E4E7EF',
    colorPrimary: '#9a7a45',
    colorSuccess: '#00B896',
    colorWarning: '#E09000',
    colorError: '#DC2626',
    colorTextBase: '#111827',
    colorTextSecondary: '#6B7280',
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
};

export function getThemeConfig(mode: ThemeMode) {
  return mode === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, toggle, isDark: mode === 'dark' }),
    [mode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
