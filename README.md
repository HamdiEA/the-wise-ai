🍽️ The Wise AI – Intelligent Restaurant Assistant  

A modern restaurant web application enhanced with an **AI-powered assistant** capable of answering menu questions, recommending dishes, and interacting naturally with users.  
Built with **React**, **TypeScript**, **Tailwind CSS**, and a **secure Node.js proxy** for AI and voice communication.  

🌐 Live Demo: [thewisrerestaurants.com](https://thewisrerestaurants.com/)  



💡 Overview  

The Wise AI blends **web development** and **artificial intelligence** to create an interactive restaurant experience.  
Users can browse menus, receive personalized recommendations, and chat with an assistant trained on real restaurant data.  
The backend integrates AI APIs securely through Node.js, while the frontend ensures a fast, modern user experience powered by **Vite** and **Tailwind**.



⚙️ Key Features  

- 🧠 AI chat assistant for dynamic conversation and dish suggestions  
- 📱 Responsive and elegant restaurant interface (React + Tailwind CSS)  
- 🔐 Secure backend proxy for OpenRouter / DeepSeek API calls  
- 🗃️ JSON-based system for menu management and dynamic rendering  
- ⚡ Fast build pipeline using Vite and TypeScript  
- 🌍 Supports both English and French interactions  



🛠️ Tech Stack  

Frontend: React, TypeScript, Vite, Tailwind CSS, React Router  
Backend: Node.js, Express, DeepSeek / OpenRouter integration  
Data: Structured JSON (menu + AI training context)  
Tools: Git, Vite, Environment-based config, Netlify / Railway  



🗂️ Project Structure  
the-wise-ai/
├── src/
│ ├── App.tsx
│ ├── components/
│ │ ├── Header.tsx
│ │ ├── HeroSection.tsx
│ │ ├── MenuSection.tsx
│ │ ├── Footer.tsx
│ │ ├── FloatingChat.tsx
│ │ └── CopilotChat.tsx
│ ├── pages/
│ │ ├── Index.tsx
│ │ └── NotFound.tsx
│ └── App.css
├── api/
│ ├── menu-assistant.js
│ ├── deepseek-proxy.cjs
│ └── menu.json
├── server/
│ ├── deepseek-proxy.js
│ └── api-proxy.js
├── public/
│ ├── menu.json
│ └── wise-logo.jpg
├── vite.config.ts
├── tailwind.config.ts
├── package.json
└── .env.example
🚀 Installation and Setup  

Requirements  
- Node.js 18+  
- npm or pnpm  

Steps  

🧩 Detailed Features
🧠 AI Chat Assistant

Floating chat interface across all pages

Communicates securely via a Node.js proxy

Trained on restaurant menu data

Bilingual support (FR / EN)

🍴 Menu Management

Dynamic rendering from JSON files

Real-time item selection and price calculation

Responsive design with Tailwind CSS

🔒 Backend Proxy

Express.js server for AI communication

Environment-based key management

Supports DeepSeek, OpenRouter, and Hugging Face APIs

Can serve static frontend in production

👨‍💻 Author

Hamdi El Abed
Computer Science student at INSA Hauts-de-France (France)
Focused on Full-Stack & AI-driven Web Development
