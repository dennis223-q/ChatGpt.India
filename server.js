require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// API Keys
const API_KEY = "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"
const SERP_API_KEY ="b3196f697b22e529581e18333755cea1c713e0166b3dc2c9d3338e530af5bbf4"


// 🧠 OpenRouter AI Chat Endpoint
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ reply: "Prompt missing" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "No reply.";
    res.json({ reply });

  } catch (err) {
    console.error("❌ OpenRouter Error:", err.message);
    res.status(500).json({ reply: "❌ API error." });
  }
});

// 🔍 Google Search Endpoint
app.post("/google-search", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ result: "Query missing" });
  }

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: query,
        api_key: SERP_API_KEY,
        engine: "google"
      }
    });

    const results = (response.data.organic_results || [])
      .map(r => `${r.title} - ${r.link}`)
      .join("\n");

    res.json({ result: results || "No results found." });

  } catch (error) {
    console.error("Google Search Error:", error.message);
    res.status(500).json({ result: "Search error." });
  }
});

// 🌐 Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
