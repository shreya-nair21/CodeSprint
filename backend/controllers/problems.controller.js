import { Problem } from '../models.js';

//fetch all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-testCases.expectedOutput'); // Don't send expected outputs for all test cases
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//fetch problems through ID
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//to create problem(accessible by admin only)
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      testCases
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
