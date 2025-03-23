import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Fetch stored TTS audio history
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tts_audio2").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ error: "Error fetching history" });
  }
});

// ✅ Delete a specific history item by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("tts_audio2").delete().match({ id });

    if (error) {
      return res.status(500).json({ error: "Error deleting history item" });
    }
    res.json({ message: "✅ History item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting history item:", error);
    res.status(500).json({ error: "Error deleting history item" });
  }
});

export default router;
