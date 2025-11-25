import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY environment variable is not set');
  console.error('Please create a .env file with OPENAI_API_KEY=your-key-here');
  process.exit(1);
}

// Initialize OpenAI client once with server-side API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rate limiting: 10 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.static('public'));
app.use('/api/', limiter); // Apply rate limiting to API routes

// Input validation function
function validateInput(role, skills) {
  const MAX_LENGTH = 200;
  
  if (!role || !skills) {
    return { valid: false, error: 'Role and skills are required' };
  }
  
  if (typeof role !== 'string' || typeof skills !== 'string') {
    return { valid: false, error: 'Invalid input format' };
  }
  
  if (role.length > MAX_LENGTH || skills.length > MAX_LENGTH) {
    return { valid: false, error: 'Input too long. Please keep role and skills under 200 characters each.' };
  }
  
  // Basic sanitization: remove excessive whitespace
  const sanitizedRole = role.trim().replace(/\s+/g, ' ');
  const sanitizedSkills = skills.trim().replace(/\s+/g, ' ');
  
  if (sanitizedRole.length === 0 || sanitizedSkills.length === 0) {
    return { valid: false, error: 'Role and skills cannot be empty' };
  }
  
  return { valid: true, role: sanitizedRole, skills: sanitizedSkills };
}

// API endpoint to generate bullet points
app.post('/api/generate', async (req, res) => {
  try {
    const { role, skills, developerPrompt } = req.body;

    // Validate input
    const validation = validateInput(role, skills);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const userInput = `Role: ${validation.role} | Skills: ${validation.skills}`;

    // Call OpenAI API with server-side key
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
    // Don't expose internal error details to client
    console.error('Error generating bullet points:', error.message);
    
    if (error.status === 401) {
      return res.status(500).json({ error: 'Server configuration error. Please contact administrator.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate bullet points. Please try again.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Open your browser and navigate to http://localhost:${PORT}`);
});
