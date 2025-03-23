// import express from "express";
// import axios from "axios";
// import { createClient } from "@supabase/supabase-js";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// // ✅ Load environment variables
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const TTS_API_KEY = process.env.TTS_API_KEY;
// const TTS_API_URL = process.env.TTS_API_URL;
// const supabase = createClient(supabaseUrl, supabaseKey);

// // ✅ Text-to-Speech API Route
// router.post("/", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res
//         .status(400)
//         .json({ error: "❌ Please enter text to convert!" });
//     }

//     console.log("✅ Sending request to TTS API...");

//     const requestBody = {
//       voiceId: "en-IN-eashwar",
//       style: "Conversational",
//       text,
//     };

//     // Send request to TTS API
//     const response = await axios.post(TTS_API_URL, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "api-key": TTS_API_KEY,
//       },
//     });

//     console.log("✅ TTS API Response:", response.data);
//     const audioUrl = response.data.audioFile;
//     if (!audioUrl) {
//       throw new Error("❌ Failed to generate audio");
//     }

//     // Store text and audio URL in Supabase
//     const { data: dbData, error: insertError } = await supabase
//       .from("tts_audio")
//       .insert([{ text, audio_url: audioUrl }])
//       .select("*");

//     if (insertError) {
//       console.error("❌ Supabase Insert Error:", insertError);
//       return res.status(500).json({ error: "Error saving audio metadata" });
//     }

//     res.json({
//       message: "✅ Audio generated successfully!",
//       audioUrl,
//       id: dbData[0].id,
//     });
//   } catch (error) {
//     console.error("❌ TTS API Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to generate audio",
//       details: error.response?.data || error.message,
//     });
//   }
// });

// export default router;

import express from "express";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const TTS_API_KEY = process.env.TTS_API_KEY;
const TTS_API_URL = process.env.TTS_API_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Text-to-Speech API Route
router.post("/", async (req, res) => {
  try {
    const { text, voiceId, style } = req.body;

    if (!text || !voiceId || !style) {
      return res
        .status(400)
        .json({ error: "❌ Missing text, voiceId, or style!" });
    }

    console.log(
      "✅ Sending request to TTS API with voice:",
      voiceId,
      "style:",
      style
    );

    const requestBody = { voiceId, style, text };

    // Send request to TTS API
    const response = await axios.post(TTS_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": TTS_API_KEY,
      },
    });

    console.log("✅ TTS API Response:", response.data);
    const audioUrl = response.data.audioFile;
    if (!audioUrl) {
      throw new Error("❌ Failed to generate audio");
    }

    // Store text and audio URL in Supabase
    const { data: dbData, error: insertError } = await supabase
      .from("tts_audio2")
      .insert([{ text, voice_id: voiceId, style, audio_url: audioUrl }])
      .select("*");

    if (insertError) {
      console.error("❌ Supabase Insert Error:", insertError);
      return res.status(500).json({ error: "Error saving audio metadata" });
    }

    res.json({
      message: "✅ Audio generated successfully!",
      audioUrl,
      id: dbData[0].id,
    });
  } catch (error) {
    console.error("❌ TTS API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate audio",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
