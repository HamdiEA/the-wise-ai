// CommonJS proxy for OpenRouter menu assistant
const express = require("express");
const fetch = (...args) =>
    import ("node-fetch").then(({ default: fetch }) => fetch(...args));
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

if (!OPENROUTER_KEY) {
    console.warn("[warning] OPENROUTER_API_KEY not set in .env — the proxy will fail until you set it.");
}

/**
 * Recursively extracts all items from menu.json with bilingual support
 */
function loadMenu() {
    try {
        const menuPath = path.join(__dirname, "..", "src", "data", "menu.json");
        const raw = fs.readFileSync(menuPath, "utf-8");
        const data = JSON.parse(raw);

        const items = [];
        const currentCategory = { fr: "", en: "" };

        function extract(obj, category = { fr: "", en: "" }) {
            if (Array.isArray(obj)) {
                obj.forEach(o => extract(o, category));
            } else if (obj && typeof obj === "object") {
                // Update current category if this is a category object
                if (obj.name_fr && obj.name_en && obj.items) {
                    currentCategory.fr = obj.name_fr;
                    currentCategory.en = obj.name_en;
                    category = { fr: obj.name_fr, en: obj.name_en };
                }

                // If this is a menu item, add it to the list
                if (obj.name_fr && obj.name_en) {
                    items.push({
                        name_fr: String(obj.name_fr).trim(),
                        name_en: String(obj.name_en).trim(),
                        price: obj.price ? String(obj.price).trim() : "",
                        description_fr: obj.description_fr ? String(obj.description_fr).trim() : "",
                        description_en: obj.description_en ? String(obj.description_en).trim() : "",
                        type_fr: obj.type_fr ? String(obj.type_fr).trim() : "",
                        type_en: obj.type_en ? String(obj.type_en).trim() : "",
                        category_fr: category.fr,
                        category_en: category.en,
                        details_fr: obj.details_fr ? String(obj.details_fr).trim() : "",
                        details_en: obj.details_en ? String(obj.details_en).trim() : ""
                    });
                }

                // Recursively process child objects
                for (const key of Object.keys(obj)) {
                    if (["items", "children", "menu", "sections", "products"].includes(key.toLowerCase())) {
                        extract(obj[key], category);
                    }
                }
            }
        }

        extract(data);

        // Remove duplicates
        const seen = new Set();
        const deduped = [];
        for (const it of items) {
            const key = `${it.name_fr.toLowerCase()}|${it.name_en.toLowerCase()}|${it.price}`;
            if (!seen.has(key)) {
                seen.add(key);
                deduped.push(it);
            }
        }

        return deduped;
    } catch (e) {
        console.warn("[menu] Could not load/parse menu.json:", e.message);
        return [];
    }
}

/**
 * Format menu to a string that the model can understand with bilingual support
 */
function formatMenu(menuItems, options = {}) {
    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) return "Menu not available.";
    const lines = [];
    for (const it of menuItems) {
        const cat = options.includeCategory && it.category_fr ? `${it.category_fr} / ${it.category_en}: ` : "";
        const name = `${it.name_fr} / ${it.name_en}`;
        const price = it.price ? ` — ${it.price}` : " — price unknown";
        const desc = (it.description_fr || it.description_en) ? ` — ${it.description_fr || it.description_en}` : "";
        const details = (it.details_fr || it.details_en) ? ` — ${it.details_fr || it.details_en}` : "";
        lines.push(`${cat}${name}${price}${desc}${details}`);
    }
    return lines.join("\n");
}

/**
 * Retrieves relevant menu items for the last user query with bilingual support
 */
function retrieveRelevantMenu(menuItems, userText, maxResults = 40) {
    if (!userText || !menuItems || menuItems.length === 0) return [];
    const text = userText.toLowerCase();
    const tokens = text.split(/\W+/).filter(Boolean);

    // Enhanced triggers for children's menu in both languages
    const genericTriggers = [
        "recommend", "suggest", "menu", "best", "what",
        "enfant", "child", "children", "kids",
        "menu enfant", "children's menu", "kids menu",
        "prix", "price", "coût", "cost"
    ];

    if (genericTriggers.some(t => text.includes(t))) {
        return menuItems.slice(0, maxResults);
    }

    const scored = menuItems
        .map((it, idx) => {
            // Search in both French and English fields
            const hay = `${it.name_fr} ${it.name_en} ${it.description_fr} ${it.description_en} ${it.details_fr} ${it.details_en} ${it.category_fr} ${it.category_en} ${it.type_fr} ${it.type_en}`.toLowerCase();
            let score = 0;
            for (const tk of tokens) {
                if (tk.length < 2) continue;
                if (hay.includes(tk)) score += 2;
                if (hay.includes(tk + "s")) score += 1;
            }
            return { it, score, idx };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || a.idx - b.idx)
        .slice(0, maxResults)
        .map(x => x.it);

    return scored;
}

/**
 * Validates that a recommended item exists in the menu
 */
function validateMenuItem(menuItems, itemName) {
    if (!itemName || !menuItems || menuItems.length === 0) return false;

    const normalizedName = itemName.toLowerCase().trim();

    // Check both French and English names
    return menuItems.some(item =>
        item.name_fr.toLowerCase().includes(normalizedName) ||
        item.name_en.toLowerCase().includes(normalizedName)
    );
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/menu-assistant", async(req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "invalid_input", message: "expected messages array in body" });
        }

        const menuAll = loadMenu();
        const lastUser = [...messages].reverse().find(m => m.role === "user");
        const userText = lastUser ? String(lastUser.content || "") : "";
        const relevant = retrieveRelevantMenu(menuAll, userText);
        const menuToSend = relevant.length > 0 ? relevant : menuAll.slice(0, 200);
        const menuText = formatMenu(menuToSend, { includeCategory: true });

        console.log("[menu] total=%d sent=%d", menuAll.length, menuToSend.length);

        const systemMsg = {
            role: "system",
            content: `
You are "Wiser AI", a warm, playful restaurant assistant. You speak English 🇬🇧 or French 🇫🇷 depending on the user's message. 

IMPORTANT MESSAGE LIMITS:
Each user gets 5 free messages every 12 hours. If someone is close to their limit, gently remind them:
- French: "Il vous reste [X] messages sur 5 (réinitialisation dans 12h)"
- English: "You have [X] messages remaining out of 5 (resets in 12 hours)"

MENU RECOMMENDATIONS:
You must ONLY recommend items that are explicitly listed in the menu provided below. Never invent or suggest items that are not in the menu.

If a user asks for something not in the menu (like "Ciabatta The Wise"), you must respond with:
"Je crains qu'il n'y ait pas de [requested item] sur notre menu. Peut-être pourrions-nous vous recommander [alternative item] comme alternative?" in French or
"I'm afraid we don't have [requested item] on our menu. Perhaps we could recommend [alternative item] as an alternative?" in English.

Always quote **exact prices** when available. If the price is missing, say "price unknown" and suggest contacting the restaurant.

Keep answers short, clear, and friendly.

Menu:
 ${menuText}
`
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
                Authorization: "Bearer " + OPENROUTER_KEY,
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
        let reply =
            (data &&
                data.choices &&
                data.choices[0] &&
                ((data.choices[0].message && data.choices[0].message.content) || data.choices[0].text)) ||
            "";

        // Post-process the reply to ensure it only contains valid menu items
        if (reply) {
            const replyLines = reply.split('\n');
            const processedLines = replyLines.map(line => {
                // Check if the line contains a potential menu item recommendation
                const itemMatch = line.match(/(recommander|recommend|suggérer|suggest)\s+(.+?)(?:\s+comme\s+alternative|as\s+an\s+alternative)?/i);
                if (itemMatch) {
                    const itemName = itemMatch[2].trim();
                    // Validate that the item exists in the menu
                    if (!validateMenuItem(menuAll, itemName)) {
                        // If the item doesn't exist, replace the recommendation with a generic one
                        const genericItem = menuAll.find(item =>
                            item.category_fr.toLowerCase().includes('sandwich') ||
                            item.category_en.toLowerCase().includes('sandwich')
                        );
                        if (genericItem) {
                            return line.replace(itemName, `${genericItem.name_fr} / ${genericItem.name_en}`);
                        }
                    }
                }
                return line;
            });
            reply = processedLines.join('\n');
        }

        res.json({ reply, raw: data });
    } catch (err) {
        console.error("[proxy] uncaught error", err);
        res.status(500).json({ error: "server_error", message: err && err.message || String(err) });
    }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log("✅ Menu assistant proxy running on http://localhost:" + PORT));

module.exports = app;