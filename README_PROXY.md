# API Proxy - DeepSeek + Hugging Face (Updated)

This project includes an Express-based proxy that forwards requests to:
- DeepSeek chat completions (`/api/deepseek`)
- Hugging Face Inference API (`/api/huggingface`)

## Environment (.env)
Create a `.env` file in the project root (do **not** commit this):

```
DEEPSEEK_API_KEY=your_deepseek_key_here
HUGGINGFACE_API_KEY=hf_xxx_your_hf_read_token
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
PORT=5174
SERVE_STATIC=true
```

## Running the proxy locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the proxy:
   ```bash
   npm run start:server
   ```
3. The frontend should call `/api/huggingface` or `/api/deepseek` (already wired in this project).

## Hugging Face token
For inference from private models, create a token with **Read** access. Paste it into `HUGGINGFACE_API_KEY` in your `.env` (do not expose it to the browser).


## OpenRouter (Menu Assistant)

This project now includes a `/api/menu-assistant` proxy which forwards chat requests to OpenRouter. To use it:

1. Create a `.env` file in the project root (do not commit it) and add:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-3.5-turbo
PORT=5174
SERVE_STATIC=true
```

2. Start the proxy server which serves the assistant:

```bash
npm install
npm run start:proxy
```

3. The frontend chat UI at `/deepseek` (or the chat component) will POST to `/api/menu-assistant` and the server will include the menu (from `src/data/menu.json`) in the system prompt so the assistant can answer and recommend dishes accurately.

Security note: keep your keys server-side. This proxy approach avoids putting the OpenRouter key in browser JavaScript.
