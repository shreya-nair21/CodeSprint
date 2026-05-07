import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Problems from './pages/Problems';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Placeholder components for the rest of the app
const Leaderboard = () => <div className="container" style={{ padding: '2rem' }}><h1 className="text-center">Leaderboard (Coming Soon)</h1></div>;
const Submissions = () => <div className="container" style={{ padding: '2rem' }}><h1 className="text-center">My Submissions (Coming Soon)</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
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
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
