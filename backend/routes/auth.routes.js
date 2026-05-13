import express from 'express';
import { registerUser, loginUser, getMe, getUserStats } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protectRoute, getMe);
router.get('/stats', protectRoute, getUserStats);

export default router;
