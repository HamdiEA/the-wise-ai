const jwt = require('jsonwebtoken');

const SECRET = 'wise-secret-key';

module.exports = async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    let body = {};

    try {
        // Try different ways to get body
        if (req.body) {
            if (typeof req.body === 'string') {
                body = JSON.parse(req.body);
            } else {
                body = req.body;
            }
        }
    } catch (parseError) {
        console.error('Parse error:', parseError);
    }

    try {
        const existingToken = body.token;
        const refresh = body.refresh;

        // Return existing token if still valid
        if (existingToken && !refresh) {
            const decoded = jwt.verify(existingToken, SECRET);
            const now = Math.floor(Date.now() / 1000);
            if ((decoded.iat + 43200) > now) {
                return res.json({
                    token: existingToken,
                    messagesUsed: decoded.messagesUsed || 0,
                    messagesLimit: 5,
                    resetAt: decoded.iat + 43200
                });
            }
        }

        // Generate new token
        const iat = Math.floor(Date.now() / 1000);
        const token = jwt.sign({ messagesUsed: 0, iat }, SECRET);

        return res.json({
            token,
            messagesUsed: 0,
            messagesLimit: 5,
            resetAt: iat + 43200
        });

    } catch (error) {
        console.error('Token error:', error ? .message || error);
        return res.status(500).json({ error: error ? .message || 'Server error' });
    }
};