import express, { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// 🔐 Admin only: delete feedback by ID
router.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
      data: deletedFeedback
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