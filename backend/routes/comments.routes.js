import express from 'express';
import { getProblemComments, addComment } from '../controllers/comments.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:problemId', getProblemComments);
router.post('/', protectRoute, addComment);

export default router;
