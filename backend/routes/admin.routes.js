import express from 'express';
import { User, Problem, Submission } from '../models.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', protectRoute, adminRoute, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    
    res.json({
      totalUsers,
      totalProblems,
      totalSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
