import type { SessionConfig, SessionValidationResponse } from '../types/session';
import { SESSION_CONFIG } from '../config/constants';
import { minifySql } from '../utils/sql';

const HOSXP_PASTE_URL = 'https://hosxp.net/phapi/PasteJSON';
const SESSION_TIMEOUT_MS = 30_000;
const QUERY_TIMEOUT_MS = 60_000;

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function validateSession(sessionId: string): Promise<SessionConfig> {
  const url = `${HOSXP_PASTE_URL}?Action=GET&code=${encodeURIComponent(sessionId)}`;
  let res: Response;
  try {
    res = await fetchWithTimeout(url, {}, SESSION_TIMEOUT_MS);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('ตรวจสอบ Session หมดเวลา กรุณาลองใหม่');
    }
    throw err;
  }
  const data: SessionValidationResponse = await res.json();

  if (data.MessageCode !== 200) {
    throw new Error(data.Message || 'Session หมดอายุ กรุณา Login ใหม่ที่ HOSxP');
  }

  const result = data.result;
  if (!result) {
    throw new Error('Invalid session response');
  }

  if (result.expired_second !== undefined && result.expired_second <= 0) {
    throw new Error('Session หมดอายุแล้ว กรุณา Login ใหม่ที่ HOSxP Desktop Application');
  }

  const keyValue = result.key_value;
  const userInfo = result.user_info;

  const apiUrl =
    (typeof keyValue === 'object' ? keyValue?.['hosxp.api_url'] : undefined) ??
    userInfo?.['hosxp.api_url'] ??
    userInfo?.bms_url;

  const apiAuthKey =
    (typeof keyValue === 'object' ? keyValue?.['hosxp.api_auth_key'] : undefined) ??
    userInfo?.['hosxp.api_auth_key'] ??
    userInfo?.bms_session_code ??
    (typeof keyValue === 'string' ? keyValue : undefined);

  if (!apiUrl || !apiAuthKey) {
    throw new Error('ไม่สามารถดึงข้อมูล API จาก Session ได้');
  }

  return {
    apiUrl,
    apiAuthKey,
    userInfo: {
      fullname: userInfo?.fullname ?? userInfo?.name ?? 'Unknown',
      hospital_name: userInfo?.hospital_name ?? userInfo?.location ?? 'Unknown',
    },
  };
}

export async function querySql<T>(
  config: SessionConfig,
  sql: string,
  retries = 3,
): Promise<T[]> {
  const minified = minifySql(sql);
  const url = `${config.apiUrl}/api/sql`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.apiAuthKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql: minified, app: SESSION_CONFIG.appIdentifier }),
        },
        QUERY_TIMEOUT_MS,
      );

      if (res.status === 401) {
        throw new Error('Auth Key หมดอายุ กรุณา Login ใหม่');
      }
      if (res.status === 502) {
        throw new Error('ปัญหาการเชื่อมต่อ Tunnel');
      }

      const data = await res.json();
      if (data.MessageCode !== 200) {
        throw new Error(data.Message || 'Query failed');
      }

      return data.data as T[];
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        lastError = new Error('Query ใช้เวลานานเกินไป');
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
      if (error instanceof Error && error.message === 'Auth Key หมดอายุ กรุณา Login ใหม่') {
        throw error;
      }
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error('Query failed after retries');
}
