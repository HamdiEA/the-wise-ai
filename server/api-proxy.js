import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// --- Resolve dirname and load .env ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// --- Debug log for sanity check ---
console.log("[debug] Token:", process.env.HUGGING_FACE_READ_TOKEN ? "found" : "missing");
console.log("[debug] Model:", process.env.HF_MODEL);

// --- Express setup ---
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5174;
const HF_MODEL = process.env.HF_MODEL || "HuggingFaceH4/zephyr-7b-beta";
const HF_TOKEN = process.env.HUGGING_FACE_READ_TOKEN;

// --- Basic health check route ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- 🧠 Hugging Face chat endpoint ---
app.post("/api/deepseek", async (req, res) => {
  if (!HF_TOKEN) {
    return res.status(401).json({ error: "no_api_key", message: "No Hugging Face token configured on the server." });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages_array_required" });
    }

    const inputText = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    const hfUrl = `https://api-inference.huggingface.co/models/${encodeURIComponent(HF_MODEL)}`;

    const resp = await fetch(hfUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({ inputs: inputText }),
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = [{ generated_text: text }];
    }

    const reply = data[0]?.generated_text || "No response.";
    return res.json({ reply });
  } catch (err) {
    console.error("Hugging Face proxy error", err);
    return res.status(500).json({ error: "proxy_error", message: String(err) });
  }
});

// --- Serve built frontend if it exists ---
const staticDir = path.join(__dirname, "..", "dist");
if (process.env.SERVE_STATIC !== "false") {
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

// --- Start server ---
app.listen(PORT, () => {
  console.log(`✅ API proxy running on http://localhost:${PORT}`);
});
