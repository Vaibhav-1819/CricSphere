import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:8081/api/v1/auth';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. AXIOS INTERCEPTOR (Security Upgrade) ---
  // This ensures that if the server rejects the token (expires), the app logs out instantly.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // --- 2. LOGIN LOGIC ---
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const jwtToken = response.data;

      // Atomic updates
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('username', username);
      setToken(jwtToken);
      setUser(username);
      
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials or server offline.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 3. REGISTER LOGIC ---
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/register`, { username, email, password });
      // Clean registration: immediately log them in
      return await login(username, password);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Identity may be taken.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // --- 4. LOGOUT LOGIC ---
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    // Optional: window.location.href = '/login'; 
  };

  // --- 5. PERFORMANCE OPTIMIZATION ---
  // Memoize the value to prevent unnecessary re-renders across the whole app
  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    register,
    logout,
  }), [token, user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};