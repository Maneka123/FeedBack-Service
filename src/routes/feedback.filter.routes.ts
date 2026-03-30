import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Admin only: filter feedback by category and/or status
router.get('/filter', adminAuth, async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const feedbackList = await Feedback.find(filter)
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
    console.error('Filter API error:', err);
    res.status(500).json({ success: false, message: 'Server error while filtering feedbacks' });
  }
});

export default router;