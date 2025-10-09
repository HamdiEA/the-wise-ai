import React, { useState } from "react";
import SimpleCopilotChat from "./SimpleCopilotChat";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bubble button */}
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
            background: "linear-gradient(135deg,#f97316,#ef4444)",
            color: "#fff",
            border: "none",
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          🤖
        </button>
      </div>

      {/* Modal overlay */}
      {open && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 9998,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: 20,
        }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: 360,
            maxWidth: "100%",
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            background: "#fff",
            overflow: "hidden",
          }}>
            <div style={{padding: 12, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <strong>Wiser — Restaurant Assistant</strong>
              <button onClick={() => setOpen(false)} style={{border: "none", background: "transparent", cursor: "pointer"}}>✕</button>
            </div>
            <div style={{padding: 12}}>
              <SimpleCopilotChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}