import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { askWiserAI, getRateInfo, Message, API_KEY } from "@/lib/openrouter";
import t, { tr, trArr } from "@/data/translations";
import type { Lang } from "@/context/LanguageContext";

const MAX_MESSAGES = 10; // 5 user + 5 assistant

const AiAvatar = () => (
  <div className="wise-ai-avatar" aria-hidden="true">
    <Sparkles size={13} />
  </div>
);

interface Props {
  lang?: Lang;
  setLang?: (l: Lang) => void;
}

export default function SimpleCopilotChat({ lang: langProp, setLang: setLangProp }: Props = {}) {
  const [langLocal, setLangLocal] = useState<Lang>("fr");
  const lang = langProp ?? langLocal;
  const setLang = setLangProp ?? setLangLocal;
  const controlled = langProp !== undefined;
  const storageKey = `chatMessages_${lang}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateInfo, setRateInfo] = useState(getRateInfo);
  const [countdown, setCountdown] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const reachedLimit = rateInfo.remaining <= 0;

  useEffect(() => {
    if (!reachedLimit) { setCountdown(null); return; }
    const update = () => {
      const diff = Math.max(0, rateInfo.resetAt - Date.now());
      if (diff === 0) { setRateInfo(getRateInfo()); setCountdown(null); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [reachedLimit, rateInfo.resetAt]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setMessages(Array.isArray(parsed) ? parsed : []);
    } catch {
      setMessages([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, storageKey]);

  const trim = (msgs: Message[]) => msgs.slice(-MAX_MESSAGES);

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    localStorage.removeItem(storageKey);
  };

  const send = async () => {
    if (!input.trim() || loading || reachedLimit) return;
    setLoading(true);
    setError(null);

    const userMsg: Message = { role: "user", content: input.trim() };
    const next = trim([...messages, userMsg]);
    setMessages(next);
    setInput("");

    try {
      const reply = await askWiserAI(
        next.filter(m => m.role !== "system") as Message[],
        lang
      );
      setMessages(prev => trim([...prev, { role: "assistant", content: reply }]));
      setRateInfo(getRateInfo());
    } catch (err: any) {
      if (err?.code === 'no_key') {
        setError(tr(t.ai.noKey, lang));
      } else if (err?.code === 'limit_reached') {
        setRateInfo(getRateInfo());
        setError(tr(t.ai.limitReached, lang));
      } else {
        setError(tr(t.ai.errorSend, lang));
      }
      console.error("Wiser AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); send(); }
  };

  const starters = trArr(t.ai.starters, lang);
  const isRTL = lang === 'ar';

  return (
    <div className="wise-conversation" dir={isRTL ? 'rtl' : 'ltr'}>
      {!controlled && (
        <header className="wise-conversation__topbar">
          <div className="wise-conversation__identity">
            <AiAvatar />
            <div>
              <strong>Wiser AI</strong>
              <span>{tr(t.ai.concierge, lang)}</span>
            </div>
          </div>
          <div className="wise-conversation__controls">
            <div className="wise-language-toggle" aria-label="Language selector">
              <button className={lang === "fr" ? "is-active" : ""} onClick={() => setLang("fr")} aria-label="French">FR</button>
              <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")} aria-label="English">EN</button>
              <button className={lang === "ar" ? "is-active" : ""} onClick={() => setLang("ar")} aria-label="Arabic" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{"\u0639\u0631"}</button>
            </div>
            <button className="wise-clear-btn" onClick={clearChat}>{tr(t.ai.clear, lang)}</button>
          </div>
        </header>
      )}

      <div ref={messagesRef} className="wise-conversation__messages">
        {messages.length === 0 && (
          <div className="wise-empty-chat">
            <AiAvatar />
            <p className="wise-empty-chat__eyebrow">{tr(t.ai.howHelp, lang)}</p>
            <h3>{tr(t.ai.askMenu, lang)}</h3>
            <p>{tr(t.ai.askMenuDesc, lang)}</p>

            {!API_KEY && (
              <p style={{ color: 'hsl(var(--destructive))', fontSize: '0.75rem', marginTop: '0.5rem', maxWidth: '20rem', textAlign: 'center' }}>
                {tr(t.ai.noKey, lang)}
              </p>
            )}

            <div className="wise-starter-grid">
              {starters.map((s) => (
                <button key={s} onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`wise-message-row ${m.role === "user" ? "wise-message-row--user" : "wise-message-row--assistant"}`}>
            {m.role !== "user" && <AiAvatar />}
            <div className={`wise-message-bubble ${m.role === "user" ? "wise-message-bubble--user" : "wise-message-bubble--assistant"}`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="wise-message-row wise-message-row--assistant">
            <AiAvatar />
            <div className="wise-message-bubble wise-message-bubble--assistant">
              <div className="wise-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
      </div>

      <div className="wise-conversation__status">
        {controlled && messages.length > 0 && (
          <button className="wise-clear-icon-btn" onClick={clearChat} title={tr(t.ai.clear, lang)}>
            <Trash2 size={13} />
          </button>
        )}
        {reachedLimit && countdown ? (
          <span>{tr(t.ai.availableIn, lang)} {countdown}</span>
        ) : error ? (
          <span style={{ color: 'hsl(var(--destructive))' }}>{error}</span>
        ) : (
          <span>{rateInfo.remaining} {tr(t.ai.remaining, lang)} {tr(t.ai.reset, lang)}</span>
        )}
      </div>

      <div className="wise-conversation__composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={tr(t.ai.placeholder, lang)}
          disabled={reachedLimit}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={isRTL ? { fontFamily: "'Noto Naskh Arabic', serif" } : {}}
        />
        <button onClick={send} disabled={loading || reachedLimit} aria-label="Send">
          {loading ? tr(t.ai.loading, lang) : reachedLimit ? tr(t.ai.limit, lang) : tr(t.ai.send, lang)}
        </button>
      </div>
    </div>
  );
}

