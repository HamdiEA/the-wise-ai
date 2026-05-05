const jwt = require('jsonwebtoken');

const MESSAGE_LIMIT = 5;
const WINDOW_SECONDS = 12 * 60 * 60;
const JWT_ISSUER = 'the-wise-assistant';
const SESSION_COOKIE = 'wr_session';

function buildSessionCookie(token, maxAgeSeconds = WINDOW_SECONDS) {
    return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    // Handle preflight
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

        // Vercel automatically parses JSON for POST requests
        const body = req.body || {};
        const { token: existingToken, refresh } = body;

        // If we have a token and not forcing refresh, try to reuse it
        if (existingToken && !refresh) {
            try {
                const decoded = jwt.verify(existingToken, secret, {
                    algorithms: ['HS256'],
                    issuer: JWT_ISSUER,
                });

                const messagesUsed = Number(decoded.messagesUsed) || 0;
                const expiresIn = Math.max(1, (Number(decoded.exp) || 0) - Math.floor(Date.now() / 1000));
                res.setHeader('Set-Cookie', buildSessionCookie(existingToken, expiresIn));
                return res.status(200).json({
                    token: existingToken,
                    messagesUsed: Math.max(0, Math.min(MESSAGE_LIMIT, messagesUsed)),
                    messagesLimit: MESSAGE_LIMIT,
                    resetAt: Number(decoded.exp) || 0,
                });
            } catch {
                // Token is invalid/expired, generate new one.
            }
        }

        // Generate new token
        const token = jwt.sign({ messagesUsed: 0 }, secret, {
            algorithm: 'HS256',
            issuer: JWT_ISSUER,
            expiresIn: WINDOW_SECONDS,
        });
        const decoded = jwt.decode(token);
        const resetAt = decoded && typeof decoded === 'object' ? Number(decoded.exp) || 0 : 0;
        res.setHeader('Set-Cookie', buildSessionCookie(token));

        return res.status(200).json({
            token,
            messagesUsed: 0,
            messagesLimit: MESSAGE_LIMIT,
            resetAt,
            messagesRemaining: MESSAGE_LIMIT,
        });

    } catch (err) {
        console.error('Token error:', err);
        return res.status(500).json({
            error: 'token_error',
            message: err instanceof Error ? err.message : String(err),
        });
    }
};
