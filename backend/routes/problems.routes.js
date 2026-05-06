import express from 'express';
import { getAllProblems, getProblemById, createProblem } from '../controllers/problems.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', protectRoute, adminRoute, createProblem); // restricted to admin

export default router;
