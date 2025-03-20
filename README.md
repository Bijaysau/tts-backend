# 🎧 TTS Backend - Text-to-Speech API 🚀

Welcome to the **TTS Converter Backend**! This server powers the **Text-to-Speech (TTS) Converter**, handling API requests to generate speech from text using **Murf TTS API** and managing conversion history with **Supabase**.

---

## 🚀 Features  

✅ Convert text to speech using **Murf TTS API**  
✅ Store & retrieve conversion history with **Supabase**  
✅ Delete history items as needed  
✅ **CORS-enabled** for seamless frontend integration  
✅ Deployed on **Render & Supabase** for reliability  
✅ Well-documented API for easy integration  

---

## 🛠 Tech Stack  

- **Node.js** 🟢 - JavaScript runtime environment  
- **Express.js** ⚡ - Fast and lightweight backend framework  
- **Supabase (PostgreSQL)** 🐘 - Cloud-hosted database for history storage  
- **Murf TTS API** 🎙 - Generates speech from text  
- **Axios** 🔗 - Makes API requests easier  
- **dotenv** 🛠 - Manages environment variables securely  
- **CORS** 🔄 - Enables cross-origin requests  
- **Body-parser** 📦 - Parses incoming JSON requests  

---

## 🔧 Setup & Installation  

Follow these steps to get the server up and running:

### 1️⃣ Clone the Repository  

```sh
git clone https://github.com/yourusername/tts-backend.git  
cd tts-backend
```

### 2️⃣ Install Dependencies  

```sh
npm install
```

### 3️⃣ Configure Environment Variables  

Create a `.env` file in the project root and add the following:

```plaintext
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
TTS_API_URL=your-tts-api-url
TTS_API_KEY=your-tts-api-key
```

Replace the placeholders with your actual API keys and database credentials.

### 4️⃣ Run the Server  

```sh
npm start
```

By default, the server runs on [http://localhost:5000](http://localhost:5000) 🚀

---

## 📡 API Endpoints  

### 🔊 Convert Text to Speech  
**POST** `/tts`  
Description: Converts text into speech and returns an audio URL.

#### Request Body:
```json
{
  "text": "Hello, this is a TTS test!"
}
```

#### Response:
```json
{
  "audioUrl": "https://your-storage.com/audio-file.mp3"
}
```

### 📜 Fetch Conversion History  
**GET** `/history`  
Description: Retrieves a list of previously converted texts and their audio URLs.

#### Response:
```json
[
  {
    "id": 1,
    "text": "Hello, this is a test",
    "audio_url": "https://your-storage.com/audio-file.mp3",
    "created_at": "2025-03-20T12:00:00Z"
  }
]
```

### ❌ Delete a History Record  
**DELETE** `/history/:id`  
Description: Deletes a specific history entry based on its ID.

#### Response:
```json
{
  "message": "✅ History item deleted successfully"
}
```

---

## 🚀 Deployment  

This backend is deployed on **Render** and **Supabase**:

- **Backend deployed on Render:** 🌍 Live Link  
- **Database hosted on Supabase**  

### To deploy your own version:

1. Push your code to GitHub  
2. Connect your repository to Render  
3. Add environment variables in Render settings  
4. Deploy and get a live backend 🚀  

---

## 💡 Notes & Future Improvements  

✅ Add user authentication for personalized history storage  
✅ Implement pagination for history retrieval  
✅ Enhance error handling for API failures  
✅ Add support for multiple voice options and languages  

---

## 📄 License  

This project is open-source and available under the **MIT License**. Feel free to use, modify, and contribute!

---

🎉 **Happy Coding!** 💻🚀  
If you have any issues or feature requests, feel free to open an issue on GitHub! 🚀
