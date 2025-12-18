import React, { useState, useRef, useEffect } from "react";
import { askDeepSeek, DeepSeekMessage, getAuthToken, TokenInfo } from "../lib/deepseek";
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
  const [messages, setMessages] = useState<DeepSeekMessage[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [countdown, setCountdown] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Calculate derived states early
  const reachedLimit = tokenInfo ? tokenInfo.messagesUsed >= tokenInfo.messagesLimit : false;
  const messagesRemaining = tokenInfo ? tokenInfo.messagesLimit - tokenInfo.messagesUsed : 5;

  // Initialize JWT token on mount
  useEffect(() => {
    const initToken = async () => {
      try {
        const saved = localStorage.getItem("chatToken");
        const info = await getAuthToken(saved || undefined);
        setTokenInfo(info);
        localStorage.setItem("chatToken", info.token);
        setError(null); // Clear any initialization errors
        
        // If limit is reached, start countdown based on server's resetAt time
        if (info.messagesUsed >= info.messagesLimit && info.resetAt) {
          setCountdown("active");
        } else {
          // Limit not reached, clear any stored limit time
          localStorage.removeItem("limitReachedTime");
          setCountdown(null);
        }
      } catch (err) {
        console.error("Failed to initialize token:", err);
        // Don't set an error here - let the user try to send a message first
        // The fallback will handle it
        setTokenInfo({
          token: 'local-fallback-token',
          messagesUsed: 0,
          messagesLimit: 5,
          resetAt: Math.floor(Date.now() / 1000) + (12 * 60 * 60)
        });
      } finally {
        setTokenLoading(false);
      }
    };
    initToken();
  }, []);

  // Auto-start countdown on mount if limit was reached before
  useEffect(() => {
    if (tokenInfo && reachedLimit && tokenInfo.resetAt) {
      setCountdown("active");
    }
  }, [tokenInfo?.resetAt, reachedLimit]);

  // Countdown timer effect - triggers when limit is reached
  useEffect(() => {
    // Only run if we have a valid resetAt time and limit is reached
    if (!tokenInfo?.resetAt || !reachedLimit) {
      return;
    }
    
    // Set up countdown update function
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = tokenInfo.resetAt - now;
      
      if (remaining <= 0) {
        setCountdown(null);
        localStorage.removeItem("limitReachedTime");
        // Reset token automatically
        getAuthToken().then(info => {
          setTokenInfo(info);
          localStorage.setItem("chatToken", info.token);
          setError(lang === "en" 
            ? "Message limit reset! You can send messages again." 
            : "Limite de messages réinitialisée ! Vous pouvez renvoyer des messages.");
        });
        return;
      }
      
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = Math.floor(remaining % 60);
      
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };
    
    // Update immediately on mount
    updateCountdown();
    
    // Then update every second
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [reachedLimit, tokenInfo?.resetAt, lang])

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Always keep scroll at the bottom after new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
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
      setError(lang === "en" 
        ? "You reached the limit of 5 messages. Resets in 12 hours." 
        : "Vous avez atteint la limite de 5 messages. Réinitialisation dans 12h.");
      return;
    }
    if (!tokenInfo) {
      setError(lang === "en" ? "Session not initialized" : "Session non initialisée");
      return;
    }

    const userMsg: DeepSeekMessage = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await askDeepSeek(undefined, { 
        messages: buildApiMessages(userMsg),
        token: tokenInfo.token
      });
      
      // Update token info with new count
      setTokenInfo(result.tokenInfo);
      console.log('TokenInfo updated:', { messagesUsed: result.tokenInfo.messagesUsed, limit: result.tokenInfo.messagesLimit, reachedLimit: result.tokenInfo.messagesUsed >= result.tokenInfo.messagesLimit });
      localStorage.setItem("chatToken", result.tokenInfo.token);
      console.log("Message sent, token updated:", { messagesUsed: result.tokenInfo.messagesUsed, limit: result.tokenInfo.messagesLimit });
      
      // If we just reached the limit, the useEffect will trigger countdown automatically
      const assistantMsg: DeepSeekMessage = { 
        role: "assistant", 
        content: typeof result.reply === "string" ? result.reply : JSON.stringify(result.reply) 
      };
      setMessages((m) => [...m, assistantMsg]);
      
      setTimeout(() => {
        messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    } catch (err: any) {
      const errorMsg = String(err?.message || err);
      
      // Handle token expiration
      if (errorMsg.includes("expired") || errorMsg.includes("Token expired")) {
        try {
          const newInfo = await getAuthToken();
          setTokenInfo(newInfo);
          localStorage.setItem("chatToken", newInfo.token);
          setError(lang === "en" 
            ? "Session refreshed. Your message limit has been reset!" 
            : "Session actualisée. Votre limite de messages a été réinitialisée!");
        } catch {
          setError(lang === "en" 
            ? "Session expired. Please refresh the page." 
            : "Session expirée. Veuillez actualiser la page.");
        }
      } else if (errorMsg.includes("limit")) {
        // Limit reached - update tokenInfo to trigger countdown
        setTokenInfo(prev => prev ? { ...prev, messagesUsed: prev.messagesLimit } : null);
        setError(lang === "en" 
          ? "You've reached your 5 message limit. Resets in 12 hours." 
          : "Limite de 5 messages atteinte. Réinitialisation dans 12h.");
      } else {
        setError(errorMsg);
        setMessages((m) => [...m, { 
          role: "assistant", 
          content: lang === "en" 
            ? "Oops — I couldn't reach the assistant. Try again." 
            : "Oups — impossible de contacter l'assistant. Réessayez." 
        }]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Allow pressing Enter to send
  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  // Simple clear conversation - only clears messages, preserves rate limit and countdown
  function clearChat() {
    setMessages([]);
    setError(null);
    localStorage.removeItem("chatMessages");
  }

  return (
    <div className="chat-root" style={{width: "100%", height: "100%", maxHeight: "100vh", fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif", background: "transparent", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "none", borderRadius: 0, position: "relative"}}>
      
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

      {/* Scrollable Content Area (Messages + Input) - Instagram Style */}
      <div style={{flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden"}}>
        
        {/* Messages Area - Scrollable */}
        <div ref={messagesRef} style={{flex: 1, padding: "14px 14px 20px 14px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: 10, background: "rgba(0,0,0,0.15)", minHeight: 0, maxHeight: "100%", WebkitOverflowScrolling: "touch", wordBreak: "break-word"}}>
          {messages.length === 0 && (
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12}}>
              <div style={{fontSize: 40, opacity: 0.6}}>💬</div>
              <div style={{color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", lineHeight: 1.5, padding: "0 16px", maxWidth: "90%"}}>
                {lang === "en" ? "Start chatting! Ask about our menu, get recommendations, or ask any questions." : "Commencez ! Posez des questions sur notre menu ou demandez des recommandations."}
              </div>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} style={{display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, animation: "slideIn 0.3s ease-out", overflow: "hidden"}}>
              <div style={{
                maxWidth: "78%",
                padding: "10px 14px",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 13,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
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

        {/* Error/Countdown/Status Footer - Inside scrollable area */}
        <div style={{flexShrink: 0, display: "flex", flexDirection: "column"}}>
          {reachedLimit && countdown ? (
            <div style={{padding: "10px 14px", fontSize: 12, color: "#fbbf24", background: "rgba(217, 119, 6, 0.2)", border: "1px solid rgba(251, 146, 60, 0.3)", borderRadius: 0, textAlign: "center"}}>
              <div style={{fontWeight: 500}}>Available in {countdown}</div>
            </div>
          ) : error ? (
            <div style={{padding: "10px 14px", fontSize: 12, color: "#fb923c", background: "rgba(251, 146, 60, 0.15)", border: "1px solid rgba(251, 146, 60, 0.3)", borderRadius: 0, textAlign: "center"}}>
              {error}
            </div>
          ) : tokenLoading ? (
            <div style={{padding: "10px 14px", fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(251, 146, 60, 0.1)"}}>
              {lang === "en" ? "Initializing..." : "Initialisation..."}
            </div>
          ) : (
            <div style={{padding: "10px 14px", fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(251, 146, 60, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>
                {lang === "en" ? "The Wise Menu" : "Menu The Wise"} {`· ${messagesRemaining}`} {lang === "en" ? "messages left (12h reset)" : "messages restantes (réinit 12h)"}
              </span>
              <button
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem("chatMessages");
                }}
                style={{
                  padding: "4px 8px",
                  fontSize: 9,
                  background: "rgba(251, 146, 60, 0.2)",
                  border: "1px solid rgba(251, 146, 60, 0.3)",
                  borderRadius: 4,
                  color: "rgba(251, 146, 60, 0.8)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(251, 146, 60, 0.3)";
                  e.currentTarget.style.color = "rgba(251, 146, 60, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(251, 146, 60, 0.2)";
                  e.currentTarget.style.color = "rgba(251, 146, 60, 0.8)";
                }}
              >
                {lang === "en" ? "Clear" : "Effacer"}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Input Area - Fixed at bottom */}
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
