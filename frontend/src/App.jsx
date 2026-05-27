import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';
import ProblemWorkspace from './pages/ProblemWorkspace';
import Leaderboard from './pages/Leaderboard';
import Submissions from './pages/Submissions';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper" style={{ position: 'relative', overflowX: 'hidden' }}>
          {/* Delicate Interactive Grid spotlight Mesh */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 1,
            backgroundImage: `
              linear-gradient(rgba(227, 100, 54, 0.05) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(227, 100, 54, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '54px 54px',
            WebkitMaskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
            maskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
            transition: 'mask-image 0.03s ease-out, -webkit-mask-image 0.03s ease-out'
          }} />

          {/* Ambient Sunset Parallax Glow Orbs */}
          <div className="glow-orb" style={{ width: '500px', height: '500px', background: 'rgba(251, 146, 60, 0.05)', top: '-10%', left: '15%', transform: `translateY(${scrollOffset * 0.12}px) translateZ(0)` }} />
          <div className="glow-orb" style={{ width: '600px', height: '600px', background: 'rgba(219, 39, 119, 0.02)', top: '35%', right: '-5%', transform: `translateY(${scrollOffset * -0.06}px) translateZ(0)` }} />
          <div className="glow-orb" style={{ width: '400px', height: '400px', background: 'rgba(253, 224, 71, 0.02)', bottom: '5%', left: '10%', transform: `translateY(${scrollOffset * 0.04}px) translateZ(0)` }} />

          <div className="global-bg" />
          <div className="app-container">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
                <Route path="/problems/:id" element={<ProtectedRoute><ProblemWorkspace /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
