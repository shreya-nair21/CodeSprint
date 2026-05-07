import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Code2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Fetch all problems
        const response = await axios.get(`${API_URL}/api/problems`);
        setProblems(response.data);
      } catch (err) {
        setError('Failed to load problems. Please try again later.');
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //design of problem table
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'var(--accent-color)'; // Green
      case 'Medium': return '#f59e0b'; // Yellow/Orange
      case 'Hard': return 'var(--danger-color)'; // Red
      default: return 'var(--text-main)';
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Problem Library</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sharpen your skills with our collection of algorithmic challenges.</p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '150px' }}>Difficulty</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '120px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No problems found.</td>
                  </tr>
                ) : (
                  filteredProblems.map((problem) => (
                    <tr key={problem._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease' }} className="hover:bg-surface-hover">
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                        <Link to={`/problems/${problem._id}`} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Code2 size={18} style={{ color: 'var(--primary-color)' }} />
                          {problem.title}
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
                        <Link to={`/problems/${problem._id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
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
    </div>
  );
};

export default Problems;
