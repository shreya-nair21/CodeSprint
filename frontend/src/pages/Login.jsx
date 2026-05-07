import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center" style={{ justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div className="flex items-center" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <Terminal size={40} color="var(--text-main)" />
        </div>
        <h2 className="text-center mb-6" style={{ fontSize: '1.75rem', fontWeight: '600', letterSpacing: '-0.02em' }}>Welcome back</h2>
        
        {error && <div style={{ color: 'var(--danger-color)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary mt-4" style={{ padding: '0.75rem', fontSize: '0.95rem', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--text-main)', fontWeight: '500' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
