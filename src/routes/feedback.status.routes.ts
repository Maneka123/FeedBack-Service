import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Admin only: update feedback status
router.patch('/:id/status', adminAuth, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['New', 'In Progress', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select(
      '_id title description category status ai_tags ai_processed createdAt updatedAt ai_category ai_priority ai_sentiment ai_summary'
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updatedFeedback
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