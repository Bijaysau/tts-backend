import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import ttsRoutes from "./routes/ttsRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Routes
app.use("/tts", ttsRoutes);
app.use("/history", historyRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 TTS Server is running...");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
