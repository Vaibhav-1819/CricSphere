import axios from "axios";

/**
 * INTELLIGENT BASE URL:
 * Prioritizes Vercel Environment Variables, then falls back to Localhost.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* --- INTERCEPTORS: Identity Management --- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

/* --- INTERCEPTORS: Session Guard --- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If JWT expires (401), clean up local storage and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Use replace to prevent back-button loops
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

/* --- MODULAR SERVICE MODULES --- */
export const authApi = {
  login: (credentials) => api.post("/api/v1/auth/login", credentials),
  register: (userData) => api.post("/api/v1/auth/register", userData),
};

export const matchApi = {
  getLive: () => api.get("/api/v1/cricket/live"),
  getUpcoming: () => api.get("/api/v1/cricket/upcoming"),
  getRecent: () => api.get("/api/v1/cricket/recent"),
  getMatchDetail: (id) => api.get(`/api/v1/cricket/match/${id}`),
  getScorecard: (id) => api.get(`/api/v1/cricket/scorecard/${id}`),
  getCommentary: (id) => api.get(`/api/v1/cricket/commentary/${id}`),
};

export const seriesApi = {
  getList: () => api.get("/api/v1/cricket/series"),
  getDetails: (id) => api.get(`/api/v1/cricket/series/${id}`),
};

/* --- LEGACY NAMED EXPORTS (Ensures compatibility with existing codebase) --- */
export const getSeries = () => api.get("/api/v1/cricket/series");
export const getSeriesDetail = (id) => api.get(`/api/v1/cricket/series/${id}`);
export const getCurrentMatches = () => api.get("/api/v1/cricket/live");
export const getLiveMatches = () => api.get("/api/v1/cricket/live");
export const getNews = () => api.get("/api/v1/cricket/news");

export default api;