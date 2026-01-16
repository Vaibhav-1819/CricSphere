import axios from "axios";

// Fallback to localhost if env variable is missing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ----------------------------------------------------------
   INTERCEPTORS: Security & Session Management
   ---------------------------------------------------------- */

// 1. Request: Attach Bearer Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 2. Response: Global Error Handling (401, 403, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized: Clear session and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Use location.replace to prevent back-button loops
      window.location.replace("/login");
    }

    if (status === 500) {
      console.error("Internal Server Error - Check Backend Logs");
    }

    return Promise.reject(error);
  }
);

/* ----------------------------------------------------------
   API SERVICE MODULES
   ---------------------------------------------------------- */

// --- Authentication ---
export const authApi = {
  login: (credentials) => api.post("/api/v1/auth/login", credentials),
  register: (userData) => api.post("/api/v1/auth/register", userData),
};

// --- Matches & Live Data ---
export const matchApi = {
  getLive: () => api.get("/api/v1/cricket/live"),
  getUpcoming: () => api.get("/api/v1/cricket/upcoming"),
  getRecent: () => api.get("/api/v1/cricket/recent"),
  getMatchDetail: (id) => api.get(`/api/v1/cricket/match/${id}`),
  getScorecard: (id) => api.get(`/api/v1/cricket/scorecard/${id}`),
  getCommentary: (id) => api.get(`/api/v1/cricket/commentary/${id}`),
  getSquads: (id) => api.get(`/api/v1/cricket/squads/${id}`),
};

// --- Series & Tournaments ---
export const seriesApi = {
  getList: () => api.get("/api/v1/cricket/series"),
  getDetails: (id) => api.get(`/api/v1/cricket/series/${id}`),
};

// --- News & Media ---
export const newsApi = {
  getFeed: () => api.get("/api/v1/cricket/news"),
  getStory: (id) => api.get(`/api/v1/cricket/news/${id}`),
};

// --- Statistics & Rankings ---
export const statsApi = {
  getICCRankings: (format) => api.get(`/api/v1/stats/icc?format=${format}`),
  getPlayerStats: (id) => api.get(`/api/v1/cricket/player/${id}`),
  getTeamStats: (type) => api.get(`/api/v1/cricket/teams/${type}`),
};

// --- User Profile ---
export const userApi = {
  getProfile: () => api.get("/api/v1/user/profile"),
  updateProfile: (data) => api.put("/api/v1/user/profile", data),
};

export default api;