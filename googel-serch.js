const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query } = req.body;

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: query,
        api_key: "b3196f697b22e529581e18333755cea1c713e0166b3dc2c9d3338e530af5bbf4",
        engine: "google"
      }
    });

    const results = response.data.organic_results
      .map((r) => `${r.title} - ${r.link}`)
      .join("\n");

    res.status(200).json({ result: results });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ result: "Search error." });
  }
}
