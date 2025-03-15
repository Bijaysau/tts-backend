// import express from "express";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import axios from "axios";
// import { fileURLToPath } from "url";
// import { v4 as uuidv4 } from "uuid";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Supabase Setup
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // OpenAI API Key
// const OPENAI_API_KEY = process.env.TTS_API_KEY;
// const OPENAI_TTS_URL = process.env.TTS_API_URL;

// // Directory Setup for Storing Audio Files
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const AUDIO_DIR = path.join(__dirname, "audio");

// if (!fs.existsSync(AUDIO_DIR)) {
//   fs.mkdirSync(AUDIO_DIR);
// }

// app.use(cors());
// app.use(express.json());
// app.use("/audio", express.static(AUDIO_DIR)); // Serve audio files

// // Test Route
// app.get("/", (req, res) => {
//   res.send("TTS Server is Running!");
// });

// // TTS Conversion Endpoint
// app.post("/convert", async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "Text is required" });
//     }

//     // Call OpenAI TTS API
//     const response = await axios.post(
//       OPENAI_TTS_URL,
//       {
//         model: "tts-1",
//         input: text,
//         voice: "alloy", // Change to "echo", "fable", etc. if needed
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer", // Get audio as binary data
//       }
//     );

//     // Save Audio File
//     const audioFileName = `${uuidv4()}.mp3`;
//     const audioFilePath = path.join(AUDIO_DIR, audioFileName);
//     fs.writeFileSync(audioFilePath, response.data);

//     const audioUrl = `http://localhost:${PORT}/audio/${audioFileName}`;

//     // Store in Supabase
//     const { data, error } = await supabase
//       .from("tts_audio")
//       .insert([{ text, audio_url: audioUrl }]);

//     if (error) {
//       console.error("Supabase Insert Error:", error.message);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json({ success: true, audio_url: audioUrl, data });
//   } catch (error) {
//     console.error("TTS API Error:", error.response?.data || error.message);
//     res.status(500).json({ error: "TTS API Error" });
//   }
// });

// // Fetch History from Supabase
// app.get("/history", async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("tts_audio")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Supabase Fetch Error:", error.message);
//       return res.status(500).json({ error: "Failed to fetch history" });
//     }

//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching history:", error.message);
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

//************************************************************************************************************************************** */

// import express from "express";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";
// import cors from "cors";
// import axios from "axios";
// import bodyParser from "body-parser";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Supabase setup
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// // Function to add delay before API request
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Test Route
// app.get("/", (req, res) => {
//   res.send("TTS Server is running...");
// });

// // Text-to-Speech API Route
// app.post("/tts", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "Text is required" });
//     }

//     const TTS_API_KEY = process.env.TTS_API_KEY;
//     const TTS_API_URL = process.env.TTS_API_URL;

//     if (!TTS_API_KEY || !TTS_API_URL) {
//       return res
//         .status(500)
//         .json({ error: "TTS API credentials are missing." });
//     }

//     await delay(2000); // 🔴 Wait 2 seconds to prevent 429 error

//     // Call OpenAI TTS API
//     const response = await axios.post(
//       TTS_API_URL,
//       {
//         input: text,
//         model: "tts-1",
//         voice: "alloy", // Change this if needed
//         response_format: "mp3",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${TTS_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer",
//       }
//     );

//     // Save the audio file in Supabase storage
//     const filePath = `tts_audio/${Date.now()}.mp3`;
//     const { data, error } = await supabase.storage
//       .from("tts_audio")
//       .upload(filePath, response.data, { contentType: "audio/mpeg" });

//     if (error) {
//       console.error("Supabase Storage Error:", error);
//       return res.status(500).json({ error: "Failed to save audio file" });
//     }

//     const audioUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`;

//     // Save metadata to Supabase database
//     const { data: dbData, error: insertError } = await supabase
//       .from("tts_audio")
//       .insert([{ text, audio_url: audioUrl }]);

//     if (insertError) {
//       console.error("Supabase Insert Error:", insertError);
//       return res.status(500).json({ error: "Error saving audio metadata" });
//     }

//     res.json({ message: "Audio generated successfully!", audioUrl });
//   } catch (error) {
//     console.error("TTS API Error:", error);
//     res
//       .status(500)
//       .json({ error: "TTS API request failed", details: error.message });
//   }
// });

// // Fetch stored TTS audio history
// app.get("/history", async (req, res) => {
//   try {
//     const { data, error } = await supabase.from("tts_audio").select("*");
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching history:", error);
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

//************************************************************************************************************************************** */
// import express from "express";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";
// import cors from "cors";
// import axios from "axios";
// import bodyParser from "body-parser";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Supabase setup
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const TTS_API_KEY = process.env.TTS_API_KEY;
// const TTS_API_URL = process.env.TTS_API_URL;
// const supabase = createClient(supabaseUrl, supabaseKey);

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// // ✅ Function to add delay before API request
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("🚀 TTS Server is running...");
// });

// // ✅ Text-to-Speech API Route
// app.post("/tts", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "❌ Text is required" });
//     }

//     // ✅ Check if API keys are available

//     if (!TTS_API_KEY || !TTS_API_URL) {
//       console.error("❌ Missing API credentials!");
//       return res
//         .status(500)
//         .json({ error: "TTS API credentials are missing." });
//     }

//     console.log("✅ API Keys Loaded!");

//     await delay(2000); // 🔴 Wait 2 seconds to prevent 429 error

//     // ✅ Call OpenAI TTS API
//     const response = await axios.post(
//       TTS_API_URL,
//       {
//         input: text,
//         model: "tts-1",
//         voice: "alloy", // Change this if needed
//         response_format: "mp3",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${TTS_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         responseType: "arraybuffer",
//       }
//     );

//     console.log("✅ OpenAI TTS API Response Received");

//     // ✅ Convert and Log the Response (for Debugging)
//     console.log("🟢 OpenAI API Response Buffer Length:", response.data.length);

//     // ✅ Save the audio file in Supabase storage
//     const filePath = `tts_audio/${Date.now()}.mp3`;
//     const { data, error } = await supabase.storage
//       .from("tts_audio")
//       .upload(filePath, response.data, { contentType: "audio/mpeg" });

//     if (error) {
//       console.error("❌ Supabase Storage Error:", error);
//       return res.status(500).json({ error: "Failed to save audio file" });
//     }

//     // ✅ Get Public URL
//     const { data: publicUrlData } = supabase.storage
//       .from("tts_audio")
//       .getPublicUrl(filePath);

//     if (!publicUrlData) {
//       console.error("❌ Failed to get public URL from Supabase");
//       return res.status(500).json({ error: "Failed to retrieve audio URL" });
//     }

//     const audioUrl = publicUrlData.publicUrl;
//     console.log("✅ Audio File Saved at:", audioUrl);

//     // ✅ Save metadata to Supabase database
//     const { data: dbData, error: insertError } = await supabase
//       .from("tts_audio")
//       .insert([{ text, audio_url: audioUrl }]);

//     if (insertError) {
//       console.error("❌ Supabase Insert Error:", insertError);
//       return res.status(500).json({ error: "Error saving audio metadata" });
//     }

//     res.json({ message: "✅ Audio generated successfully!", audioUrl });
//   } catch (error) {
//     console.error(
//       "❌ TTS API Error:",
//       error.response?.data?.toString() || error.message
//     );
//     res.status(500).json({
//       error: "TTS API request failed",
//       details: error.response?.data?.toString() || error.message,
//     });
//   }
// });

// // ✅ Fetch stored TTS audio history
// app.get("/history", async (req, res) => {
//   try {
//     const { data, error } = await supabase.from("tts_audio").select("*");
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error fetching history:", error);
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

//********************************************************************************************************* */

// import express from "express";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";
// import cors from "cors";
// import axios from "axios";
// import bodyParser from "body-parser";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Load environment variables
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const TTS_API_KEY = process.env.TTS_API_KEY;
// const TTS_API_URL = process.env.TTS_API_URL;
// const supabase = createClient(supabaseUrl, supabaseKey);

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("🚀 TTS Server is running...");
// });

// // ✅ Text-to-Speech API Route
// app.post("/tts", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "❌ Text is required" });
//     }

//     console.log("✅ Sending request to Murf API...");

//     // ✅ Murf API request body
//     const requestBody = {
//       voiceId: "en-IN-eashwar",
//       style: "Conversational",
//       text: text,
//     };

//     // ✅ Send request to Murf API
//     const response = await axios.post(TTS_API_URL, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "api-key": TTS_API_KEY, // ✅ Correct API key header
//       },
//     });

//     console.log("✅ Murf API Response:", response.data);

//     // ✅ Extract correct audio URL
//     const audioUrl = response.data.audioFile; // ✅ Corrected key name
//     if (!audioUrl) {
//       throw new Error("❌ Failed to generate audio");
//     }

//     console.log("✅ Murf Audio URL:", audioUrl);

//     // ✅ Save metadata to Supabase database
//     const { data: dbData, error: insertError } = await supabase
//       .from("tts_audio")
//       .insert([{ text, audio_url: audioUrl }]);

//     if (insertError) {
//       console.error("❌ Supabase Insert Error:", insertError);
//       return res.status(500).json({ error: "Error saving audio metadata" });
//     }

//     res.json({ message: "✅ Audio generated successfully!", audioUrl });
//   } catch (error) {
//     console.error("❌ Murf API Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to generate audio",
//       details: error.response?.data || error.message,
//     });
//   }
// });

// // ✅ Fetch stored TTS audio history
// app.get("/history", async (req, res) => {
//   try {
//     const { data, error } = await supabase.from("tts_audio").select("*");
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error fetching history:", error);
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// import express from "express";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";
// import cors from "cors";
// import axios from "axios";
// import bodyParser from "body-parser";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Load environment variables
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const TTS_API_KEY = process.env.TTS_API_KEY;
// const TTS_API_URL = process.env.TTS_API_URL;
// const supabase = createClient(supabaseUrl, supabaseKey);

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("🚀 TTS Server is running...");
// });

// // ✅ Text-to-Speech API Route
// app.post("/tts", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "❌ Text is required" });
//     }

//     console.log("✅ Sending request to Murf API...");

//     // ✅ Murf API request body
//     const requestBody = {
//       voiceId: "en-IN-eashwar",
//       style: "Conversational",
//       text: text,
//     };

//     // ✅ Send request to Murf API
//     const response = await axios.post(TTS_API_URL, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "api-key": TTS_API_KEY, // ✅ Correct API key header
//       },
//     });

//     console.log("✅ Murf API Response:", response.data);

//     // ✅ Extract correct audio URL
//     const audioUrl = response.data.audioFile; // ✅ Corrected key name
//     if (!audioUrl) {
//       throw new Error("❌ Failed to generate audio");
//     }

//     console.log("✅ Murf Audio URL:", audioUrl);

//     // ✅ Save metadata to Supabase database
//     const { data: dbData, error: insertError } = await supabase
//       .from("tts_audio")
//       .insert([{ text, audio_url: audioUrl }])
//       .select("*");

//     if (insertError) {
//       console.error("❌ Supabase Insert Error:", insertError);
//       return res.status(500).json({ error: "Error saving audio metadata" });
//     }

//     res.json({ message: "✅ Audio generated successfully!", audioUrl, id: dbData[0].id });
//   } catch (error) {
//     console.error("❌ Murf API Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to generate audio",
//       details: error.response?.data || error.message,
//     });
//   }
// });

// // ✅ Fetch stored TTS audio history
// app.get("/history", async (req, res) => {
//   try {
//     const { data, error } = await supabase.from("tts_audio").select("*");
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error fetching history:", error);
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// // ✅ Delete a specific history item
// app.delete("/history/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error } = await supabase.from("tts_audio").delete().match({ id });

//     if (error) {
//       return res.status(500).json({ error: "Error deleting history item" });
//     }
//     res.json({ message: "✅ History item deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting history item:", error);
//     res.status(500).json({ error: "Error deleting history item" });
//   }
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// import express from "express";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";
// import cors from "cors";
// import axios from "axios";
// import bodyParser from "body-parser";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Load environment variables
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const TTS_API_KEY = process.env.TTS_API_KEY;
// const TTS_API_URL = process.env.TTS_API_URL;
// const supabase = createClient(supabaseUrl, supabaseKey);

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("🚀 TTS Server is running...");
// });

// // ✅ Text-to-Speech API Route
// app.post("/tts", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res
//         .status(400)
//         .json({ error: "❌ Please enter text to convert!" });
//     }

//     console.log("✅ Sending request to Murf API...");

//     const requestBody = {
//       voiceId: "en-IN-eashwar",
//       style: "Conversational",
//       text: text,
//     };

//     const response = await axios.post(TTS_API_URL, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "api-key": TTS_API_KEY,
//       },
//     });

//     console.log("✅ Murf API Response:", response.data);
//     const audioUrl = response.data.audioFile;
//     if (!audioUrl) {
//       throw new Error("❌ Failed to generate audio");
//     }

//     console.log("✅ Murf Audio URL:", audioUrl);

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
//     console.error("❌ Murf API Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to generate audio",
//       details: error.response?.data || error.message,
//     });
//   }
// });

// // ✅ Fetch stored TTS audio history
// app.get("/history", async (req, res) => {
//   try {
//     const { data, error } = await supabase.from("tts_audio").select("*");
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error("❌ Error fetching history:", error);
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// // ✅ Delete a specific history item
// app.delete("/history/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error } = await supabase.from("tts_audio").delete().match({ id });

//     if (error) {
//       return res.status(500).json({ error: "Error deleting history item" });
//     }
//     res.json({ message: "✅ History item deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting history item:", error);
//     res.status(500).json({ error: "Error deleting history item" });
//   }
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

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
