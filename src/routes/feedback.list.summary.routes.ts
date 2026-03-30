import express from 'express';
import Feedback from '../models/feedback.model';

const router = express.Router();

// GET /api/feedback/list/summary
// Returns title, description, category, and AI summary of all feedback
router.get('/', async (_req, res) => {
  try {
    const feedbackList = await Feedback.find()
      .select('title description category ai_summary')
      .sort({ createdAt: -1 }); // latest feedback first

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;