import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { History, Clock, Database, Award, ExternalLink, Loader2, Search, Filter } from 'lucide-react';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions');
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const title = sub.problemId?.title || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'accepted' ? sub.status === 'Accepted' : sub.status !== 'Accepted');
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <History className="text-primary" size={24} />
            Submission History
          </h1>
          <p className="text-muted">Review your past attempts and track your improvement over time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Search className="text-muted" size={18} />
            <input
              type="text"
              placeholder="Search problem..."
              className="px-4 py-2 bg-surface border border-border-color rounded-lg focus:border-primary outline-none text-sm transition-colors w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-border-color">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-main'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('accepted')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'accepted' ? 'bg-success text-white shadow-lg' : 'text-muted hover:text-main'}`}
            >
              Accepted
            </button>
            <button 
              onClick={() => setFilter('failed')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'failed' ? 'bg-danger text-white shadow-lg' : 'text-muted hover:text-main'}`}
            >
              Failed
            </button>
          </div>
        </div>
      </div>

      {filteredSubmissions.length > 0 ? (
        <div className="bg-surface rounded-xl border border-border-color overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-hover border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main">Problem</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main">Runtime</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main">Memory</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main text-center">Points</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main">Submitted At</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-main text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        sub.status === 'Accepted' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-danger/10 text-danger'
                      }`}>
                        {sub.status === 'Accepted' ? 'Accepted' : sub.status || 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <Link 
                          to={`/problems/${sub.problemId?._id}`}
                          className="font-semibold text-main hover:text-primary transition-colors flex items-center gap-2"
                        >
                          {sub.problemId?.title}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className={`text-[10px] font-bold uppercase mt-1 ${
                          sub.problemId?.difficulty === 'Easy' ? 'text-success' : 
                          sub.problemId?.difficulty === 'Medium' ? 'text-warning' : 'text-danger'
                        }`}>
                          {sub.problemId?.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted font-mono">
                        <Clock size={14} />
                        {sub.executionTime ? `${sub.executionTime}s` : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted font-mono">
                        <Database size={14} />
                        {sub.memory ? `${sub.memory} MB` : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 text-accent font-bold">
                        <Award size={16} />
                        {sub.points || 0}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs text-muted">
                        {new Date(sub.createdAt).toLocaleDateString()}
                        <div className="text-[10px] opacity-60">{new Date(sub.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        to={`/problems/${sub.problemId?._id}`}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors inline-block"
                        title="View Submission"
                      >
                        <History size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border-color p-20 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-6 border border-border-color">
            <History size={32} className="text-muted opacity-30" />
          </div>
          <h3 className="text-xl font-bold mb-2">No submissions found</h3>
          <p className="text-muted mb-8 max-w-sm">
            {searchTerm 
              ? `We couldn't find any submissions matching "${searchTerm}".`
              : "You haven't submitted any code yet. Start with a problem from the library!"}
          </p>
          {!searchTerm && (
            <Link to="/problems" className="btn-primary px-8">
              Browse Problems
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Submissions;
