const jwt = require('jsonwebtoken');

const SECRET = 'wise-secret-key';

module.exports = async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { token: existingToken, refresh } = body;

        // Return existing token if still valid
        if (existingToken && !refresh) {
            try {
                const decoded = jwt.verify(existingToken, SECRET);
                const now = Math.floor(Date.now() / 1000);
                if ((decoded.iat + 43200) > now) {
                    return res.status(200).json({
                        token: existingToken,
                        messagesUsed: decoded.messagesUsed || 0,
                        messagesLimit: 5,
                        resetAt: decoded.iat + 43200
                    });
                }
            } catch (e) {}
        }

        // Generate new token
        const iat = Math.floor(Date.now() / 1000);
        const token = jwt.sign({ messagesUsed: 0, iat }, SECRET, { expiresIn: '12h' });

        return res.json({
            token,
            messagesUsed: 0,
            messagesLimit: 5,
            resetAt: iat + 43200
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Failed' });
    }
};