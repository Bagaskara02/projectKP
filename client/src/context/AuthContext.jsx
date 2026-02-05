import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);

  // Check session on mount
  useEffect(() => {
    checkAuth();
    fetchYears();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.auth.check();
      if (res.status === 'success' && res.logged_in) {
        setUser(res.user);
      }
    } catch (e) {
      console.error('Auth check failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
    try {
      const res = await api.getYears();
      if (res.status === 'success' && res.data.length > 0) {
        setAvailableYears(res.data);
      }
    } catch (e) {
      console.error('Fetch years failed:', e);
    }
  };

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res.status === 'success') {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isLoggedIn,
      selectedYear,
      setSelectedYear,
      availableYears
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
