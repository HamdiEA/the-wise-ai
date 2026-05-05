const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
const MESSAGE_LIMIT = 5;
const JWT_ISSUER = 'the-wise-assistant';
const SESSION_COOKIE = 'wr_session';

const LANGUAGE_RULES = {
  fr: 'Answer only in French.',
  en: 'Answer only in English.',
  ar: 'Answer only in Arabic.',
};

function parseCookies(rawCookieHeader) {
  const cookies = {};
  if (!rawCookieHeader) return cookies;
  const pairs = rawCookieHeader.split(';');

  for (const pair of pairs) {
    const [k, ...v] = pair.trim().split('=');
    if (!k) continue;
    cookies[k] = v.join('=');
  }

  return cookies;
}

function buildSessionCookie(token, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}

async function loadMenu() {
  try {
    const possiblePaths = [
      path.join(__dirname, 'menu.json'),
      path.join(__dirname, '../public/menu.json'),
      path.join(__dirname, '../src/data/menu.json'),
      path.join(process.cwd(), 'public/menu.json'),
      path.join(process.cwd(), 'src/data/menu.json'),
    ];

    for (const menuPath of possiblePaths) {
      try {
        if (fs.existsSync(menuPath)) {
          const data = fs.readFileSync(menuPath, 'utf8');
          return JSON.parse(data);
        }
      } catch {
        // try next location
      }
    }

    console.error('[menu] Could not find menu.json in any location');
    return null;
  } catch (error) {
    console.error('[menu] Error loading menu:', error.message);
    return null;
  }
}

function formatMenu(menuData) {
  if (!menuData || !menuData.menu) {
    return 'Menu not available.';
  }

  try {
    const categories = menuData.menu;
    let formattedText = 'RESTAURANT MENU:\n\n';

    for (const category of categories) {
      if (category.name_en && Array.isArray(category.items)) {
        formattedText += `${category.name_en.toUpperCase()}:\n`;

        for (const item of category.items) {
          if (item.name_en) {
            const name = String(item.name_en).trim();
            const price = item.price ? ` - ${item.price}` : '';
            const description = item.description_en ? ` - ${item.description_en}` : '';
            formattedText += `- ${name}${price}${description}\n`;
          }
        }

        formattedText += '\n';
      }
    }

    return formattedText;
  } catch (error) {
    console.error('[format] Error formatting menu:', error.message);
    return 'Error formatting menu data.';
  }
}

function parseAndValidateMessages(rawMessages) {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > 12) {
    return null;
  }

  const allowedRoles = new Set(['user', 'assistant', 'system']);
  const sanitized = [];

  for (const msg of rawMessages) {
    if (!msg || typeof msg !== 'object') return null;
    if (!allowedRoles.has(msg.role)) return null;
    if (typeof msg.content !== 'string') return null;

    const content = msg.content.trim();
    if (!content || content.length > 1200) return null;

    sanitized.push({ role: msg.role, content });
  }

  return sanitized;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        error: 'server_misconfigured',
        message: 'JWT_SECRET is required on the server',
      });
    }

    if (!OPENROUTER_KEY) {
      return res.status(500).json({
        error: 'server_misconfigured',
        message: 'OPENROUTER_API_KEY is required on the server',
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'no_token', message: 'Authentication required' });
    }

    const body = req.body || {};
    const messages = parseAndValidateMessages(body.messages);
    const lang = typeof body.lang === 'string' ? body.lang : 'fr';

    if (!messages) {
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Expected a messages array (1-12 items).',
      });
    }

    const token = authHeader.substring(7);
    const cookieToken = parseCookies(req.headers.cookie)[SESSION_COOKIE];
    if (cookieToken && cookieToken !== token) {
      return res.status(401).json({ error: 'token_mismatch' });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
      });
    } catch (error) {
      const expired = Boolean(error && error.name === 'TokenExpiredError');
      return res.status(401).json({
        error: expired ? 'token_expired' : 'invalid_token',
        expired,
      });
    }

    const messagesUsed = Number(decoded.messagesUsed) || 0;
    const resetAt = Number(decoded.exp) || 0;

    if (messagesUsed >= MESSAGE_LIMIT) {
      return res.status(429).json({
        error: 'limit_reached',
        messagesUsed,
        messagesLimit: MESSAGE_LIMIT,
        messagesRemaining: 0,
        resetAt,
      });
    }

    const menuData = await loadMenu();
    const menuText = formatMenu(menuData);
    const languageRule = LANGUAGE_RULES[lang] || LANGUAGE_RULES.fr;

    const systemMessage = {
      role: 'system',
      content:
        'You are "Wiser", the friendly restaurant assistant for this website. ' +
        languageRule +
        ' Keep responses concise (1-3 short sentences) unless the user asks for details. ' +
        'Never invent menu items, prices, or availability. If unsure, ask the user to call the restaurant.\n\n' +
        menuText,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [systemMessage, ...messages],
        temperature: 0.55,
        max_tokens: 240,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(500).json({
        error: 'openrouter_error',
        status: response.status,
        details,
      });
    }

    const payload = await response.json();
    const choice = payload?.choices?.[0];
    const reply =
      (choice?.message?.content && String(choice.message.content)) ||
      (choice?.text && String(choice.text)) ||
      '';

    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = Math.max(1, resetAt - now);
    const nextUsed = Math.min(MESSAGE_LIMIT, messagesUsed + 1);

    const refreshedToken = jwt.sign({ messagesUsed: nextUsed }, jwtSecret, {
      algorithm: 'HS256',
      issuer: JWT_ISSUER,
      expiresIn: remainingSeconds,
    });

    const refreshedDecoded = jwt.decode(refreshedToken);
    const nextResetAt =
      refreshedDecoded && typeof refreshedDecoded === 'object'
        ? Number(refreshedDecoded.exp) || resetAt
        : resetAt;
    res.setHeader('Set-Cookie', buildSessionCookie(refreshedToken, remainingSeconds));

    return res.status(200).json({
      reply,
      token: refreshedToken,
      messagesUsed: nextUsed,
      messagesLimit: MESSAGE_LIMIT,
      messagesRemaining: Math.max(0, MESSAGE_LIMIT - nextUsed),
      resetAt: nextResetAt,
    });
  } catch (error) {
    console.error('[proxy] uncaught error', error);
    return res.status(500).json({
      error: 'server_error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
