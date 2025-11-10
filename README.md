The Wise AI – Intelligent Restaurant Assistant

A modern restaurant website enhanced with an AI-powered assistant capable of answering menu questions, recommending dishes, and interacting naturally with users.
Built with React, TypeScript, Tailwind, and a secure Node.js proxy for AI communication.

Live Demo: https://thewisrerestaurants.com/

Overview

The Wise AI project combines web development and applied artificial intelligence to deliver an interactive and intelligent restaurant platform.
It allows users to explore menus, receive personalized recommendations, and chat with an assistant trained on real menu data.
The architecture includes a secure backend proxy for AI communication and a high-performance frontend built with Vite.

Key Features

• Responsive restaurant interface built with React and Tailwind
• AI chat assistant for natural menu interaction and recommendations
• Secure Node.js proxy for OpenRouter / DeepSeek API calls
• JSON-based data system for menu content and pricing
• Modular and scalable TypeScript codebase
• Fully deployable through Vite build or integrated Node server

Technology Stack

Frontend: React (TypeScript), Tailwind CSS, Vite, React Router
Backend / AI Proxy: Node.js, Express, DeepSeek / OpenRouter integration, environment-based key management
Data: Structured JSON for menu configuration and dynamic rendering

Project Structure
the-wise-ai/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MenuSection.tsx
│   │   ├── Footer.tsx
│   │   ├── FloatingChat.tsx
│   │   └── CopilotChat.tsx
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   └── App.css
├── api/
│   ├── menu-assistant.js
│   ├── deepseek-proxy.cjs
│   └── menu.json
├── server/
│   ├── deepseek-proxy.js
│   └── api-proxy.js
├── public/
│   ├── menu.json
│   └── wise-logo.jpg
├── vite.config.ts
├── tailwind.config.ts
├── package.json
└── .env.example

Installation and Setup

Requirements
• Node.js 18 or higher
• npm or pnpm

Steps

Clone the repository

git clone https://github.com/HamdiEA/the-wise-ai.git  
cd the-wise-ai


Install dependencies

npm install


Configure environment variables
Create a .env file using .env.example as a reference:

OPENROUTER_API_KEY=your_api_key  
OPENROUTER_MODEL=openai/gpt-3.5-turbo  
PORT=5174  
SERVE_STATIC=false


Start development servers

npm run dev            (Frontend)  
npm run start:proxy    (AI Proxy Server)


Access the application:
Frontend → http://localhost:5173

Proxy Server → http://localhost:5174

Detailed Features

AI Chat Assistant

Floating chat interface integrated across all pages

Communicates securely through a Node.js proxy

Trained with restaurant menu data

Supports French and English prompts

Menu Management

Menu content stored in JSON files

Dynamic rendering via React components

Real-time total calculation for menu items

Optimized layout using Tailwind CSS

Backend Proxy

Built with Express.js

Manages API communication with DeepSeek / OpenRouter

Uses environment variables for secure key management

Can serve static frontend in production mode

Deployment

Frontend
Build and deploy the site using:

npm run build


Deploy the /dist folder to Netlify, Vercel, or any hosting service.

Backend Proxy
Deploy server/deepseek-proxy.js or server/api-proxy.js on Render, Railway, or a VPS.
Copy the .env file to the server and set SERVE_STATIC=true if the proxy will also serve the frontend.

Security

• API keys are stored only on the server (.env)
• All external calls pass through a secure Express proxy
• Input validation and rate limiting recommended for production

Roadmap

• Voice interaction using Google Cloud Speech-to-Text
• ElevenLabs Text-to-Speech integration for conversational feedback
• Admin dashboard for dynamic menu updates
• PWA version for offline and mobile usage

Author

Hamdi El Abed
