🎧 TTS Backend - Text-to-Speech API 🚀
Welcome to the TTS Converter Backend! This server powers the Text-to-Speech (TTS) Converter, handling API requests to generate speech from text using Murf TTS API and managing conversion history with Supabase.

🚀 Features
✅ Convert text to speech using Murf TTS API
✅ Store & retrieve conversion history with Supabase
✅ Delete history items as needed
✅ CORS-enabled for seamless frontend integration
✅ Deployed on Render & Supabase for reliability

🛠 Tech Stack
Node.js 🟢 - Backend runtime
Express.js ⚡ - Web framework
Supabase (PostgreSQL) 🐘 - Database for storing conversion history
Murf TTS API 🎙 - Speech generation
Axios 🔗 - API requests handling
dotenv 🛠 - Environment variable management
CORS 🔄 - Cross-origin resource sharing
Body-parser 📦 - Parse incoming JSON requests
🔧 Setup & Installation
1️⃣ Clone the Repository
sh
Copy
Edit
git clone https://github.com/yourusername/tts-backend.git  
cd tts-backend
2️⃣ Install Dependencies
sh
Copy
Edit
npm install
3️⃣ Configure Environment Variables
Create a .env file in the project root and add the following:

plaintext
Copy
Edit
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
TTS_API_URL=your-tts-api-url
TTS_API_KEY=your-tts-api-key
4️⃣ Run the Server
sh
Copy
Edit
npm start
By default, the server runs on http://localhost:5000 🚀

📡 API Endpoints
Method	Endpoint	Description
POST	/tts	Convert text to speech 🔊
GET	/history	Fetch conversion history 📜
DELETE	/history/:id	Delete a history record ❌
🚀 Deployment
Backend deployed on Render: 🌍 Live Link
Database hosted on Supabase
💡 Notes & Future Improvements
✅ Add user authentication for personalized history storage
✅ Implement pagination for history retrieval
✅ Enhance error handling for API failures
🎉 Happy Coding! 💻🚀

Let me know if you want any more refinements! 🚀
