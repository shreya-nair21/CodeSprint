import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  location: { type: String, default: '' },
  company: { type: String, default: '' },
  website: { type: String, default: '' },
  name: { type: String, default: '' },
  birthday: { type: Date },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  createdAt: { type: Date, default: Date.now }
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  editorial: { type: String, default: '' },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  languageId: { type: Number, required: true },
  status: { type: String, required: true }, // e.g., 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'
  executionTime: { type: Number },
  memory: { type: Number },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Problem = mongoose.model('Problem', problemSchema);
const Submission = mongoose.model('Submission', submissionSchema);
const Comment = mongoose.model('Comment', commentSchema);

export { User, Problem, Submission, Comment };
