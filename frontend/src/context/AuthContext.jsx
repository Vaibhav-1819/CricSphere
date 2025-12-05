import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:8081/api/v1/auth';

export const AuthProvider = ({ children }) => {
  // Try to get token and username from storage on load
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. Login Function ---
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      
      const jwtToken = response.data;

      // Store token and username
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('username', username);
      
      setToken(jwtToken);
      setUser(username);
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data || "Login failed. Check credentials/server.";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Register Function ---
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/register`, { username, email, password });
      
      // Attempt login immediately after successful registration
      if (response.status === 200) {
        return await login(username, password);
      }
      return false;
    } catch (err) {
      const errorMessage = err.response?.data || "Registration failed. Username/Email may be taken.";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Logout Function ---
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
  };
  
  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);