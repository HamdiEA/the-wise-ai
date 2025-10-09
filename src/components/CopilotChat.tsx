import React, { useState, useRef, useEffect } from 'react';
import { askDeepSeek, DeepSeekMessage } from '../lib/deepseek';
import menuData from '../data/menu.json';

export default function CopilotChat() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<'en'|'fr'>('en');
  const [messages, setMessages] = useState<DeepSeekMessage[]>([
    { role: 'system', content: `You are Wiser — a friendly restaurant copilot 🍽️. Speak in English or French based on the user's preference (use 'fr' to switch to French). Be warm, playful, add a short joke, and when answering about food reference the menu below. Keep replies brief and lovely.

Menu items (for reference):
- Vous avez déjà sélectionné le maximum de pizzas pour une pizza 1m\n- Supplement added\n- Margherita\n- Tuna\n- Vegetarien\n- Queen\n- Orientale\n- Pepperoni\n- Chicken Supreme\n- Regina\n- Chicken Grilli\n- Mexicain\n- Kentucky\n- Norwegian\n- Sea Food\n- Newton\n- Einstein\n- Barlow\n- Millikan\n- Ampere\n- Gauss\n- John Locke\n- Pesto\n- Chicken Spicy\n- Carnot\n- Mariotte\n- Kepler\n- Van der waals\n- Tesla\n- The Wise\n- Sauce Tomate, Mozzarella\n- Thon, Tomates Fraîches, Oignons, Olives, Sauce Tomate, Mozzarella\n- Thon, Jambon de Dinde, Champignons, Poivrons, Oignons, Olives, Mozzarella, Sauce Tomate\n- Champignons, Poivrons, Oignons, Olives, Tomates Fraîches, Mozzarella, Sauce Tomate\n- Jambon de Dinde, Champignons, Mozzarella, Sauce Tomate\n- Merguez, Poivrons, Oignons, Champignons, Tomates Fraîches, Sauce Tomate, Mozzarella\n- Pepperoni, Oignons, Sauce Tomate, Mozzarella\n- Poulet, Champignons, Poivrons, Sauce Tomate, Mozzarella\n- Sauce Tomate, Mozzarella, Fromage, Sauce Blanche\n- Jambon de Dinde, Champignons, Oignons, Olives, Sauce Tomate, Mozzarella

If asked about prices or details not listed here, respond that the menu file is the source of truth and ask if they'd like recommendations.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const augmented = [
        ...messages,
        userMsg,
        { role: 'system' as const, content: 'Context: the website menu is available to assist users.' }
      ];
      const reply = await askDeepSeek(undefined, { messages: augmented });
      const assistantMsg = { role: 'assistant' as const, content: String(reply) };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errMsg = { role: 'assistant' as const, content: 'Oops — there was an error reaching the copilot. Please try again.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(s => !s)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl focus:outline-none"
        >
          <span className="text-sm">Wiser • Copilot</span>
        </button>
      </div>

      {open && (
        <div className="fixed bottom-20 right-6 w-96 max-w-full bg-card border rounded-2xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-sm">Wiser — Your friendly copilot</div>
              <div className="text-xs text-muted-foreground">Ask about the menu in English or Français (toggle below)</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(l => l==='en'?'fr':'en')} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">Lang: {lang}</button>
              <button onClick={() => setOpen(false)} className="text-xs px-2 py-1 rounded-md hover:bg-muted">Close</button>
            </div>
          </div>

          <div className="h-64 overflow-y-auto mb-3 border rounded-md p-3 bg-popover text-popover-foreground">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'user' ? 'text-sm text-right mb-2' : 'text-sm text-left mb-2'}>
                <div className={'inline-block p-2 rounded-lg ' + (m.role==='user' ? 'bg-muted' : 'bg-accent text-accent-foreground')}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e:any)=>setInput(e.target.value)}
              onKeyDown={(e:any)=>{ if(e.key==='Enter') sendMessage(); }}
              placeholder={lang==='en' ? 'Ask about the menu, e.g. "What desserts are gluten-free?"' : 'Demandez le menu, ex : "Quels desserts sont sans gluten ?"' }
              className="flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-primary text-primary-foreground text-sm px-3 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? '...' : (lang==='en' ? 'Send' : 'Envoyer')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
