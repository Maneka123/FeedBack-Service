import express from 'express';
import Feedback from '../models/feedback.model';
import { analyzeFeedback } from '../services/gemini.service';

const router = express.Router();

// Create feedback and process with Gemini AI
router.post('/', async (req, res) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // 1️⃣ Save feedback first
    const feedback = new Feedback({ title, description, category, submitterName, submitterEmail });
    await feedback.save();

    // 2️⃣ Call Gemini AI
    const aiResult = await analyzeFeedback(title, description);

    if (aiResult) {
      feedback.ai_category = aiResult.category;
      feedback.ai_sentiment = aiResult.sentiment;
      feedback.ai_priority = aiResult.priority_score;
      feedback.ai_summary = aiResult.summary;
      feedback.ai_tags = aiResult.tags || [];
      feedback.ai_processed = true;

      await feedback.save();
    }

    res.status(201).json({ success: true, data: feedback });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;