import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Create a dedicated instance for our backend
export const api = axios.create({
  baseURL: API_BASE,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  /* --------------------------------
      Request Interceptor
  --------------------------------- */
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(requestInterceptor);
  }, [token]);

  /* --------------------------------
      Response Interceptor (401 Handling)
  --------------------------------- */
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/login", { username, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Matches your RegisterDto (username, email, password)
      return await api.post("/api/v1/auth/register", userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    loading,
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};