import React, { useState, useRef, useEffect } from "react";
import { askDeepSeek, DeepSeekMessage } from "../lib/deepseek";

const EN_SYSTEM = `You are Wiser AI — a playful, warm, and helpful restaurant assistant. Answer concisely (1-3 short sentences) unless asked for more. Use the provided menu to recommend dishes, explain ingredients/allergens, suggest pairings, and offer friendly alternatives. Never invent menu items or prices. If availability is uncertain, ask the user to contact the restaurant.`;

const FR_SYSTEM = `Vous êtes Wiser AI — un assistant chaleureux et ludique pour le restaurant. Répondez de manière concise (1-3 courtes phrases) sauf demande contraire. Utilisez le menu fourni pour recommander des plats, expliquer les ingrédients/allergènes, proposer des accords et offrir des alternatives amicales. N'inventez jamais des plats ou des prix. En cas d'incertitude sur la disponibilité, conseillez de contacter le restaurant.`;

export default function SimpleCopilotChat() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [messages, setMessages] = useState<DeepSeekMessage[]>([]); // only user & assistant stored here for UI
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // helper to build messages for API (prepend hidden system message)
  function buildApiMessages(additionalUser?: DeepSeekMessage) {
    const systemMsg: DeepSeekMessage = { role: "system", content: lang === "en" ? EN_SYSTEM : FR_SYSTEM };
    const uiMessages = [...messages];
    if (additionalUser) uiMessages.push(additionalUser);
    // API expects roles: user/assistant/system - we keep UI messages as-is
    return [systemMsg, ...uiMessages];
  }

  async function send() {
    if (!input.trim()) return;
    const userMsg: DeepSeekMessage = { role: "user", content: input.trim() };
    // update UI immediately (do not show system)
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await askDeepSeek(undefined, { messages: buildApiMessages(userMsg) });
      const assistantMsg: DeepSeekMessage = { role: "assistant", content: typeof reply === "string" ? reply : JSON.stringify(reply) };
      setMessages((m) => [...m, assistantMsg]);
      setTimeout(() => {
        messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    } catch (err: any) {
      setError(String(err?.message || err));
      setMessages((m) => [...m, { role: "assistant", content: lang === "en" ? "Oops — I couldn't reach the assistant. Try again." : "Oups — impossible de contacter l'assistant. Réessayez." }]);
    } finally {
      setLoading(false);
    }
  }

  // Allow pressing Enter to send
  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  // Simple clear conversation
  function clearChat() {
    setMessages([]);
    setError(null);
  }

  return (
    <div style={{width: 360, maxWidth: "100%", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", color: "#111827"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #eee", background: "linear-gradient(90deg,#fff7ed,#fff1f2)"}}>
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
          <div style={{fontSize: 18}}>🍽️</div>
          <div>
            <div style={{fontWeight: 700}}>Wiser AI</div>
            <div style={{fontSize: 12, color: "#6b7280"}}>{lang === "en" ? "Your friendly menu copilot" : "Votre copilote de menu"}</div>
          </div>
        </div>

        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <button onClick={() => setLang("en")} aria-label="English" title="English" style={{border: "none", background: lang==="en" ? "#ef4444" : "transparent", color: lang==="en" ? "#fff" : "#111827", padding: "6px 8px", borderRadius: 6, cursor: "pointer"}}>🇬🇧</button>
          <button onClick={() => setLang("fr")} aria-label="Français" title="Français" style={{border: "none", background: lang==="fr" ? "#ef4444" : "transparent", color: lang==="fr" ? "#fff" : "#111827", padding: "6px 8px", borderRadius: 6, cursor: "pointer"}}>🇫🇷</button>
          <button onClick={clearChat} title={lang==="en" ? "Clear" : "Effacer"} style={{border: "none", background: "transparent", color: "#6b7280", cursor: "pointer"}}>Clear</button>
        </div>
      </div>

      <div ref={messagesRef} style={{padding: 12, minHeight: 160, maxHeight: 340, overflow: "auto", background: "#fff", display: "flex", flexDirection: "column", gap: 10}}>
        {messages.map((m, i) => (
          <div key={i} style={{display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start"}}>
            <div style={{maxWidth: "78%", background: m.role === "user" ? "#111827" : "#fff7ed", color: m.role === "user" ? "#fff" : "#111827", padding: "8px 10px", borderRadius: 10, boxShadow: "0 6px 16px rgba(15,23,42,0.04)"}}>
              <div style={{fontSize: 13, whiteSpace: "pre-wrap"}}>{m.content}</div>
              <div style={{fontSize: 11, color: "#6b7280", marginTop: 6, textAlign: "right"}}>{m.role === "user" ? "" : "Wiser AI"}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee", background: "#fff"}}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder={lang==="en" ? "Ask about the menu or ask for recommendations..." : "Demandez au sujet du menu ou demandez des recommandations..."} style={{flex:1, padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e6e6"}} />
        <button onClick={send} disabled={loading} style={{padding: "10px 12px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer"}}>{loading ? (lang==="en" ? "…" : "…") : (lang==="en" ? "Send" : "Envoyer")}</button>
      </div>

      {error && <div style={{padding: 8, color: "red", fontSize: 13}}>{error}</div>}
      <div style={{padding: 8, fontSize: 12, color: "#9ca3af"}}>{lang==="en" ? "Wiser AI uses the restaurant menu to answer — it won't invent items." : "Wiser AI utilise le menu du restaurant pour répondre — il n'invente pas de plats."}</div>
    </div>
  );
}
