const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: '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' });

app.post('/api/generate', async (req, res) => {
  const { ingredients } = req.body;
  const prompt = `Suggest a detailed recipe using these ingredients: ${ingredients.join(', ')}`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });
    res.json({ recipe: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
