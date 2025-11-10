🧠 The Wise AI — Restaurant Assistant

> A real-world restaurant website with an AI assistant for menu Q&A and recommendations.  
> Built with React + TypeScript + Tailwind (Vite) and a Node/Express proxy for secure AI API calls.

Live : https://thewisrerestaurants.com/

---

✨ What it does

- Modern restaurant site (hero, menu, footer, responsive UI)
- Rich menu model (JSON-driven categories, dishes, sizes & pricing matrix)
- Floating AI chat assistant that can:
  - Answer menu questions (ingredients, availability, prices, combos)
  - Suggest items from the restaurant’s own menu.json
  - Handle French/English prompts (basic i18n in UI)
- Secure AI calls** via a backend **proxy** (no keys on the client)
- Production-ready setup** with Vite build + optional static serving from Node

---

🧩 Tech Stack

Frontend
- React (TypeScript) · Vite
- Tailwind CSS
- React Router
- Component structure: `Header`, `HeroSection`, `MenuSection`, `Footer`, `FloatingChat`, `CopilotChat`

Backend / Proxy
- Node.js · Express
- `server/deepseek-proxy.js` (OpenRouter/DeepSeek style chat endpoint)
- `server/api-proxy.js` (generic API proxy; optional Hugging Face integration)
- Environment-based secrets via `.env`

Data
- `api/menu.json` + `public/menu.json` (restaurant/domain data used by the AI assistant)

---


