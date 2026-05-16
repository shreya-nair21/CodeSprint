import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Edit2, Trash2, Code2, AlertCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, totalSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: '',
    editorial: '',
    testCases: '[\n  {\n    "input": "",\n    "expectedOutput": ""\n  }\n]'
  });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const [problemsRes, statsRes] = await Promise.all([
        api.get('/problems?limit=100'),
        api.get('/admin/stats')
      ]);
      setProblems(problemsRes.data.problems);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (problem) => {
    setIsEditing(true);
    setCurrentProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags ? problem.tags.join(', ') : '',
      editorial: problem.editorial || '',
      testCases: JSON.stringify(problem.testCases, null, 2)
    });
  };

  const confirmDelete = async () => {
    if (!problemToDelete) return;
    try {
      await api.delete(`/problems/${problemToDelete}`);
      setProblemToDelete(null);
      fetchProblems();
    } catch (err) {
      console.error('Failed to delete problem:', err);
      setError('Failed to delete problem');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let parsedTestCases;
    try {
      parsedTestCases = JSON.parse(formData.testCases);
      if (!Array.isArray(parsedTestCases)) throw new Error('Test cases must be an array');
    } catch (err) {
      setError('Invalid JSON for Test Cases. It must be an array of objects.');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      editorial: formData.editorial,
      testCases: parsedTestCases
    };

    try {
      if (isEditing) {
        await api.put(`/problems/${currentProblem._id}`, payload);
      } else {
        await api.post('/problems', payload);
      }
      setIsEditing(false);
      setCurrentProblem(null);
      setFormData({
        title: '',
        description: '',
        difficulty: 'Easy',
        tags: '',
        editorial: '',
        testCases: '[\n  {\n    "input": "",\n    "expectedOutput": ""\n  }\n]'
      });
      fetchProblems();
    } catch (err) {
      console.error('Failed to save problem:', err);
      setError(err.response?.data?.message || 'Failed to save problem');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-main flex items-center gap-2">
          <Code2 size={24} className="text-primary" />
          Admin Dashboard - Manage Problems
        </h1>
        {!isEditing && (
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setIsEditing(true);
              setCurrentProblem(null);
              setFormData({
                title: '',
                description: '',
                difficulty: 'Easy',
                tags: '',
                editorial: '',
                testCases: '[\n  {\n    "input": "",\n    "expectedOutput": ""\n  }\n]'
              });
            }}
          >
            <Plus size={16} /> Add New Problem
          </button>
        )}
      </div>

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface border border-border-color rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="text-muted text-sm font-bold uppercase tracking-widest mb-2">Total Problems</span>
            <span className="text-4xl font-bold text-main">{stats.totalProblems}</span>
          </div>
          <div className="bg-surface border border-border-color rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="text-muted text-sm font-bold uppercase tracking-widest mb-2">Total Users</span>
            <span className="text-4xl font-bold text-primary">{stats.totalUsers}</span>
          </div>
          <div className="bg-surface border border-border-color rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="text-muted text-sm font-bold uppercase tracking-widest mb-2">Total Submissions</span>
            <span className="text-4xl font-bold text-accent">{stats.totalSubmissions}</span>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="panel" style={{ padding: '2rem' }}>
          <h2 className="text-xl font-bold mb-6">{currentProblem ? 'Edit Problem' : 'Create New Problem'}</h2>
          
          {error && (
            <div className="mb-4 p-4 rounded bg-danger/10 text-danger border border-danger/20 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  className="w-full bg-surface-hover border border-border-color rounded p-2 focus:border-primary outline-none"
                  value={formData.title} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select 
                  name="difficulty" 
                  className="w-full bg-surface-hover border border-border-color rounded p-2 focus:border-primary outline-none"
                  value={formData.difficulty} 
                  onChange={handleInputChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                name="tags" 
                placeholder="e.g. Arrays, Dynamic Programming"
                className="w-full bg-surface-hover border border-border-color rounded p-2 focus:border-primary outline-none"
                value={formData.tags} 
                onChange={handleInputChange} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (Markdown supported)</label>
              <textarea 
                name="description" 
                required 
                rows={6}
                className="w-full bg-surface-hover border border-border-color rounded p-2 focus:border-primary outline-none font-mono text-sm"
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Editorial (Markdown supported)</label>
              <textarea 
                name="editorial" 
                rows={6}
                className="w-full bg-surface-hover border border-border-color rounded p-2 focus:border-primary outline-none font-mono text-sm"
                value={formData.editorial} 
                onChange={handleInputChange} 
                placeholder="Explain the optimal solution here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Test Cases (JSON array)</label>
              <textarea 
                name="testCases" 
                required 
                rows={8}
                className="w-full bg-surface-hover border border-border-color rounded p-2 focus:border-primary outline-none font-mono text-sm"
                value={formData.testCases} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button type="submit" className="btn-primary">Save Problem</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentProblem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div className="p-12 flex justify-center text-muted"><Loader2 className="animate-spin" size={32} /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-black/5">
                  <th className="p-4 font-bold text-sm uppercase tracking-wider">Title</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider">Difficulty</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((prob) => (
                  <tr key={prob._id} className="border-b border-border-color hover:bg-surface-hover transition-colors">
                    <td className="p-4 font-medium">{prob.title}</td>
                    <td className="p-4">
                      <span className={`badge badge-${prob.difficulty.toLowerCase()}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-3">
                      <button onClick={() => handleEdit(prob)} className="icon-btn icon-btn-primary" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setProblemToDelete(prob._id)} className="icon-btn icon-btn-danger" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {problems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted">No problems found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {problemToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" style={{ backdropFilter: 'blur(4px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-surface border border-border-color p-6 rounded-xl max-w-md w-full shadow-2xl" style={{ backgroundColor: 'var(--surface-color)', margin: '1rem' }}>
            <div className="flex items-center gap-3 text-danger mb-4" style={{ color: 'var(--danger-color)' }}>
              <AlertCircle size={24} />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-muted mb-6" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to delete this problem? This action cannot be undone and will delete all associated submissions.
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setProblemToDelete(null)}>Cancel</button>
              <button 
                className="btn-primary" 
                style={{ backgroundColor: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                onClick={confirmDelete}
              >
                Delete Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
