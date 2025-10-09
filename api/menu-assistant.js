const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

// Load menu from file system
function loadMenu() {
  try {
    const menuPath = path.join(__dirname, "../src/data/menu.json");
    const raw = fs.readFileSync(menuPath, "utf-8");
    const j = JSON.parse(raw);
    return j.menu || j;
  } catch (e) {
    console.warn("[menu] Could not load menu.json:", e.message);
    return null;
  }
}

function formatMenu(menu) {
  if (!menu || !Array.isArray(menu)) return "Menu not available.";
  const lines = [];
  for (const item of menu.slice(0, 200)) {
    const name = item.name?.trim() || "";
    const price = item.price ? ` — ${item.price}` : "";
    const desc = item.description ? ` — ${item.description}` : "";
    lines.push(`${name}${price}${desc}`);
  }
  return lines.join("\n");
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "invalid_input", message: "expected messages array in body" });
    }

    const menu = loadMenu();
    const menuText = formatMenu(menu);

    const systemMsg = {
      role: "system",
      content: `You are "Wiser", the friendly, helpful restaurant assistant for this website. Use the provided menu to answer user questions, recommend dishes, and explain ingredients or dietary suitability. Be warm, concise (1-3 short sentences) and personable. Do not invent menu items or prices. If the user asks about availability or real-time stock, advise them to contact the restaurant. Ask a single clarifying question if necessary.

Menu (name — price — description):
 ${menuText}`
    };

    const payload = {
      model: OPENROUTER_MODEL,
      messages: [systemMsg, ...messages],
      temperature: 0.7,
      max_tokens: 600
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[openrouter] error", response.status, text);
      return res.status(500).json({ error: "openrouter_error", status: response.status, body: text });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
    res.json({ reply, raw: data });
  } catch (err) {
    console.error("[proxy] uncaught error", err);
    res.status(500).json({ error: "server_error", message: err?.message || String(err) });
  }
};
