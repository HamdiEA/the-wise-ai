# JWT-Based Authentication Setup

## Environment Variables

You need to set these in your Vercel dashboard:

1. `JWT_SECRET` - A strong random secret for signing JWT tokens (minimum 32 characters)
   ```bash
   # Generate a secure secret:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. `OPENROUTER_API_KEY` - Your OpenRouter API key (already set)

## How It Works

### JWT Token Flow
1. User opens chat → frontend requests token from `/api/auth/token`
2. Server generates JWT with user fingerprint (IP + User-Agent)
3. Token stored in localStorage with message count
4. Each message → frontend calls `/api/auth/verify` to increment count
5. Server returns new token with updated count
6. After 5 messages, returns 429 error (limit reached)
7. After 12 hours, token expires and resets

### Security Features
- **Fingerprinting**: Tokens tied to IP address + User-Agent
- **12-hour expiration**: Automatic reset every 12 hours
- **Server-side validation**: Real enforcement, can't bypass in browser
- **No user accounts needed**: Anonymous sessions

### Deployment to Vercel

1. Install dependencies:
   ```bash
   npm install jsonwebtoken
   ```

2. Set environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `JWT_SECRET` with a strong random value
   - Add `OPENROUTER_API_KEY` (if not already set)

3. Deploy:
   ```bash
   vercel --prod
   ```

### API Endpoints

- `POST /api/auth/token` - Get or refresh JWT token
- `POST /api/auth/verify` - Verify token and increment message count
- `POST /api/menu-assistant` - Send chat message (requires Authorization header)

### Testing Locally

1. Create `.env` file:
   ```
   JWT_SECRET=your-test-secret-key-at-least-32-chars
   OPENROUTER_API_KEY=your-openrouter-key
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

### Troubleshooting

**Token expired error**: Normal after 12 hours - frontend auto-refreshes  
**Fingerprint mismatch**: User's IP/browser changed - gets new token  
**Limit reached**: User sent 5 messages - wait for 12h reset  

**To manually reset a user**: They can clear localStorage or wait 12 hours
