// Vercel serverless function to generate JWT tokens
const jwt = require('jsonwebtoken');

// Use environment variable for JWT secret (set in Vercel dashboard)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('[token] Request received');
        console.log('[token] JWT_SECRET exists:', !!JWT_SECRET);

        // Generate a unique session ID based on IP and user agent for fingerprinting
        const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const fingerprint = Buffer.from(`${clientIp}-${userAgent}`).toString('base64');

        // Check if there's an existing valid token
        const { token: existingToken, refresh: forceRefresh } = req.body || {};

        console.log('[token] existingToken:', existingToken ? 'provided' : 'not provided');
        console.log('[token] forceRefresh:', forceRefresh);

        if (existingToken && !forceRefresh) {
            try {
                console.log('[token] Attempting to verify existing token...');
                const decoded = jwt.verify(existingToken, JWT_SECRET);
                console.log('[token] Token verified successfully');

                const now = Math.floor(Date.now() / 1000);
                const tokenAge = now - decoded.iat;
                const resetInterval = 12 * 60 * 60; // 12 hours in seconds

                console.log('[token] Token age:', tokenAge, 'seconds');

                // If token is still within the 12-hour window, return it
                // (keep returning same token even if fingerprint changes or messages at limit)
                if (tokenAge < resetInterval) {
                    console.log('[token] Returning existing token');
                    return res.status(200).json({
                        token: existingToken,
                        messagesUsed: decoded.messagesUsed || 0,
                        messagesLimit: 5,
                        resetAt: decoded.iat + resetInterval,
                        expiresIn: resetInterval - tokenAge
                    });
                }

                // If 12 hours have passed, generate fresh token (auto-reset)
                if (tokenAge >= resetInterval) {
                    console.log('[token] 12-hour window expired, generating fresh token');
                    // Fall through to generate new token below
                }
            } catch (err) {
                // Token expired or invalid, generate new one
                console.log('[token] Token verification failed:', err.message);
            }
        }

        console.log('[token] Generating new token');

        // Generate new token with 12-hour expiration
        const payload = {
            fingerprint,
            messagesUsed: 0,
            iat: Math.floor(Date.now() / 1000)
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '12h'
        });

        res.status(200).json({
            token,
            messagesUsed: 0,
            messagesLimit: 5,
            resetAt: payload.iat + (12 * 60 * 60),
            expiresIn: 12 * 60 * 60
        });

    } catch (error) {
        console.error('Token generation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: 'Failed to generate token',
            message: error.message
        });
    }
}