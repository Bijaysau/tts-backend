

// 🚀 Import necessary packages
import express from "express";
import dotenv from "dotenv"; // To load environment variables
import { createClient } from "@supabase/supabase-js"; // To interact with Supabase database
import cors from "cors"; // To enable CORS for cross-origin requests
import axios from "axios"; // To make HTTP requests to external APIs
import bodyParser from "body-parser"; // To parse incoming request bodies

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Load environment variables for Supabase and TTS API
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const TTS_API_KEY = process.env.TTS_API_KEY;
const TTS_API_URL = process.env.TTS_API_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json()); // Parse JSON bodies (alternative method)

// ✅ Test route to check if server is running
app.get("/", (req, res) => {
  res.send("🚀 TTS Server is running...");
});

// ✅ Text-to-Speech API Route
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body; // Get text input from request body
    if (!text) {
      return res
        .status(400)
        .json({ error: "❌ Please enter text to convert!" });
    }

    console.log("✅ Sending request to Murf API...");

    const requestBody = {
      voiceId: "en-IN-eashwar", // Voice and style settings for TTS
      style: "Conversational",
      text: text,
    };

    // Send request to Murf TTS API
    const response = await axios.post(TTS_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": TTS_API_KEY,
      },
    });

    console.log("✅ Murf API Response:", response.data);
    const audioUrl = response.data.audioFile; // Get the audio URL from API response
    if (!audioUrl) {
      throw new Error("❌ Failed to generate audio");
    }

    console.log("✅ Murf Audio URL:", audioUrl);

    // Store text and audio URL in Supabase database
    const { data: dbData, error: insertError } = await supabase
      .from("tts_audio")
      .insert([{ text, audio_url: audioUrl }])
      .select("*");

    if (insertError) {
      console.error("❌ Supabase Insert Error:", insertError);
      return res.status(500).json({ error: "Error saving audio metadata" });
    }

    res.json({
      message: "✅ Audio generated successfully!",
      audioUrl,
      id: dbData[0].id, // Return inserted record ID
    });
  } catch (error) {
    console.error("❌ Murf API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate audio",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Fetch stored TTS audio history from Supabase
app.get("/history", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tts_audio").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data); // Return all audio history
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ error: "Error fetching history" });
  }
});

// ✅ Delete a specific history item by ID
app.delete("/history/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from request params
    const { error } = await supabase.from("tts_audio").delete().match({ id });

    if (error) {
      return res.status(500).json({ error: "Error deleting history item" });
    }
    res.json({ message: "✅ History item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting history item:", error);
    res.status(500).json({ error: "Error deleting history item" });
  }
});

// ✅ Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// backend, you used these technologies:

// Node.js + Express.js — For creating the RESTful API server.
// dotenv — To manage environment variables securely.
// Supabase — As a cloud database to store TTS audio data (text and audio URLs).
// axios — To make HTTP requests to the Murf TTS API.
// cors — To enable cross-origin requests (so your frontend can access the backend).
// body-parser — To parse incoming JSON requests.
