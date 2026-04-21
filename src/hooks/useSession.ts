import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
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

const COOKIE_OPTIONS = {
  expires: SESSION_CONFIG.cookieExpiry,
  sameSite: 'strict' as const,
};

function setSessionCookie(sessionId: string) {
  Cookies.set(SESSION_CONFIG.cookieName, sessionId, {
    ...COOKIE_OPTIONS,
    secure: window.location.protocol === 'https:',
  });
}

export function useSession(): UseSessionReturn {
  const queryClient = useQueryClient();
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tryValidate = useCallback(
    async (sessionId: string): Promise<SessionConfig | null> => {
      try {
        const config = await validateSession(sessionId);
        setSessionCookie(sessionId);
        queryClient.clear();
        setSessionConfig(config);
        setError(null);
        return config;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Session validation failed';
        setError(message);
        return null;
      }
    },
    [queryClient],
  );

  const login = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      const config = await tryValidate(sessionId);
      if (!config) {
        Cookies.remove(SESSION_CONFIG.cookieName);
        setSessionConfig(null);
      }
      setIsLoading(false);
    },
    [tryValidate],
  );

  const logout = useCallback(() => {
    Cookies.remove(SESSION_CONFIG.cookieName);
    queryClient.clear();
    setSessionConfig(null);
    setError(null);
  }, [queryClient]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const fromUrl = urlParams.get(SESSION_CONFIG.urlParamName);
      const fromCookie = Cookies.get(SESSION_CONFIG.cookieName);

      if (fromUrl) {
        urlParams.delete(SESSION_CONFIG.urlParamName);
        const newUrl =
          window.location.pathname +
          (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newUrl);

        const urlConfig = await tryValidate(fromUrl);
        if (cancelled) return;
        if (urlConfig) {
          setIsLoading(false);
          return;
        }

        if (fromCookie && fromCookie !== fromUrl) {
          const cookieConfig = await tryValidate(fromCookie);
          if (cancelled) return;
          if (!cookieConfig) {
            Cookies.remove(SESSION_CONFIG.cookieName);
            setSessionConfig(null);
          }
        } else {
          Cookies.remove(SESSION_CONFIG.cookieName);
          setSessionConfig(null);
        }
        setIsLoading(false);
        return;
      }

      if (fromCookie) {
        const cookieConfig = await tryValidate(fromCookie);
        if (cancelled) return;
        if (!cookieConfig) {
          Cookies.remove(SESSION_CONFIG.cookieName);
          setSessionConfig(null);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [tryValidate]);

  return { sessionConfig, isLoading, error, login, logout };
}
