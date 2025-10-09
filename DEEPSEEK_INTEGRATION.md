## DeepSeek Copilot integration (added)

Files added:
- `server/deepseek-proxy.js` — small Express proxy that forwards requests to DeepSeek API. Keeps your API key secret on the server.
- `src/lib/deepseek.ts` — frontend helper to call the proxy.
- `.env.example` — shows `DEEPSEEK_API_KEY` var.

How to run locally:
1. Install server deps (in project root):
   ```bash
   npm install express node-fetch dotenv
   ```
2. Copy `.env.example` -> `.env` and put your `DEEPSEEK_API_KEY`.
3. Start the proxy:
   ```bash
   node server/deepseek-proxy.js
   ```
4. In the frontend code import `askDeepSeek`:
   ```ts
   import { askDeepSeek } from './lib/deepseek';

   const answer = await askDeepSeek('Summarize the menu');
   console.log(answer);
   ```

Where to put API code:
- **Do NOT place your API key in frontend code**. Put it in environment variables and keep it on the server (see `server/deepseek-proxy.js`).
- `src/lib/deepseek.ts` is the right place for a small client wrapper used by UI components. It calls the server proxy at `/api/deepseek`.

Notes:
- The proxy uses the DeepSeek "OpenAI-compatible" chat endpoint: `POST https://api.deepseek.com/v1/chat/completions`.
- Adjust `model`/parameters in the proxy as needed.
- For deployment: deploy the proxy as a server or serverless function (Vercel/Netlify/Azure Functions) and set the environment variable there.
