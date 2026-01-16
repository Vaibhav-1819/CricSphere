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
    // 401 Unauthorized: Session expired or invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Use replace to avoid history stack issues
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
  getSquads: (id) => api.get(`/api/v1/cricket/squads/${id}`),
  getOvers: (id) => api.get(`/api/v1/cricket/overs/${id}`),
  getTeams: (type = "all") => api.get(`/api/v1/cricket/teams/${type}`),
};

export const seriesApi = {
  getList: () => api.get("/api/v1/cricket/series"),
  getDetails: (id) => api.get(`/api/v1/cricket/series/${id}`),
};

export const statsApi = {
  /**
   * Fetches ICC International Rankings
   * @param {string} format - 't20', 'odi', or 'test'
   * @param {string} isWomen - '0' for men, '1' for women
   */
  getIccRankings: (format = "t20", isWomen = "0") => 
    api.get("/api/v1/cricket/rankings/international", {
      params: { format, isWomen }
    }),
};

export const newsApi = {
  getNews: () => api.get("/api/v1/cricket/news"),
  getNewsDetail: (id) => api.get(`/api/v1/cricket/news/${id}`),
};

/* --- COMPATIBILITY / LEGACY EXPORTS --- */
// These ensure older components using these named imports don't break.
export const getSeries = seriesApi.getList;
export const getSeriesDetail = seriesApi.getDetails;
export const getLiveMatches = matchApi.getLive;
export const getNews = newsApi.getNews;

export default api;