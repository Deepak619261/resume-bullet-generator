# 🎯 AI Resume Bullet Point Generator

A modern web application that uses OpenAI's GPT models to transform your job role and skills into professional, achievement-focused resume bullet points.

## ✨ Features

- 🤖 AI-powered bullet point generation using OpenAI GPT
- 🔒 Secure - API key stored server-side only
- 🛡️ Rate limiting and input validation for abuse prevention
- 📋 One-click copy to clipboard
- 💅 Beautiful, responsive UI
- ⚡ Fast and easy to use

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- An OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))

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
OPENAI_API_KEY=your-openai-api-key-here
PORT=3000
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

1. **Enter your Job Role** - e.g., Software Developer, Marketing Manager
2. **Enter your Skills** - e.g., React, Node.js, PostgreSQL
3. **Click Generate** - AI will create professional bullet points
4. **Copy to Clipboard** - Use them in your resume!

## 🔒 Security Features

- **Server-side API key management** - OpenAI API key is stored securely in environment variables, never exposed to clients
- **Rate limiting** - 10 requests per 15 minutes per IP to prevent abuse
- **Input validation** - Maximum 200 characters per field with sanitization
- **Payload size limits** - 10KB max request size
- **Error handling** - Internal errors never expose sensitive information to clients

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
