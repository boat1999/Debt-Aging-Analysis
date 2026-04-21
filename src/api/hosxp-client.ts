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

  if (!res.ok) {
    throw new Error(`ดึงข้อมูล Session ล้มเหลว (HTTP ${res.status})`);
  }

  const data: SessionValidationResponse = await res.json();

  if (data.MessageCode !== 200) {
    if (data.MessageCode === 500) {
      throw new Error('Session หมดอายุ กรุณา Login ใหม่ที่ HOSxP Desktop Application');
    }
    throw new Error(data.Message || 'Session หมดอายุ กรุณา Login ใหม่ที่ HOSxP');
  }

  const result = data.result;
  if (!result) {
    throw new Error('Invalid session response');
  }

  if (result.expired_second !== undefined && result.expired_second <= 0) {
    throw new Error('Session หมดอายุแล้ว กรุณา Login ใหม่ที่ HOSxP Desktop Application');
  }

  const userInfo = result.user_info;
  const apiUrl = userInfo?.bms_url;

  let apiAuthKey: string | undefined;
  let tokenSource: string;
  if (userInfo?.bms_session_code) {
    apiAuthKey = userInfo.bms_session_code;
    tokenSource = 'user_info.bms_session_code';
  } else if (result.key_value) {
    apiAuthKey = result.key_value;
    tokenSource = 'result.key_value';
  } else {
    apiAuthKey = result.auth_key;
    tokenSource = 'result.auth_key';
  }

  if (!apiUrl) {
    throw new Error('ไม่พบ bms_url ใน session กรุณา Login ใหม่');
  }
  if (!apiAuthKey) {
    throw new Error('ไม่พบ session token กรุณา Login ใหม่');
  }

  console.info('[hosxp-client] session validated', {
    apiUrl,
    tokenSource,
    tokenPrefix: apiAuthKey.slice(0, 8) + '...',
    tokenLength: apiAuthKey.length,
    bmsDatabaseName: userInfo?.bms_database_name,
    bmsDatabaseType: userInfo?.bms_database_type,
  });

  return {
    apiUrl,
    apiAuthKey,
    userInfo: {
      fullname: userInfo?.name ?? 'Unknown',
      hospital_name: userInfo?.location ?? 'Unknown',
    },
  };
}

export async function querySql<T>(
  config: SessionConfig,
  sql: string,
  retries = 2,
): Promise<T[]> {
  const minified = minifySql(sql);
  const app = SESSION_CONFIG.appIdentifier;
  const url =
    `${config.apiUrl}/api/sql?sql=${encodeURIComponent(minified)}` +
    `&app=${encodeURIComponent(app)}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.apiAuthKey}`,
          },
        },
        QUERY_TIMEOUT_MS,
      );

      if (res.status === 401) {
        throw new Error('Auth Key หมดอายุ กรุณา Login ใหม่');
      }
      if (res.status === 501) {
        let responseBody = '';
        try { responseBody = await res.text(); } catch { /* ignore */ }
        console.error('[hosxp-client] 501 response', {
          url,
          app,
          tokenPrefix: config.apiAuthKey.slice(0, 8) + '...',
          responseBody,
        });
        throw new Error('Session ไม่ได้รับสิทธิเข้าถึง API กรุณา Login ใหม่ที่ HOSxP Desktop');
      }
      if (res.status === 502) {
        throw new Error('ปัญหาการเชื่อมต่อ Tunnel');
      }
      if (!res.ok) {
        throw new Error(`SQL API ตอบกลับ HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.MessageCode === 500 || data.MessageCode === 501) {
        throw new Error('Session ไม่ได้รับสิทธิเข้าถึง API กรุณา Login ใหม่ที่ HOSxP Desktop');
      }
      if (data.MessageCode !== 200) {
        throw new Error(data.Message || 'Query failed');
      }

      return data.data as T[];
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        lastError = new Error('Query ใช้เวลานานเกินไป');
      } else if (error instanceof TypeError && /fetch|network|CORS/i.test(error.message)) {
        lastError = new Error(`เชื่อมต่อ API ไม่ได้ (${url}) อาจติด CORS หรือเครือข่าย`);
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
      console.warn(`[hosxp-client] attempt ${attempt + 1}/${retries} failed:`, lastError.message);

      const fatalMessages = [
        'Auth Key หมดอายุ กรุณา Login ใหม่',
        'Session ไม่ได้รับสิทธิเข้าถึง API กรุณา Login ใหม่ที่ HOSxP Desktop',
      ];
      if (error instanceof Error && fatalMessages.includes(error.message)) {
        throw error;
      }
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error('Query failed after retries');
}
