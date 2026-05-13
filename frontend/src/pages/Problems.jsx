import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, Code2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/problems?page=${page}&limit=20&search=${searchQuery}`);
        setProblems(response.data.problems);
        setTotalPages(response.data.pages);
      } catch (err) {
        setError('Failed to load problems. Please try again later.');
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProblems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'var(--accent-color)';
      case 'Medium': return '#f59e0b';
      case 'Hard': return 'var(--danger-color)';
      default: return 'var(--text-main)';
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="flex justify-between items-center mb-8 gap-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-main flex items-center gap-2">
            <Code2 size={24} className="text-primary" />
            Problem Library
          </h1>
          <p className="text-sm text-muted mt-1">Sharpen your skills with our collection of algorithmic challenges.</p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading challenges...</div>
        ) : error ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={32} />
            {error}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '150px' }}>Difficulty</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '120px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No problems found.</td>
                  </tr>
                ) : (
                  problems.map((problem) => (
                    <tr key={problem._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease' }} className="hover:bg-surface-hover">
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                        <Link to={`/problems/${problem._id}`} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="flex items-center gap-2">
                            {problem.solved ? (
                              <CheckCircle2 size={18} className="text-accent" />
                            ) : (
                              <Code2 size={18} style={{ color: 'var(--primary-color)' }} />
                            )}
                            {problem.title}
                          </div>
                        </Link>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          color: getDifficultyColor(problem.difficulty),
                          background: `${getDifficultyColor(problem.difficulty)}15`, // 15 is hex alpha (~8%)
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <Link to={`/problems/${problem._id}`} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                          Solve
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn-secondary"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-muted">
          Page <span className="text-main font-bold">{page}</span> of {totalPages}
        </span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Problems;
