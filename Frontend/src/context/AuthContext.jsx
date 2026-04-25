import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setError(null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(token);
      setUser(data);
      setError(null);
      toast.success('Login successful');
      return { token, user: data };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      const { token, data } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(token);
      setUser(data);
      setError(null);
      toast.success('Registration successful');
      return { token, user: data };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await api.patch('/auth/profile', profileData);
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      toast.success('Profile updated');
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Update failed');
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        error,
        login,
        register,
        logout,
        updateProfile,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
