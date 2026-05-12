import express from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getLeaderboard);

export default router;
