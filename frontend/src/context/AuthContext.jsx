import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
//to store user data and manage authentication state
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
