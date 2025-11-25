# 🎯 AI Resume Bullet Point Generator

A modern web application that uses OpenAI's GPT models to transform your job role and skills into professional, achievement-focused resume bullet points.

## ✨ Features

- 🤖 AI-powered bullet point generation using OpenAI GPT
- 🔐 **Enterprise-grade security** - Multiple API key options with military-grade encryption
- 🛡️ Rate limiting and input validation for abuse prevention
- 📋 One-click copy to clipboard
- 💅 Beautiful, responsive UI
- ⚡ Fast and easy to use
- 🔑 **Flexible API key options** - Use server key or your own (100% secure)

## 🔒 Security Architecture

### **Two API Key Options:**

#### Option 1: Server-Side Key (Recommended for public deployment)
- API key stored in `.env` file (server-side only)
- Shared rate limiting (20 requests per 15 minutes)
- No user configuration needed

#### Option 2: User-Provided Key (Maximum Privacy)
- ✅ **AES-256-GCM encryption** - Military-grade encryption
- ✅ **Ephemeral sessions** - Keys auto-delete after 1 minute or immediate use
- ✅ **Never logged or stored** - Cleared from memory immediately
- ✅ **End-to-end encryption** - Encrypted before transmission
- ✅ **Session-based security** - Unique encryption per session
- ✅ **HTTPS enforced** - Helmet security headers
- ✅ **Rate limited** - 10 requests per 15 minutes per user key

### Security Measures:
- 🔐 AES-256-GCM encryption for user keys
- 🛡️ Helmet.js security headers (CSP, HSTS)
- 🚫 Keys never touch disk or logs
- ⏱️ Auto-expiring sessions (60 seconds)
- 🔒 HTTPS/TLS recommended for production
- ✅ API key format validation
- 🧹 Immediate memory cleanup after use

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- (Optional) An OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Deepak619261/AI-Resume-bullet-points-generator-.git
cd AI-Resume-bullet-points-generator-
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
# Optional: Leave empty to require users to provide their own keys
OPENAI_API_KEY=your-openai-api-key-here
PORT=3000
ENCRYPTION_KEY=  # Auto-generated if not set
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 How to Use

### Using Server's API Key:
1. **Enter your Job Role** - e.g., Software Developer
2. **Enter your Skills** - e.g., React, Node.js, PostgreSQL
3. **Click Generate** - AI creates professional bullet points
4. **Copy to Clipboard** - Use them in your resume!

### Using Your Own API Key (100% Private):
1. **Check "Use my own OpenAI API key"**
2. **Enter your API key** - Securely encrypted
3. **Enter Role and Skills**
4. **Generate** - Your key is encrypted, used once, then deleted

## 🔒 Security Features

### Data Protection:
- ✅ **AES-256-GCM encryption** for user-provided API keys
- ✅ **No persistence** - Keys never stored on disk
- ✅ **Memory cleared** - Immediate cleanup after use
- ✅ **Session isolation** - Unique encryption per user
- ✅ **Auto-expiration** - Sessions expire in 60 seconds

### Application Security:
- ✅ **Helmet.js** - Security headers (CSP, HSTS, XSS protection)
- ✅ **Rate limiting** - Separate limits for server/user keys
- ✅ **Input validation** - Sanitization and length limits
- ✅ **Payload limits** - 10KB max request size
- ✅ **Error handling** - No sensitive data exposed

### Network Security:
- ✅ **Content Security Policy** - Prevents XSS attacks
- ✅ **HSTS** - Forces HTTPS in production
- ✅ **No logging** - API keys never appear in logs

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT API

## 📁 Project Structure

```
.
├── public/
│   ├── index.html    # Main HTML file
│   ├── style.css     # Styling
│   └── app.js        # Frontend JavaScript
├── server.js         # Express server
├── package.json      # Dependencies
└── README.md         # Documentation
```

## 🔐 Security Note

Your OpenAI API key is sent directly to the server for API calls and is **never stored**. Each request uses the key you provide in the form.

## 📝 Example Output

**Input:**
- Role: Software Developer
- Skills: React, REST APIs, PostgreSQL

**Output:**
```
• Developed modular React components → improved customer task completion → 22% increase in feature adoption
• Integrated REST APIs with authentication and caching → reduced data loading time → 40% faster response performance
• Optimized PostgreSQL queries and schema → minimized server CPU usage → 31% performance improvement
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License

## 👨‍💻 Author

**Deepak Kumar**
- Email: deepakkumar.ic.21@nitj.ac.in
- GitHub: [@Deepak619261](https://github.com/Deepak619261)

---

Made with ❤️ using OpenAI GPT
