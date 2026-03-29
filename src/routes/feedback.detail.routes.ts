import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Admin only: get feedback by ID
router.get('/:id', adminAuth, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id).select(
      '_id title description category status ai_tags ai_processed createdAt updatedAt ai_category ai_priority ai_sentiment ai_summary'
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;