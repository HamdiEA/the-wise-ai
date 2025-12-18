// Vercel serverless function to verify and update JWT tokens
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

        // Verify fingerprint
        const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const fingerprint = Buffer.from(`${clientIp}-${userAgent}`).toString('base64');

        if (decoded.fingerprint !== fingerprint) {
            return res.status(403).json({ error: 'Token fingerprint mismatch' });
        }

        const now = Math.floor(Date.now() / 1000);
        const tokenAge = now - decoded.iat;
        const resetInterval = 12 * 60 * 60;

        // Check if token has expired (12 hours)
        if (tokenAge >= resetInterval) {
            return res.status(401).json({
                error: 'Token expired',
                expired: true,
                resetRequired: true
            });
        }

        // Check message limit
        const messagesUsed = decoded.messagesUsed || 0;
        if (messagesUsed >= 5) {
            return res.status(429).json({
                error: 'Message limit reached',
                messagesUsed,
                messagesLimit: 5,
                resetAt: decoded.iat + resetInterval,
                limitReached: true
            });
        }

        // Increment message count and generate new token
        const newPayload = {
            fingerprint: decoded.fingerprint,
            messagesUsed: messagesUsed + 1,
            iat: decoded.iat // Keep original timestamp for reset tracking
        };

        const newToken = jwt.sign(newPayload, JWT_SECRET, {
            expiresIn: '12h'
        });

        res.status(200).json({
            token: newToken,
            messagesUsed: newPayload.messagesUsed,
            messagesLimit: 5,
            resetAt: decoded.iat + resetInterval,
            messagesRemaining: 5 - newPayload.messagesUsed
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                expired: true,
                resetRequired: true
            });
        }

        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}