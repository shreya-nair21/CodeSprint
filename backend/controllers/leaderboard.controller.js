import { Submission, User } from '../models.js';

export const getLeaderboard = async (req, res) => {
  try {
    // Aggregate points from submissions per user
    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $limit: 100 // Top 100 users
      }
    ]);

    // Populate user details
    const populatedLeaderboard = await User.populate(leaderboard, {
      path: '_id',
      select: 'username'
    });

    // Format the response
    const result = populatedLeaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id._id,
      username: entry._id.username,
      totalPoints: entry.totalPoints
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
