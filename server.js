const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());


const GEMINI_API_KEY = 'put api key';

app.post('/api/generate', async (req, res) => {
  const { ingredients } = req.body;

  const prompt = `
You are a professional recipe generator. Based only on these ingredients: ${ingredients.join(', ')}, generate a short, clean recipe and return it in this exact JSON format:

{
  "title": "Recipe title",
  "yield": "2 servings",
  "ingredients": [
    "each ingredient as a string"
  ],
  "instructions": [
    "each cooking step as a short string"
  ]
}

Only return valid JSON. Do not explain anything. No markdown. No headings. No text before or after the JSON. Just return pure JSON.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // ✅ Remove markdown if Gemini wraps JSON in ```json ... ```
    const cleanJSON = raw.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(cleanJSON);

    if (!parsed || !parsed.title || !parsed.ingredients || !parsed.instructions) {
      return res.status(500).json({ error: 'No recipe returned' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Gemini API ERROR:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to parse recipe JSON from Gemini.' });
  }
});


app.listen(3022, () => {
  console.log('✅ Gemini AI server running at http://localhost:3022');
});
