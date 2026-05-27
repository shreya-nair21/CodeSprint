import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trophy, Medal, Award, User, Target, Hash, Loader2 } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-500" size={24} />;
      case 1: return <Medal className="text-gray-400" size={24} />;
      case 2: return <Award className="text-amber-600" size={24} />;
      default: return <span className="font-bold text-muted">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-main flex items-center gap-2">
          <Trophy size={24} className="text-primary" />
          Leaderboard
        </h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold">
          {leaderboard.length} Developers
        </div>
      </div>

      <div className="panel">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-hover">
            <tr>
              <th className="px-6 py-4 font-bold text-main uppercase text-[11px] tracking-wider w-24">Rank</th>
              <th className="px-6 py-4 font-bold text-main uppercase text-[11px] tracking-wider">Username</th>
              <th className="px-6 py-4 font-bold text-main uppercase text-[11px] tracking-wider text-center">Problems Solved</th>
              <th className="px-6 py-4 font-bold text-main uppercase text-[11px] tracking-wider text-right">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {leaderboard.length > 0 ? (
              leaderboard.map((user, index) => (
                <tr key={user._id} className="problem-row">
                  <td className="px-6 py-4">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' : 
                      index === 1 ? 'bg-gray-400/20 text-gray-600 dark:text-gray-400' : 
                      index === 2 ? 'bg-orange-500/20 text-orange-600 dark:text-orange-500' : 'text-main'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-main">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-center text-main">
                    {user.problemsSolved}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                    {user.totalPoints.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-muted italic">
                  No submissions yet. Be the first to join the leaderboard!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
  );
};

export default Leaderboard;
