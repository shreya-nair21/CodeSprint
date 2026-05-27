import { Problem, Submission, User } from '../models.js';

//fetch all problems with pagination
export const getAllProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const difficulty = req.query.difficulty;
    const tags = req.query.tags;

    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tags) {
      // Split by comma and find problems containing all specified tags
      query.tags = { $all: tags.split(',') };
    }

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .select('-testCases.expectedOutput')
      .skip(skip)
      .limit(limit);

    let solvedProblemIds = new Set();
    let bookmarkedProblemIds = new Set();
    if (req.user) {
      const [submissions, user] = await Promise.all([
        Submission.find({
          userId: req.user.id,
          status: 'Accepted'
        }).select('problemId'),
        User.findById(req.user.id).select('bookmarks')
      ]);
      solvedProblemIds = new Set(submissions.map(s => s.problemId.toString()));
      if (user && user.bookmarks) {
        bookmarkedProblemIds = new Set(user.bookmarks.map(id => id.toString()));
      }
    }

    const problemsWithStatus = problems.map(prob => ({
      ...prob.toObject(),
      solved: solvedProblemIds.has(prob._id.toString()),
      bookmarked: bookmarkedProblemIds.has(prob._id.toString())
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

    let bookmarked = false;
    if (req.user) {
      const user = await User.findById(req.user.id).select('bookmarks');
      if (user && user.bookmarks) {
        bookmarked = user.bookmarks.map(id => id.toString()).includes(problem._id.toString());
      }
    }

    res.json({
      ...problem.toObject(),
      bookmarked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//to create problem(accessible by admin only)
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags, editorial, testCases } = req.body;

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags: tags || [],
      editorial: editorial || '',
      testCases
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags, editorial, testCases } = req.body;

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { title, description, difficulty, tags, editorial, testCases },
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    // Delete related submissions and comments
    await Submission.deleteMany({ problemId: req.params.id });
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user.id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure bookmarks array exists
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const index = user.bookmarks.indexOf(problemId);
    let bookmarked = false;
    if (index === -1) {
      user.bookmarks.push(problemId);
      bookmarked = true;
    } else {
      user.bookmarks.splice(index, 1);
      bookmarked = false;
    }

    await user.save();
    res.json({
      bookmarked,
      message: bookmarked ? 'Problem bookmarked successfully' : 'Problem removed from bookmarks'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
