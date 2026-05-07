import { Link } from 'react-router-dom';
import { Terminal, Code2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '6rem 1rem' }}>
      <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-gradient" style={{ fontSize: '4.5rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
          Master Your Code.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          CodeSprint is the modern platform for developers to practice algorithms, prepare for interviews, and compete globally.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user ? (
            <Link to="/problems" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
              Start Coding
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                Start for free
              </Link>
              <Link to="/login" className="panel" style={{ color: 'var(--text-main)', padding: '0.8rem 2rem', fontSize: '1.1rem', background: 'transparent' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
        <div className="panel" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}><Code2 size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Extensive Library</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Hundreds of data structure and algorithm challenges designed to test your limits.</p>
        </div>
        <div className="panel" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}><Terminal size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>In-Browser IDE</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Write, test, and submit your code instantly with our integrated Monaco editor and JDoodle backend.</p>
        </div>
        <div className="panel" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}><Zap size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Global Leaderboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Earn points for optimal solutions and see how you rank against developers worldwide.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
