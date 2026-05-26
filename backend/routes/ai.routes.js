import express from 'express';
import { getSocraticHint, analyzeCodeComplexity } from '../controllers/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/mentor', protectRoute, getSocraticHint);
router.post('/review', protectRoute, analyzeCodeComplexity);

export default router;
