export type DeepSeekMessage = { role: 'user' | 'assistant' | 'system'; content: string };

/**
 * askDeepSeek(prompt?, opts?)
 * - prompt: simple string (one-off)
 * - opts.messages: array of DeepSeekMessage for context (preferred for a copilot/chat)
 *
 * This helper calls your server-side proxy at /api/menu-assistant
 */
export async function askDeepSeek(prompt?: string, opts?: { messages?: DeepSeekMessage[] }) {
  const payload: any = {};
  if (opts?.messages) payload.messages = opts.messages;
  else payload.messages = [{ role: 'user', content: prompt ?? '' }];

  const res = await fetch('/api/menu-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Menu assistant error: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (data.reply) return data.reply;
  // fallback: try choices/text
  const choice = data?.raw?.choices?.[0];
  if (choice?.message?.content) return choice.message.content;
  if (choice?.text) return choice.text;
  return data;
}
