import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint to generate bullet points
app.post('/api/generate', async (req, res) => {
  try {
    const { apiKey, role, skills, developerPrompt } = req.body;

    if (!apiKey || !role || !skills) {
      return res.status(400).json({ error: 'API key, role, and skills are required' });
    }

    // Initialize OpenAI client with user's API key
    const client = new OpenAI({
      apiKey: apiKey
    });

    const userInput = `Role: ${role} | Skills: ${skills}`;

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: developerPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const bulletPoints = response.choices[0].message.content.trim();

    res.json({ bulletPoints });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate bullet points' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Open your browser and navigate to http://localhost:${PORT}`);
});
