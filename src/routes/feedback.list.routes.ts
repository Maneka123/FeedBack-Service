import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// 🔐 Only admin can access
router.get('/list', adminAuth, async (_req: Request, res: Response) => {
  try {
    const feedbackList = await Feedback.find()
      .select(
        '_id title description category status ai_tags ai_processed createdAt updatedAt ai_category ai_priority ai_sentiment ai_summary'
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList
    });
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;