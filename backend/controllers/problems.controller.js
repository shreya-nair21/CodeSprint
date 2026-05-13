import { Problem, Submission } from '../models.js';

//fetch all problems with pagination
export const getAllProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .select('-testCases.expectedOutput')
      .skip(skip)
      .limit(limit);
    
    let solvedProblemIds = new Set();
    if (req.user) {
      const submissions = await Submission.find({ 
        userId: req.user.id, 
        status: 'Accepted' 
      }).select('problemId');
      solvedProblemIds = new Set(submissions.map(s => s.problemId.toString()));
    }

    const problemsWithStatus = problems.map(prob => ({
      ...prob.toObject(),
      solved: solvedProblemIds.has(prob._id.toString())
    }));

    res.json({
      problems: problemsWithStatus,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
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
