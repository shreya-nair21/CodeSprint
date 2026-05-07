import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Terminal, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex justify-between items-center" style={{ height: '64px' }}>
        <div className="flex items-center" style={{ gap: '2rem' }}>
          <Link to="/" className="flex items-center" style={{ gap: '0.5rem', color: 'var(--text-main)', fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            <Terminal size={20} />
            CodeSprint
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center" style={{ gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <Link to="/problems" className="hover:text-main">Problems</Link>
            <Link to="/leaderboard" className="hover:text-main">Leaderboard</Link>
          </div>
        </div>
        
        <div className="flex items-center" style={{ gap: '1.5rem', fontSize: '0.9rem' }}>
          {user ? (
            <>
              <Link to="/submissions" style={{ color: 'var(--text-muted)' }}>Submissions</Link>
              <div className="flex items-center" style={{ gap: '1.25rem', paddingLeft: '1.25rem', borderLeft: '1px solid var(--border-color)' }}>
                <span className="flex items-center" style={{ gap: '0.5rem', color: 'var(--text-main)' }}>
                  <User size={16} />
                  {user.username}
                </span>
                <button onClick={handleLogout} className="flex items-center" style={{ gap: '0.5rem', color: 'var(--text-muted)', background: 'transparent' }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-muted)' }}>Sign in</Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
