// Vercel serverless function to generate JWT tokens
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'the-wise-restaurant-secret-key-12345-change-this-in-production';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        let body = {};
        if (typeof req.body === 'string') {
            body = JSON.parse(req.body);
        } else if (req.body) {
            body = req.body;
        }

        const existingToken = body.token;
        const forceRefresh = body.refresh;

        if (existingToken && !forceRefresh) {
            const decoded = jwt.verify(existingToken, JWT_SECRET);
            const now = Math.floor(Date.now() / 1000);
            const remaining = (decoded.iat + 12 * 60 * 60) - now;

            if (remaining > 0) {
                return res.status(200).json({
                    token: existingToken,
                    messagesUsed: decoded.messagesUsed || 0,
                    messagesLimit: 5,
                    resetAt: decoded.iat + 12 * 60 * 60
                });
            }
        }

        const iat = Math.floor(Date.now() / 1000);
        const token = jwt.sign({ messagesUsed: 0, iat }, JWT_SECRET, { expiresIn: '12h' });

        return res.status(200).json({
            token,
            messagesUsed: 0,
            messagesLimit: 5,
            resetAt: iat + 12 * 60 * 60
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}