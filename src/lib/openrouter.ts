export type Message = { role: 'user' | 'assistant' | 'system'; content: string };
type Lang = 'fr' | 'en' | 'ar';

interface RateInfo {
  remaining: number;
  resetAt: number;
  limit: number;
}

interface TokenResponse {
  token: string;
  messagesUsed: number;
  messagesLimit: number;
  resetAt: number;
  messagesRemaining?: number;
}

interface ChatResponse extends TokenResponse {
  reply: string;
}

const MESSAGE_LIMIT = 5;
const FALLBACK_WINDOW_MS = 12 * 60 * 60 * 1000;
const TOKEN_STORAGE_KEY = 'wr_jwt_token';

let latestRateInfo: RateInfo = {
  remaining: MESSAGE_LIMIT,
  limit: MESSAGE_LIMIT,
  resetAt: Date.now() + FALLBACK_WINDOW_MS,
};

function normalizeResetAt(resetAt: number): number {
  if (!Number.isFinite(resetAt) || resetAt <= 0) {
    return Date.now() + FALLBACK_WINDOW_MS;
  }
  return resetAt > 1e12 ? resetAt : resetAt * 1000;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore storage errors
  }
}

function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const json = atob(normalized + padding);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function updateRateInfoFromServer(data: {
  messagesLimit: number;
  messagesUsed: number;
  resetAt: number;
  messagesRemaining?: number;
}): RateInfo {
  const limit = Number(data.messagesLimit) || MESSAGE_LIMIT;
  const used = Number(data.messagesUsed) || 0;
  const remainingFromServer = Number(data.messagesRemaining);

  const remaining = Number.isFinite(remainingFromServer)
    ? Math.max(0, remainingFromServer)
    : Math.max(0, limit - used);

  latestRateInfo = {
    limit,
    remaining,
    resetAt: normalizeResetAt(Number(data.resetAt)),
  };

  return latestRateInfo;
}

function deriveRateInfoFromToken(): RateInfo | null {
  const token = readToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const messagesUsed = Number(payload.messagesUsed) || 0;
  const exp = Number(payload.exp) || 0;
  const resetAt = normalizeResetAt(exp);
  const remaining = Math.max(0, MESSAGE_LIMIT - messagesUsed);

  return {
    limit: MESSAGE_LIMIT,
    remaining,
    resetAt,
  };
}

export function getRateInfo(): RateInfo {
  const derived = deriveRateInfoFromToken();
  if (derived) {
    latestRateInfo = derived;
    return derived;
  }

  return latestRateInfo;
}

async function requestToken(existingToken?: string, refresh = false): Promise<TokenResponse> {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: existingToken, refresh }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 500 && data?.error === 'server_misconfigured') {
      throw Object.assign(new Error('server_misconfigured'), { code: 'no_key' });
    }

    throw new Error(data?.message || `Token error: ${response.status}`);
  }

  return data as TokenResponse;
}

async function ensureToken(forceRefresh = false): Promise<TokenResponse> {
  const existingToken = forceRefresh ? null : readToken();
  const tokenInfo = await requestToken(existingToken || undefined, forceRefresh);

  if (tokenInfo.token) {
    writeToken(tokenInfo.token);
  }

  updateRateInfoFromServer(tokenInfo);
  return tokenInfo;
}

export async function syncRateInfo(forceRefresh = false): Promise<RateInfo> {
  try {
    await ensureToken(forceRefresh);
  } catch {
    // keep latest known state
  }
  return getRateInfo();
}

export async function askWiserAI(messages: Message[], lang: Lang = 'fr'): Promise<string> {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages are required');
  }

  let tokenInfo = await ensureToken(false);

  const sendRequest = async (token: string) => {
    return fetch('/api/menu-assistant', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, lang }),
    });
  };

  let response = await sendRequest(tokenInfo.token);
  if (response.status === 401) {
    tokenInfo = await ensureToken(true);
    response = await sendRequest(tokenInfo.token);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 429 || data?.error === 'limit_reached') {
      if (typeof data?.resetAt === 'number') {
        updateRateInfoFromServer({
          messagesLimit: Number(data.messagesLimit) || MESSAGE_LIMIT,
          messagesUsed: Number(data.messagesUsed) || MESSAGE_LIMIT,
          messagesRemaining: 0,
          resetAt: Number(data.resetAt),
        });
      }

      throw Object.assign(new Error('limit_reached'), {
        code: 'limit_reached',
        resetAt: getRateInfo().resetAt,
      });
    }

    if (response.status === 500 && data?.error === 'server_misconfigured') {
      throw Object.assign(new Error('server_misconfigured'), { code: 'no_key' });
    }

    throw new Error(data?.message || `Menu assistant error: ${response.status}`);
  }

  const chatData = data as ChatResponse;
  if (chatData.token) {
    writeToken(chatData.token);
  }

  updateRateInfoFromServer(chatData);
  return typeof chatData.reply === 'string' ? chatData.reply : '';
}

export function clearChatToken() {
  clearToken();
  latestRateInfo = {
    remaining: MESSAGE_LIMIT,
    limit: MESSAGE_LIMIT,
    resetAt: Date.now() + FALLBACK_WINDOW_MS,
  };
}
