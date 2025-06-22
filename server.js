const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: 'Hiding api key' });

app.post('/api/generate', async (req, res) => {
  const { ingredients } = req.body;
  console.log("Received ingredients:", ingredients); // 

  const prompt = `Suggest a detailed recipe using these ingredients: ${ingredients.join(', ')}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    console.log("OpenAI response:", response); // 

    res.json({ recipe: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI ERROR:", err); // 
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
