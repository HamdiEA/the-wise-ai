import React, { useState } from "react";
import SimpleCopilotChat from "./SimpleCopilotChat";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bubble button - Hidden when chatbot is open */}
      {!open && (
        <div style={{
          position: "fixed",
          right: 20,
          bottom: 24,
          zIndex: 9999,
        }}>
          <button
            aria-label="Open assistant"
            onClick={() => setOpen(true)}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              color: "#fff",
              border: "1px solid rgba(251, 146, 60, 0.5)",
              boxShadow: "0 8px 32px rgba(217, 119, 6, 0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.5px",
              fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #ea8c1a 0%, #c26812 100%)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(217, 119, 6, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #d97706 0%, #b45309 100%)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(217, 119, 6, 0.3)";
            }}
          >
            AI
          </button>
        </div>
      )}

      {/* Modal overlay */}
      {open && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "20px",
        }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            background: "rgba(0, 0, 0, 0.7)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "85vh",
          }}>
            <div style={{padding: "14px 16px", borderBottom: "1px solid rgba(251, 146, 60, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.5)"}}>
              <strong style={{color: "#fbbf24", fontSize: "14px"}}>Wiser AI — Assistant</strong>
              <button onClick={() => setOpen(false)} style={{border: "none", background: "transparent", cursor: "pointer", color: "#fff", fontSize: "20px", padding: "0 8px"}}>✕</button>
            </div>
            <div style={{flex: 1, overflow: "hidden"}}>
              <SimpleCopilotChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
