import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('medimundo_token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.get('/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('medimundo_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    const { access_token } = res.data;
    localStorage.setItem('medimundo_token', access_token);
    setToken(access_token);
    const meRes = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(meRes.data);
    return meRes.data;
  };

  const logout = () => {
    localStorage.removeItem('medimundo_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
