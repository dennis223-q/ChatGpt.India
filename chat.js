const axios = require("axios");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const result = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = result.data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.message);
    return res.status(500).json({ reply: "❌ API error." });
  }
};
