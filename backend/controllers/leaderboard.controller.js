import { Submission, User } from '../models.js';

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      // Only consider accepted submissions or those with points
      { $match: { points: { $gt: 0 } } },
      
      // Group by user and problem to get the best score for each problem
      {
        $group: {
          _id: { userId: "$userId", problemId: "$problemId" },
          bestPoints: { $max: "$points" }
        }
      },
      
      // Group by user to sum their best scores
      {
        $group: {
          _id: "$_id.userId",
          totalPoints: { $sum: "$bestPoints" },
          problemsSolved: { $count: {} }
        }
      },
      
      // Sort by points descending
      { $sort: { totalPoints: -1 } },
      
      // Limit to top 50
      { $limit: 50 },
      
      // Join with User model
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      
      // Unwind user info
      { $unwind: "$userInfo" },
      
      // Project final fields
      {
        $project: {
          _id: 1,
          totalPoints: 1,
          problemsSolved: 1,
          username: "$userInfo.username",
          email: "$userInfo.email"
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
