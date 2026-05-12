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
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
        <p className="text-muted text-lg">Top performers in the CodeSprint community</p>
      </div>

      <div className="panel overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto">
          <table className="submissions-table">
            <thead>
              <tr>
                <th className="w-20 text-center"><Hash size={14} className="inline mr-1" /> Rank</th>
                <th><User size={14} className="inline mr-1" /> User</th>
                <th className="text-center"><Target size={14} className="inline mr-1" /> Solved</th>
                <th className="text-right"><Trophy size={14} className="inline mr-1" /> Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <tr key={user._id} className={index < 3 ? 'bg-surface-hover/30' : ''}>
                    <td className="text-center">
                      <div className="flex items-center justify-center h-10 w-10 mx-auto">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-600' : 'bg-primary'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-main">{user.username}</span>
                        {index === 0 && <span className="badge badge-easy text-[10px] py-0.5 px-1.5">Top Coder</span>}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="font-mono text-main">{user.problemsSolved}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-lg font-bold text-accent font-mono">{user.totalPoints}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-muted italic">
                    No submissions found. Be the first to top the leaderboard!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Community Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="panel p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-primary" size={24} />
          </div>
          <h3 className="text-2xl font-bold">{leaderboard.length}</h3>
          <p className="text-sm text-muted">Active Users</p>
        </div>
        <div className="panel p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-accent" size={24} />
          </div>
          <h3 className="text-2xl font-bold">{leaderboard.reduce((acc, curr) => acc + curr.totalPoints, 0)}</h3>
          <p className="text-sm text-muted">Total Points Awarded</p>
        </div>
        <div className="panel p-6 text-center">
          <div className="w-12 h-12 bg-secondary-color/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-secondary-color" size={24} />
          </div>
          <h3 className="text-2xl font-bold">{leaderboard.reduce((acc, curr) => acc + curr.problemsSolved, 0)}</h3>
          <p className="text-sm text-muted">Challenges Conquered</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
