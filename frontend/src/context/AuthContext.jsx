import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = "http://localhost:8081/api/v1/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ----------------------------------------
     Attach token to every axios request
  ----------------------------------------- */
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);

  /* ----------------------------------------
     Auto logout if token expires
  ----------------------------------------- */
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  /* ----------------------------------------
     Login
  ----------------------------------------- */
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });

      const { token, user } = res.data;   // BACKEND SHOULD RETURN BOTH

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid credentials or server offline.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     Register
  ----------------------------------------- */
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/register`, { username, email, password });
      return await login(username, password);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     Logout
  ----------------------------------------- */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
