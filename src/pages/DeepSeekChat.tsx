import React, { useState } from 'react';
import { askDeepSeek, DeepSeekMessage } from '../lib/deepseek';

const DEFAULT_SYSTEM = `You are Wiser — a playful, warm, and welcoming restaurant assistant for our website. Speak in a friendly, concise tone (1–3 short sentences) unless the user asks for more detail. Use the website's menu to recommend dishes, explain ingredients and allergens, suggest pairings, and offer helpful alternatives for dietary restrictions. Do not invent menu items or prices. If uncertain about availability, suggest the user contact the restaurant. Ask one brief clarifying question only when necessary.`;

export default function DeepSeekChat() {
  const [messages, setMessages] = useState<DeepSeekMessage[]>([{ role: 'system', content: DEFAULT_SYSTEM }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg: DeepSeekMessage = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const reply = await askDeepSeek(undefined, { messages: nextMessages });
      const assistantMsg: DeepSeekMessage = { role: 'assistant', content: typeof reply === 'string' ? reply : JSON.stringify(reply) };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err: any) {
      const assistantMsg: DeepSeekMessage = { role: 'assistant', content: `Oops — I couldn't reach the assistant. (${err?.message || err})` };
      setMessages((m) => [...m, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-3">
        <div className="bg-white p-3 rounded shadow">
          <div className="space-y-2">
            {messages.filter(m => m.role !== 'system').map((m, idx) => (
              <div key={idx} className={`p-2 rounded ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className="text-sm">{m.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 input px-3 py-2 rounded border"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Wiser about the menu, ingredients, or for recommendations..."
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button className="btn" onClick={sendMessage} disabled={loading}>
            {loading ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
