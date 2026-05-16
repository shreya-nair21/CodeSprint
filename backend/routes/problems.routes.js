import express from 'express';
import { getAllProblems, getProblemById, createProblem, updateProblem, deleteProblem } from '../controllers/problems.controller.js';
import { protectRoute, adminRoute, optionalProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalProtect, getAllProblems);
router.get('/:id', getProblemById);
router.post('/', protectRoute, adminRoute, createProblem); // restricted to admin
router.put('/:id', protectRoute, adminRoute, updateProblem); // restricted to admin
router.delete('/:id', protectRoute, adminRoute, deleteProblem); // restricted to admin

export default router;
