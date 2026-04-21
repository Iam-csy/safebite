import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sb_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sb_token', data.token);
    localStorage.setItem('sb_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('sb_token', data.token);
    localStorage.setItem('sb_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      localStorage.setItem('sb_user', JSON.stringify(data.user));
    } catch { logout(); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin: user?.role === 'admin', isOwner: user?.role === 'owner', isCustomer: user?.role === 'customer' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
