const jwt = require('jsonwebtoken');

const SECRET = 'wise-secret-key';

module.exports = async(req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Vercel automatically parses JSON for POST requests
        const body = req.body || {};
        const { token: existingToken, refresh } = body;

        // If we have a token and not forcing refresh, try to reuse it
        if (existingToken && !refresh) {
            try {
                const decoded = jwt.verify(existingToken, SECRET);
                const now = Math.floor(Date.now() / 1000);
                const resetAt = decoded.iat + 43200;

                // Token is still valid
                if (resetAt > now) {
                    return res.status(200).json({
                        token: existingToken,
                        messagesUsed: decoded.messagesUsed || 0,
                        messagesLimit: 5,
                        resetAt: resetAt
                    });
                }
            } catch (verifyErr) {
                // Token is invalid/expired, generate new one
                console.log('Token verification failed');
            }
        }

        // Generate new token
        const iat = Math.floor(Date.now() / 1000);
        const token = jwt.sign({ messagesUsed: 0, iat }, SECRET);

        return res.status(200).json({
            token,
            messagesUsed: 0,
            messagesLimit: 5,
            resetAt: iat + 43200
        });

    } catch (err) {
        console.error('Token error:', err);
        return res.status(500).json({
            error: 'Token generation failed',
            message: err.message
        });
    }
};