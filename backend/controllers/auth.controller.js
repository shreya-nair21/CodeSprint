import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Submission, Problem } from '../models.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

//controller for registering a user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10); //generates salt to hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//controller for login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//controller for getting current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controller for getting user stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all submissions by the user, populated with problem details
    const submissions = await Submission.find({ userId }).populate('problemId');

    // Get unique solved problems
    const solvedProblems = new Map();
    submissions.forEach(sub => {
      if (sub.status === 'Accepted') {
        const probId = sub.problemId?._id?.toString();
        if (probId && !solvedProblems.has(probId)) {
          solvedProblems.set(probId, sub.problemId);
        }
      }
    });

    // Count by difficulty
    const stats = {
      totalSolved: solvedProblems.size,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalPoints: 0,
      recentActivity: submissions.slice(0, 10).map(s => ({
        problemTitle: s.problemId?.title || 'Unknown Problem',
        status: s.status,
        createdAt: s.createdAt,
        points: s.points
      }))
    };

    solvedProblems.forEach(prob => {
      if (prob.difficulty === 'Easy') stats.easySolved++;
      else if (prob.difficulty === 'Medium') stats.mediumSolved++;
      else if (prob.difficulty === 'Hard') stats.hardSolved++;
    });

    // Total points (sum of all points from submissions)
    stats.totalPoints = submissions.reduce((sum, s) => sum + (s.points || 0), 0);

    // Calculate heatmap activity (submissions per day)
    const heatmapMap = new Map();
    submissions.forEach(sub => {
      if (sub.createdAt) {
        const dateStr = new Date(sub.createdAt).toISOString().split('T')[0];
        heatmapMap.set(dateStr, (heatmapMap.get(dateStr) || 0) + 1);
      }
    });

    stats.heatmap = Array.from(heatmapMap.entries()).map(([date, count]) => ({
      date,
      count
    }));

    // Get total counts of problems in system for "X of Y" display
    const easyCount = await Problem.countDocuments({ difficulty: 'Easy' });
    const mediumCount = await Problem.countDocuments({ difficulty: 'Medium' });
    const hardCount = await Problem.countDocuments({ difficulty: 'Hard' });
    const totalProblems = easyCount + mediumCount + hardCount;

    // Fetch user's bookmarked problems
    const userWithBookmarks = await User.findById(userId).populate('bookmarks', 'title difficulty');
    const bookmarks = userWithBookmarks && userWithBookmarks.bookmarks ? userWithBookmarks.bookmarks : [];

    res.json({
      ...stats,
      bookmarks,
      totalProblems,
      easyCount,
      mediumCount,
      hardCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// controller for updating user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePic, location, company, website, name, birthday, linkedin, github } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.username = username || user.username;
      user.bio = bio !== undefined ? bio : user.bio;
      user.profilePic = profilePic !== undefined ? profilePic : user.profilePic;
      user.location = location !== undefined ? location : user.location;
      user.company = company !== undefined ? company : user.company;
      user.website = website !== undefined ? website : user.website;
      user.name = name !== undefined ? name : user.name;
      user.birthday = birthday ? birthday : (birthday === '' ? null : user.birthday);
      user.linkedin = linkedin !== undefined ? linkedin : user.linkedin;
      user.github = github !== undefined ? github : user.github;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
        location: updatedUser.location,
        company: updatedUser.company,
        website: updatedUser.website,
        name: updatedUser.name,
        birthday: updatedUser.birthday,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
