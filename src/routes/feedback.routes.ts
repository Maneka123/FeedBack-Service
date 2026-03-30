import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { analyzeFeedback } from '../services/gemini.service';

const router = express.Router();

// Helper function to validate input
function validateFeedbackInput(data: any) {
  const { title, description, category, submitterName, submitterEmail } = data;

  if (!title || typeof title !== 'string' || title.trim().length < 3 || title.length > 100)
    return 'Invalid title';

  if (!description || typeof description !== 'string' || description.trim().length < 10 || description.length > 1000)
    return 'Invalid description';

  if (!category || typeof category !== 'string' || category.trim().length === 0)
    return 'Invalid category';

  if (!submitterName || typeof submitterName !== 'string' || submitterName.trim().length === 0)
    return 'Invalid submitter name';

  if (!submitterEmail || typeof submitterEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail))
    return 'Invalid submitter email';

  return null; // no error
}

// Create feedback and process with Gemini AI
router.post('/', async (req: Request, res: Response) => {
  try {
    // 1️⃣ Validate input first
    const validationError = validateFeedbackInput(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { title, description, category, submitterName, submitterEmail } = req.body;

    // 2️⃣ Save feedback first
    const feedback = new Feedback({ title, description, category, submitterName, submitterEmail });
    await feedback.save();

    // 3️⃣ Call Gemini AI
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

    return res.status(201).json({ success: true, data: feedback }); // ✅ always return
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message }); // ✅ always return
  }
});

export default router;