import React, { useState, useRef, useEffect } from "react";
import { askDeepSeek, DeepSeekMessage } from "../lib/deepseek";
import logo from "@/assets/wise-logo.png";

const EN_SYSTEM = `You are Wiser AI — a helpful and warm restaurant assistant. Answer concisely (1-3 short sentences) unless asked for more. 

You have access to:
- Complete menu with all dishes, prices, ingredients and allergens
- Restaurant hours: All locations open Mon-Sun 12:00 PM - 12:00 AM
- Three locations: Bardo Tunis (phone: 52 555 414), Teboulba (phone: 93 560 560), Ksar Hellal Monastir (phone: 52 555 400)

Use this information to: recommend dishes based on preferences, explain ingredients/allergens, suggest pairings, and offer alternatives. Never invent menu items or prices. For reservations or special requests, direct customers to call the restaurant.`;

const FR_SYSTEM = `Vous êtes Wiser AI — un assistant chaleureux et utile pour le restaurant. Répondez de manière concise (1-3 courtes phrases) sauf demande contraire.

Vous avez accès à:
- Menu complet avec tous les plats, prix, ingrédients et allergènes
- Horaires du restaurant: Tous les emplacements ouverts Lun-Dim 12h00 - 00h00
- Trois emplacements: Bardo Tunis (tél: 52 555 414), Teboulba (tél: 93 560 560), Ksar Hellal Monastir (tél: 52 555 400)

Utilisez cette information pour: recommander des plats selon les préférences, expliquer les ingrédients/allergènes, proposer des accords, et offrir des alternatives. N'inventez jamais des plats ou des prix. Pour les réservations ou demandes spéciales, dirigez les clients à appeler le restaurant.`;

export default function SimpleCopilotChat() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [messages, setMessages] = useState<DeepSeekMessage[]>([]); // only user & assistant stored here for UI
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const reachedLimit = userCount >= 5;

  // Always keep scroll at the bottom after new messages
  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messages]);

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
    if (reachedLimit) {
      setError(lang === "en" ? "You reached the 5-message limit." : "Limite de 5 messages atteinte.");
      return;
    }
    const userMsg: DeepSeekMessage = { role: "user", content: input.trim() };
    // update UI immediately (do not show system)
    setMessages((m) => [...m, userMsg]);
    setUserCount((c) => c + 1);
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
    setUserCount(0);
  }

  return (
    <div className="chat-root" style={{width: "100%", height: "100%", fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif", background: "transparent", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "none", borderRadius: 0}}>
      
      {/* Header */}
      <div style={{padding: "14px 16px", borderBottom: "1px solid rgba(251, 146, 60, 0.2)", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0}}>
        <div style={{display: "flex", gap: 12, alignItems: "center", flex: 1}}>
          <img 
            src={logo} 
            alt="Wiser AI" 
            style={{
              width: 32, 
              height: 32, 
              borderRadius: "50%", 
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(251, 146, 60, 0.3)"
            }} 
          />
          <div>
            <div style={{fontWeight: 700, fontSize: 15, color: "#fbbf24", letterSpacing: "-0.3px"}}>Wiser AI</div>
            <div style={{fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2}}>{lang === "en" ? "Menu Assistant" : "Assistant Menu"}</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <div style={{display: "flex", background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "4px", gap: 2}}>
            <button onClick={() => setLang("en")} aria-label="English" style={{border: "none", background: lang==="en" ? "rgba(251, 146, 60, 0.5)" : "transparent", color: "#fff", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: lang==="en" ? 600 : 400, transition: "all 0.2s"}}>EN</button>
            <button onClick={() => setLang("fr")} aria-label="Français" style={{border: "none", background: lang==="fr" ? "rgba(251, 146, 60, 0.5)" : "transparent", color: "#fff", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: lang==="fr" ? 600 : 400, transition: "all 0.2s"}}>FR</button>
          </div>
          <button onClick={clearChat} title={lang==="en" ? "Clear" : "Effacer"} style={{border: "none", background: "rgba(251, 146, 60, 0.3)", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, transition: "all 0.2s", hover: {background: "rgba(251, 146, 60, 0.5)"}}}>{lang==="en" ? "Clear" : "Effacer"}</button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesRef} style={{flex: 1, padding: "14px", overflow: "auto", display: "flex", flexDirection: "column", gap: 10, background: "rgba(0,0,0,0.15)", minHeight: 0}}>
        {messages.length === 0 && (
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12}}>
            <div style={{fontSize: 40, opacity: 0.6}}>💬</div>
            <div style={{color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", lineHeight: 1.5, padding: "0 16px", maxWidth: "90%"}}>
              {lang === "en" ? "Start chatting! Ask about our menu, get recommendations, or ask any questions." : "Commencez ! Posez des questions sur notre menu ou demandez des recommandations."}
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} style={{display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, animation: "slideIn 0.3s ease-out"}}>
            <div style={{
              maxWidth: "78%",
              padding: "10px 14px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: m.role === "user" 
                ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)" 
                : "rgba(0,0,0,0.5)",
              color: "#fff",
              border: m.role === "user" 
                ? "1px solid rgba(251, 146, 60, 0.4)"
                : "1px solid rgba(251, 146, 60, 0.15)",
              boxShadow: m.role === "user" 
                ? "0 4px 12px rgba(217, 119, 6, 0.2)"
                : "0 2px 8px rgba(0, 0, 0, 0.3)"
            }}>
              {m.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{display: "flex", alignItems: "flex-end", gap: 8}}>
            <div style={{padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(251, 146, 60, 0.15)", display: "flex", gap: 6, alignItems: "center"}}>
              <div style={{fontSize: 12, color: "#fbbf24"}}>⚙️</div>
              <div style={{fontSize: 13, color: "rgba(255,255,255,0.7)"}}>{lang === "en" ? "Thinking..." : "Réflexion..."}</div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{padding: "12px 14px", borderTop: "1px solid rgba(251, 146, 60, 0.15)", background: "rgba(0,0,0,0.2)", display: "flex", gap: 8, flexShrink: 0}}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={onKey} 
          placeholder={lang==="en" ? "Ask about menu..." : "Demandez au sujet du menu..."} 
          style={{
            flex: 1, 
            padding: "10px 14px", 
            borderRadius: 10, 
            border: "1px solid rgba(251, 146, 60, 0.3)",
            background: "rgba(0,0,0,0.4)",
            color: "#fff",
            fontSize: 13,
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box"
          }} 
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(251, 146, 60, 0.6)";
            e.currentTarget.style.background = "rgba(0,0,0,0.6)";
          }} 
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(251, 146, 60, 0.3)";
            e.currentTarget.style.background = "rgba(0,0,0,0.4)";
          }} 
        />
        <button 
          onClick={send} 
          disabled={loading || reachedLimit} 
          style={{
            padding: "10px 16px", 
            borderRadius: 10, 
            border: "1px solid rgba(251, 146, 60, 0.5)",
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            color: "#fff",
            cursor: loading || reachedLimit ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: loading || reachedLimit ? 0.6 : 1,
            transition: "all 0.2s",
            hover: !loading ? {boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)"} : {}
          }}
        >
          {loading ? "⏳" : reachedLimit ? (lang === "en" ? "Limit" : "Limite") : "→"}
        </button>
      </div>

      {/* Error or Footer */}
      {error ? (
        <div style={{padding: "10px 14px", fontSize: 12, color: "#fb923c", background: "rgba(251, 146, 60, 0.15)", border: "1px solid rgba(251, 146, 60, 0.3)", borderRadius: 0, textAlign: "center", flexShrink: 0}}>
          {error}
        </div>
      ) : (
        <div style={{padding: "8px 14px", fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(251, 146, 60, 0.1)", flexShrink: 0}}>
          {lang === "en" ? "The Wise Menu" : "Menu The Wise"} {`· ${5 - userCount >= 0 ? 5 - userCount : 0}`} {lang === "en" ? "messages left" : "messages restantes"}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 640px) {
          .chat-root {
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
