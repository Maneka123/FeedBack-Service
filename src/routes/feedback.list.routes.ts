import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Admin only: list feedbacks with pagination
router.get('/list', adminAuth, async (req: Request, res: Response) => {
  try {
    // Read page & limit from query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // 5 per page
    const skip = (page - 1) * limit;

    const total = await Feedback.countDocuments(); // total feedback count
    const feedbackList = await Feedback.find()
      .select(
        '_id title description category status ai_tags ai_processed createdAt updatedAt ai_category ai_priority ai_sentiment ai_summary'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      page,
      pages,
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