import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Award,
  ChevronRight,
  Loader2,
  TrendingUp,
  Target
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-surface p-6 rounded-xl border border-border-color shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-muted uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-bold text-main">{value}</div>
    </div>
  );

  const ProgressRing = ({ current, total, label, color }) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48" cy="48" r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              style={{ opacity: 0.1 }}
              className="text-main"
            />
            <circle
              cx="48" cy="48" r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              className={`text-${color} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-main">{current}</span>
            <span className="text-[10px] text-muted">/{total}</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted">{label}</span>
      </div>
    );
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Profile info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface rounded-2xl border border-border-color p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border-4 border-surface shadow-lg">
                <UserIcon size={48} />
              </div>
              <h2 className="text-2xl font-bold text-main">{user?.username}</h2>
              <p className="text-muted text-sm mb-6">Software Engineer</p>
              
              <div className="w-full space-y-4 pt-6 border-t border-border-color">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Calendar size={16} />
                  <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button className="w-full mt-8 btn-secondary text-sm font-semibold transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border-color p-6 shadow-sm">
            <h3 className="text-sm font-bold text-main uppercase tracking-widest mb-6 flex items-center gap-2">
              <Award size={16} className="text-primary" /> Achievements
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-full bg-surface-hover border border-border-color flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Locked Achievement">
                  <Trophy size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Solved" value={stats?.totalSolved} icon={CheckCircle2} color="accent" />
            <StatCard title="Global Points" value={stats?.totalPoints} icon={Target} color="primary" />
            <StatCard title="Accuracy" value="84%" icon={TrendingUp} color="orange" />
          </div>

          {/* Difficulty Breakdown */}
          <div className="bg-surface rounded-2xl border border-border-color p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-main">Solved Problems</h3>
              <div className="text-sm text-muted font-medium">
                Total: <span className="text-main font-bold">{stats?.totalSolved}</span> / {stats?.totalProblems}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
              <ProgressRing current={stats?.easySolved} total={stats?.easyCount} label="Easy" color="accent" />
              <ProgressRing current={stats?.mediumSolved} total={stats?.mediumCount} label="Medium" color="orange" />
              <ProgressRing current={stats?.hardSolved} total={stats?.hardCount} label="Hard" color="danger" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-2xl border border-border-color overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-color flex justify-between items-center">
              <h3 className="text-lg font-bold text-main">Recent Activity</h3>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="divide-y divide-border-color">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-4 hover:bg-surface-hover transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${activity.status === 'Accepted' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>
                        {activity.status === 'Accepted' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-main group-hover:text-primary transition-colors">{activity.problemTitle}</div>
                        <div className="text-[10px] text-muted uppercase font-bold tracking-wider">{new Date(activity.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-bold text-main">+{activity.points || 0} pts</div>
                      <ChevronRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted">
                  <Clock size={48} className="mx-auto mb-4 opacity-10" />
                  <p>No recent activity found.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
