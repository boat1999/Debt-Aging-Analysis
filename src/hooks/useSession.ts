import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { validateSession } from '../api/hosxp-client';
import { SESSION_CONFIG } from '../config/constants';
import type { SessionConfig } from '../types/session';

interface UseSessionReturn {
  sessionConfig: SessionConfig | null;
  isLoading: boolean;
  error: string | null;
  login: (sessionId: string) => Promise<void>;
  logout: () => void;
}

export function useSession(): UseSessionReturn {
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await validateSession(sessionId);
      Cookies.set(SESSION_CONFIG.cookieName, sessionId, {
        expires: SESSION_CONFIG.cookieExpiry,
      });
      setSessionConfig(config);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Session validation failed';
      setError(message);
      Cookies.remove(SESSION_CONFIG.cookieName);
      setSessionConfig(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(SESSION_CONFIG.cookieName);
    setSessionConfig(null);
    setError(null);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get(SESSION_CONFIG.urlParamName);

    if (fromUrl) {
      urlParams.delete(SESSION_CONFIG.urlParamName);
      const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
      login(fromUrl);
      return;
    }

    const fromCookie = Cookies.get(SESSION_CONFIG.cookieName);
    if (fromCookie) {
      login(fromCookie);
      return;
    }

    setIsLoading(false);
  }, [login]);

  return { sessionConfig, isLoading, error, login, logout };
}
