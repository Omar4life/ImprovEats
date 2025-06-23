const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { ingredients } = req.body;
  const prompt = `Give me a full recipe (title, ingredients, and step-by-step instructions) using: ${ingredients.join(', ')}`;

  try {
    const response = await axios.post('https://freegpt-replit-api.rigorz.repl.co/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    const recipe = response.data.choices?.[0]?.message?.content;
    if (!recipe) return res.status(500).json({ error: 'Invalid GPT response' });

    res.json({ recipe });
  } catch (err) {
    console.error('GPT Proxy ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
