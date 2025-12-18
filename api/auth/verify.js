// Vercel serverless function to verify and update JWT tokens
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'wise-secret-key';

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);

        const now = Math.floor(Date.now() / 1000);
        const resetInterval = 12 * 60 * 60;
        const resetAt = decoded.iat + resetInterval;

        // Check if token has expired (12 hours)
        if (now >= resetAt) {
            return res.status(401).json({
                error: 'Token expired - 12 hour reset required',
                expired: true,
                resetRequired: true,
                resetAt
            });
        }

        // Check message limit
        const messagesUsed = decoded.messagesUsed || 0;
        if (messagesUsed >= 5) {
            return res.status(429).json({
                error: 'Message limit reached',
                messagesUsed,
                messagesLimit: 5,
                resetAt,
                limitReached: true
            });
        }

        // Increment message count and return new token
        const newPayload = {
            messagesUsed: messagesUsed + 1,
            iat: decoded.iat // Keep original timestamp for 12-hour reset tracking
        };

        const newToken = jwt.sign(newPayload, JWT_SECRET);

        return res.status(200).json({
            token: newToken,
            messagesUsed: newPayload.messagesUsed,
            messagesLimit: 5,
            resetAt,
            messagesRemaining: 5 - newPayload.messagesUsed
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                expired: true
            });
        }

        console.error('Token verification error:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};