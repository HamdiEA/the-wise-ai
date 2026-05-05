// Vercel serverless function to verify and update JWT tokens
const jwt = require('jsonwebtoken');

const MESSAGE_LIMIT = 5;
const JWT_ISSUER = 'the-wise-assistant';
const SESSION_COOKIE = 'wr_session';

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

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                error: 'server_misconfigured',
                message: 'JWT_SECRET is required on the server',
            });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const cookieToken = parseCookies(req.headers.cookie)[SESSION_COOKIE];
        if (cookieToken && cookieToken !== token) {
            return res.status(401).json({ error: 'token_mismatch' });
        }

        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256'],
            issuer: JWT_ISSUER,
        });

        // Check message limit
        const messagesUsed = Number(decoded.messagesUsed) || 0;
        const resetAt = Number(decoded.exp) || 0;
        if (messagesUsed >= MESSAGE_LIMIT) {
            return res.status(429).json({
                error: 'Message limit reached',
                messagesUsed,
                messagesLimit: MESSAGE_LIMIT,
                resetAt,
                limitReached: true
            });
        }

        const now = Math.floor(Date.now() / 1000);
        const remainingSeconds = Math.max(1, resetAt - now);
        const nextUsed = messagesUsed + 1;

        const newToken = jwt.sign({ messagesUsed: nextUsed }, secret, {
            algorithm: 'HS256',
            issuer: JWT_ISSUER,
            expiresIn: remainingSeconds,
        });
        const updatedDecoded = jwt.decode(newToken);
        const nextResetAt =
            updatedDecoded && typeof updatedDecoded === 'object'
                ? Number(updatedDecoded.exp) || resetAt
                : resetAt;
        res.setHeader('Set-Cookie', buildSessionCookie(newToken, remainingSeconds));

        return res.status(200).json({
            token: newToken,
            messagesUsed: nextUsed,
            messagesLimit: MESSAGE_LIMIT,
            resetAt: nextResetAt,
            messagesRemaining: Math.max(0, MESSAGE_LIMIT - nextUsed)
        });

    } catch (error) {
        if (error && error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                expired: true
            });
        }

        console.error('Token verification error:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
