export type DeepSeekMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export interface TokenInfo {
  token: string;
  messagesUsed: number;
  messagesLimit: number;
  resetAt: number;
  messagesRemaining?: number;
}

/**
 * Get or refresh JWT token from the server
 */
export async function getAuthToken(existingToken?: string): Promise<TokenInfo> {
  const res = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: existingToken })
  });

  if (!res.ok) {
    throw new Error(`Token error: ${res.status}`);
  }

  return await res.json();
}

/**
 * Verify token and increment message count
 */
export async function verifyAndIncrementToken(token: string): Promise<TokenInfo> {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    if (data.expired || data.limitReached) {
      throw new Error(data.error);
    }
    throw new Error(`Verification error: ${res.status}`);
  }

  return await res.json();
}

/**
 * askDeepSeek(prompt?, opts?)
 * - prompt: simple string (one-off)
 * - opts.messages: array of DeepSeekMessage for context (preferred for a copilot/chat)
 * - opts.token: JWT token for authentication
 *
 * This helper calls your server-side proxy at /api/menu-assistant
 */
export async function askDeepSeek(prompt?: string, opts?: { messages?: DeepSeekMessage[]; token?: string }) {
  // Verify token before making request
  if (!opts?.token) {
    throw new Error('Authentication token required');
  }

  const tokenInfo = await verifyAndIncrementToken(opts.token);

  const payload: any = {};
  if (opts?.messages) payload.messages = opts.messages;
  else payload.messages = [{ role: 'user', content: prompt ?? '' }];

  const res = await fetch('/api/menu-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${opts.token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Menu assistant error: ${res.status} ${text}`);
  }

  const data = await res.json();
  
  // Return both the reply and updated token info
  let reply = '';
  if (data.reply) reply = data.reply;
  else {
    const choice = data?.raw?.choices?.[0];
    if (choice?.message?.content) reply = choice.message.content;
    else if (choice?.text) reply = choice.text;
    else reply = data;
  }

  return {
    reply,
    tokenInfo
  };
}
