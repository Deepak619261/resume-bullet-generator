import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

// Server-side default API key (optional)
const DEFAULT_API_KEY = process.env.OPENAI_API_KEY || null;

// Validate at least one API key method is available
if (!DEFAULT_API_KEY) {
  console.warn('⚠️  WARNING: No default OPENAI_API_KEY set. Users must provide their own API keys.');
}

// Rate limiting: Stricter for user-provided keys
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Default key gets more requests
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const userKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // User keys are more restricted
  message: { error: 'Too many requests with custom API key, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
}));

app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.static('public'));

// Secure encryption for user API keys (ephemeral, never stored)
function encryptApiKey(apiKey, sessionId) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY + sessionId, 'salt', 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

function decryptApiKey(encryptedData, sessionId) {
  try {
    const key = crypto.scryptSync(ENCRYPTION_KEY + sessionId, 'salt', 32);
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    return null;
  }
}

// Validate OpenAI API key format
// function validateApiKey(apiKey) {
//   if (!apiKey || typeof apiKey !== 'string') {
//     return false;
//   }
  
//   // OpenAI keys start with sk- and are at least 40 chars
//   const apiKeyPattern = /^sk-[a-zA-Z0-9]{32,}$/;
//   return apiKeyPattern.test(apiKey);
// }

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

// Temporary key storage (cleared immediately after use)
const activeKeys = new Map();

// Clean up old keys every minute
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of activeKeys.entries()) {
    if (now - data.timestamp > 60000) { // 1 minute expiry
      activeKeys.delete(sessionId);
    }
  }
}, 60000);

// API endpoint to securely accept user API key (encrypted in transit)
app.post('/api/secure-key', userKeyLimiter, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Validate key format
    // if (!validateApiKey(apiKey)) {
    //   return res.status(400).json({ error: 'Invalid API key format' });
    // }
    
    // Generate session ID
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    // Encrypt the key
    const encryptedData = encryptApiKey(apiKey, sessionId);
    
    // Store temporarily (will be deleted after use or expiry)
    activeKeys.set(sessionId, {
      ...encryptedData,
      timestamp: Date.now()
    });
    
    // Clear the original key from memory
    req.body.apiKey = null;
    
    res.json({ sessionId });
  } catch (error) {
    console.error('Error processing API key:', error.message);
    res.status(500).json({ error: 'Failed to process API key' });
  }
});

// API endpoint to generate bullet points
app.post('/api/generate', defaultLimiter, async (req, res) => {
  let userApiKey = null;
  let sessionId = null;
  
  try {
    const { role, skills, developerPrompt, sessionId: providedSessionId } = req.body;

    // Validate input
    const validation = validateInput(role, skills);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Determine which API key to use
    let clientToUse;
    
    if (providedSessionId) {
      sessionId = providedSessionId;
      
      // Retrieve and decrypt user's key
      const encryptedData = activeKeys.get(sessionId);
      
      if (!encryptedData) {
        return res.status(401).json({ error: 'Session expired. Please provide your API key again.' });
      }
      
      userApiKey = decryptApiKey(encryptedData, sessionId);
      
      if (!userApiKey) {
        activeKeys.delete(sessionId);
        return res.status(401).json({ error: 'Invalid session. Please provide your API key again.' });
      }
      
      // Initialize OpenAI client with user's key
      clientToUse = new OpenAI({ apiKey: userApiKey });
      
      // Delete the key immediately after retrieval
      activeKeys.delete(sessionId);
      
    } else if (DEFAULT_API_KEY) {
      // Use server's default key
      clientToUse = new OpenAI({ apiKey: DEFAULT_API_KEY });
    } else {
      return res.status(400).json({ error: 'No API key available. Please provide your own API key.' });
    }

    const userInput = `Role: ${validation.role} | Skills: ${validation.skills}`;

    // Call OpenAI API
    const response = await clientToUse.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: developerPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const bulletPoints = response.choices[0].message.content.trim();
    
    // Clear sensitive data from memory
    userApiKey = null;
    clientToUse = null;

    res.json({ bulletPoints });
    
  } catch (error) {
    // Don't expose internal error details to client
    console.error('Error generating bullet points:', error.message);
    
    // Clean up session on error
    if (sessionId) {
      activeKeys.delete(sessionId);
    }
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your OpenAI API key.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate bullet points. Please try again.' 
    });
  } finally {
    // Ensure sensitive data is cleared
    userApiKey = null;
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Open your browser and navigate to http://localhost:${PORT}`);
});
