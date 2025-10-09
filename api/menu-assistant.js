import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

// Load menu from file system - FIXED FOR VERCEL
async function loadMenu() {
  try {
    // Try multiple possible paths for Vercel deployment
    const possiblePaths = [
      path.join(__dirname, "menu.json"), // In same directory as API
      path.join(__dirname, "../public/menu.json"), // In public folder
      path.join(__dirname, "../src/data/menu.json"), // Original location
      path.join(process.cwd(), "public/menu.json"), // From project root
      path.join(process.cwd(), "src/data/menu.json") // From project root
    ];

    for (const menuPath of possiblePaths) {
      try {
        if (fs.existsSync(menuPath)) {
          console.log("[menu] Found menu at:", menuPath);
          const data = fs.readFileSync(menuPath, "utf8");
          return JSON.parse(data);
        }
      } catch (e) {
        console.log("[menu] Failed to read from:", menuPath, e.message);
      }
    }
    
    console.error("[menu] Could not find menu.json in any location");
    return null;
  } catch (e) {
    console.error("[menu] Error loading menu:", e.message);
    return null;
  }
}

// Format menu into readable text for the AI
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

// Main serverless function
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "invalid_input", message: "expected messages array" });
    }

    // Load and format menu
    const menu = await loadMenu();
    const menuText = formatMenu(menu);
    
    // DEBUG: Log menu status
    console.log("[debug] Menu loaded:", menu ? "Success" : "Failed");
    console.log("[debug] Menu text length:", menuText.length);

    const systemMsg = {
      role: "system",
      content: `You are "Wiser", the friendly, helpful restaurant assistant for this website. 
Use the provided menu to answer user questions, recommend dishes, and explain ingredients or dietary suitability. 
Be warm, concise (1–3 short sentences), and personable. 
Do not invent menu items or prices. 
If the user asks about availability or real-time stock, advise them to contact the restaurant. 
Ask a clarifying question if needed.

Menu (name — price — description):
 ${menuText}`,
    };

    // DEBUG: Log system prompt
    console.log("[debug] System prompt length:", systemMsg.content.length);

    const payload = {
      model: OPENROUTER_MODEL,
      messages: [systemMsg, ...messages],
      temperature: 0.7,
      max_tokens: 600,
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[openrouter] error", response.status, text);
      return res
        .status(500)
        .json({ error: "openrouter_error", status: response.status, body: text });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
    res.json({ reply, raw: data });
  } catch (err) {
    console.error("[proxy] uncaught error", err);
    res
      .status(500)
      .json({ error: "server_error", message: err?.message || String(err) });
  }
}
