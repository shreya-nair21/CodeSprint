import express from 'express';
import { submitCode, getUserSubmissions } from '../controllers/submissions.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, submitCode);
router.get('/', protectRoute, getUserSubmissions);

export default router;
