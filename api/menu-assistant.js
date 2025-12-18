const fs = require('fs');
const path = require('path');

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';

// Load menu from file system
async function loadMenu() {
    try {
        // Try multiple possible paths for Vercel deployment
        const possiblePaths = [
            path.join(__dirname, 'menu.json'), // In same directory as API
            path.join(__dirname, '../public/menu.json'), // In public folder
            path.join(__dirname, '../src/data/menu.json'), // Original location
            path.join(process.cwd(), 'public/menu.json'), // From project root
            path.join(process.cwd(), 'src/data/menu.json') // From project root
        ];

        for (const menuPath of possiblePaths) {
            try {
                if (fs.existsSync(menuPath)) {
                    console.log('[menu] Found menu at:', menuPath);
                    const data = fs.readFileSync(menuPath, 'utf8');
                    return JSON.parse(data);
                }
            } catch (e) {
                console.log('[menu] Failed to read from:', menuPath, e.message);
            }
        }

        console.error('[menu] Could not find menu.json in any location');
        return null;
    } catch (e) {
        console.error('[menu] Error loading menu:', e.message);
        return null;
    }
}

// Format menu into readable text for the AI
function formatMenu(menuData) {
    if (!menuData || !menuData.menu) {
        console.log('[format] No valid menu data found');
        return 'Menu not available.';
    }

    try {
        const categories = menuData.menu;
        let formattedText = 'RESTAURANT MENU:\n\n';

        // Process each category
        for (const category of categories) {
            if (category.name_en && category.items && Array.isArray(category.items)) {
                // Add category header
                formattedText += `${category.name_en.toUpperCase()}:\n`;

                // Process each item in the category
                for (const item of category.items) {
                    if (item.name_en) {
                        const name = item.name_en.trim();
                        const price = item.price ? ` — ${item.price}` : '';
                        const description = item.description_en ? ` — ${item.description_en}` : '';
                        formattedText += `- ${name}${price}${description}\n`;
                    }
                }

                formattedText += '\n'; // Add space between categories
            }
        }

        console.log('[format] Formatted menu length:', formattedText.length);
        return formattedText;
    } catch (e) {
        console.error('[format] Error formatting menu:', e.message);
        return 'Error formatting menu data.';
    }
}

// Main serverless function
module.exports = async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check for API key
        if (!OPENROUTER_KEY) {
            console.error('[openrouter] Missing OPENROUTER_API_KEY environment variable');
            return res.status(500).json({ error: 'API configuration error' });
        }

        const body = req.body || {};
        const messages = body.messages;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'invalid_input', message: 'expected messages array' });
        }

        // Load and format menu
        const menuData = await loadMenu();
        const menuText = formatMenu(menuData);

        console.log('[debug] Menu loaded:', menuData ? 'Success' : 'Failed');
        console.log('[debug] Menu text length:', menuText.length);

        const systemMsg = {
            role: 'system',
            content: 'You are "Wiser", the friendly, helpful restaurant assistant for this website. Use the provided menu to answer user questions, recommend dishes, and explain ingredients or dietary suitability. Be warm, concise (1–3 short sentences), and personable. Do not invent menu items or prices. If the user asks about availability or real-time stock, advise them to contact the restaurant.\n\n' + menuText
        };

        console.log('[debug] System prompt length:', systemMsg.content.length);

        const payload = {
            model: OPENROUTER_MODEL,
            messages: [systemMsg].concat(messages),
            temperature: 0.7,
            max_tokens: 600
        };

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + OPENROUTER_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('[openrouter] error', response.status, text);
            return res.status(500).json({
                error: 'openrouter_error',
                status: response.status,
                details: text
            });
        }

        const data = await response.json();

        let reply = '';
        if (data && data.choices && data.choices[0]) {
            if (data.choices[0].message && data.choices[0].message.content) {
                reply = data.choices[0].message.content;
            } else if (data.choices[0].text) {
                reply = data.choices[0].text;
            }
        }

        return res.status(200).json({ reply: reply, raw: data });

    } catch (err) {
        console.error('[proxy] uncaught error', err);
        return res.status(500).json({
            error: 'server_error',
            message: err && err.message ? err.message : String(err)
        });
    }
};