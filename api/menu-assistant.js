import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

// Fallback menu data - EMBEDDED DIRECTLY IN THE CODE
const FALLBACK_MENU = [
  { name: "Margherita", price: "$12.99", description: "Classic tomato sauce and mozzarella" },
  { name: "Tuna", price: "$14.99", description: "Tuna, tomatoes, onions, olives, tomato sauce, mozzarella" },
  { name: "Vegetarien", price: "$13.99", description: "Mushrooms, peppers, onions, olives, fresh tomatoes, tomato sauce, mozzarella" },
  { name: "Queen", price: "$15.99", description: "Turkey ham, mushrooms, mozzarella, tomato sauce" },
  { name: "Orientale", price: "$16.99", description: "Merguez, peppers, onions, mushrooms, fresh tomatoes, tomato sauce, mozzarella" },
  { name: "Pepperoni", price: "$14.99", description: "Pepperoni, onions, tomato sauce, mozzarella" },
  { name: "Chicken Supreme", price: "$16.99", description: "Chicken, mushrooms, peppers, tomato sauce, mozzarella" },
  { name: "Regina", price: "$15.99", description: "Tomato sauce, mozzarella, cheese, white sauce" },
  { name: "Chicken Grilli", price: "$16.99", description: "Turkey ham, mushrooms, onions, olives, tomato sauce, mozzarella" },
  { name: "Mexicain", price: "$17.99", description: "Spicy chicken, peppers, onions, tomatoes, tomato sauce, mozzarella" },
  { name: "Kentucky", price: "$17.99", description: "Fried chicken, corn, peppers, tomato sauce, mozzarella" },
  { name: "Norwegian", price: "$18.99", description: "Salmon, shrimp, mozzarella, dill sauce" },
  { name: "Sea Food", price: "$19.99", description: "Mixed seafood, garlic, white sauce, mozzarella" },
  { name: "Newton", price: "$16.99", description: "Turkey ham, mushrooms, artichokes, tomato sauce, mozzarella" },
  { name: "Einstein", price: "$17.99", description: "Turkey ham, mushrooms, eggs, tomato sauce, mozzarella" },
  { name: "Barlow", price: "$16.99", description: "Turkey ham, bacon, mushrooms, tomato sauce, mozzarella" },
  { name: "Millikan", price: "$17.99", description: "Turkey ham, pineapple, peppers, tomato sauce, mozzarella" },
  { name: "Ampere", price: "$16.99", description: "Turkey ham, peppers, onions, tomato sauce, mozzarella" },
  { name: "Gauss", price: "$17.99", description: "Turkey ham, mushrooms, olives, tomato sauce, mozzarella" },
  { name: "John Locke", price: "$18.99", description: "Turkey ham, bacon, eggs, tomato sauce, mozzarella" },
  { name: "Pesto", price: "$15.99", description: "Pesto sauce, mozzarella, cherry tomatoes" },
  { name: "Chicken Spicy", price: "$17.99", description: "Spicy chicken, peppers, onions, tomato sauce, mozzarella" },
  { name: "Carnot", price: "$16.99", description: "Turkey ham, mushrooms, cheese, tomato sauce, mozzarella" },
  { name: "Mariotte", price: "$17.99", description: "Turkey ham, peppers, cheese, tomato sauce, mozzarella" },
  { name: "Kepler", price: "$16.99", description: "Turkey ham, pineapple, corn, tomato sauce, mozzarella" },
  { name: "Van der waals", price: "$17.99", description: "Turkey ham, mushrooms, peppers, cheese, tomato sauce, mozzarella" },
  { name: "Tesla", price: "$18.99", description: "Turkey ham, bacon, peppers, mushrooms, tomato sauce, mozzarella" },
  { name: "The Wise", price: "$19.99", description: "Special pizza with all premium toppings" },
  { name: "Menu Enfants", price: "$10.99", description: "Small pizza with simple toppings, drink, and dessert" }
];

// Load menu from file system
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
          console.log("[menu] Raw menu data:", data.substring(0, 200)); // Log first 200 chars
          const parsedData = JSON.parse(data);
          console.log("[menu] Parsed menu data type:", typeof parsedData);
          console.log("[menu] Parsed menu data:", JSON.stringify(parsedData).substring(0, 200));
          return parsedData;
        }
      } catch (e) {
        console.log("[menu] Failed to read from:", menuPath, e.message);
      }
    }
    
    console.warn("[menu] Could not find menu.json in any location, using fallback menu");
    return { menu: FALLBACK_MENU };
  } catch (e) {
    console.error("[menu] Error loading menu:", e.message);
    return { menu: FALLBACK_MENU };
  }
}

// Format menu into readable text for the AI
function formatMenu(menu) {
  console.log("[format] Input menu type:", typeof menu);
  console.log("[format] Input menu:", JSON.stringify(menu).substring(0, 200));
  
  let menuItems = [];
  
  if (Array.isArray(menu)) {
    menuItems = menu;
  } else if (menu && typeof menu === 'object') {
    if (menu.menu && Array.isArray(menu.menu)) {
      menuItems = menu.menu;
    } else {
      // Try to get all array properties
      for (const key in menu) {
        if (Array.isArray(menu[key])) {
          menuItems = menuItems.concat(menu[key]);
        }
      }
    }
  }
  
  console.log("[format] Extracted menu items count:", menuItems.length);
  
  if (menuItems.length === 0) {
    console.log("[format] No menu items found, using fallback");
    menuItems = FALLBACK_MENU;
  }
  
  const lines = [];
  for (const item of menuItems.slice(0, 200)) {
    const name = item.name?.trim() || "";
    const price = item.price ? ` — ${item.price}` : "";
    const desc = item.description ? ` — ${item.description}` : "";
    lines.push(`${name}${price}${desc}`);
  }
  
  const result = lines.join("\n");
  console.log("[format] Formatted menu length:", result.length);
  console.log("[format] Formatted menu preview:", result.substring(0, 200));
  return result;
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
