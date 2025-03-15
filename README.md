# 🎧 TTS Backend - Text-to-Speech API 🚀

Welcome to the backend of the **Text-to-Speech (TTS) Converter**! This server handles API requests to generate speech from text using **Murf TTS API** and stores conversion history using **Supabase**. 🌟

## 🚀 Features
✅ Convert text to speech using Murf TTS API  
✅ Store & retrieve conversion history  
✅ Deployed on **Supabase & Render**  

## 📞 Tech Stack
- **Node.js** 🟢  
- **Express.js** ⚡  
- **Supabase (PostgreSQL)** 🐄  
- **Murf TTS API** 🗣️  
- **Axios** 🔗
- **Dotenv**
- **cors — To enable cross-origin requests (so your frontend can access the backend)**
- **body-parser — To parse incoming JSON requests.**
  
  

## 🔧 Setup Instructions
1. **Clone the repo**  
   ```sh
   git clone https://github.com/yourusername/tts-backend.git
   cd tts-backend
   ```
2. **Install dependencies**  
   ```sh
   npm install
   ```
3. **Setup environment variables**  
   Create a `.env` file and add:
   ```plaintext
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   TTS_API_URL=your-tts-api-url
   TTS_API_KEY=your-tts-api-key
   ```
4. **Run the server**  
   ```sh
   npm start
   ```
   The server runs on **http://localhost:5000** 🚀

## 🐟 API Endpoints
| Method | Endpoint         | Description                |
|--------|----------------|----------------------------|
| POST   | `/tts`         | Convert text to speech 🔊  |
| GET    | `/history`     | Fetch conversion history 📜 |
| DELETE | `/history/:id` | Delete a history record ❌ |

## 🎯 Deployment
- **Backend deployed on Render:** 🌍 [Live Link](https://tts-backend-5jnm.onrender.com)  
- **Database hosted on Supabase**  

---

🎉 **Happy Coding!** 💻🚀

---

