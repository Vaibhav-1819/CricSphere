import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/* -------------------------------
   Attach JWT to every request
-------------------------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");   // 🔥 MUST match AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------------------
   Auto logout on 401
-------------------------------- */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ==============================
// MATCHES
// ==============================

export const getLiveMatches = () => api.get("/api/v1/cricket/live");
export const getUpcomingMatches = () => api.get("/api/v1/cricket/upcoming");
export const getRecentMatches = () => api.get("/api/v1/cricket/recent");

// ==============================
// SERIES
// ==============================

export const getSeries = () => api.get("/api/v1/cricket/series");
export const getSeriesDetail = (seriesId) =>
  api.get(`/api/v1/cricket/series/${seriesId}`);

// ==============================
// NEWS
// ==============================

export const getNews = () => api.get("/api/v1/cricket/news");
export const getNewsDetail = (id) =>
  api.get(`/api/v1/cricket/news/${id}`);

// =========================
// MATCH CENTER
// =========================

export const getMatchDetails = (matchId) =>
  api.get(`/api/v1/cricket/match/${matchId}`);

export const getScorecard = (matchId) =>
  api.get(`/api/v1/cricket/scorecard/${matchId}`);

export const getCommentary = (matchId) =>
  api.get(`/api/v1/cricket/commentary/${matchId}`);

// ==============================
// MATCH DETAILS
// ==============================

export const getMatchInfo = (matchId) =>
  api.get(`/api/v1/cricket/match/${matchId}`);

export const getScorecard = (matchId) =>
  api.get(`/api/v1/cricket/scorecard/${matchId}`);

export const getCommentary = (matchId) =>
  api.get(`/api/v1/cricket/commentary/${matchId}`);

export const getSquads = (matchId) =>
  api.get(`/api/v1/cricket/squads/${matchId}`);

export const getOvers = (matchId) =>
  api.get(`/api/v1/cricket/overs/${matchId}`);

// ==============================
// PLAYER / TEAM / VENUE
// ==============================

export const getPlayer = (playerId) =>
  api.get(`/api/v1/cricket/player/${playerId}`);

export const getTeams = (type) =>
  api.get(`/api/v1/cricket/teams/${type}`);

export const getVenue = (venueId) =>
  api.get(`/api/v1/cricket/venue/${venueId}`);

// ==============================
// AUTH
// ==============================

export const login = (data) => api.post("/api/v1/auth/login", data);
export const register = (data) => api.post("/api/v1/auth/register", data);

// ==============================
// USER PROFILE
// ==============================

export const getProfile = () => api.get("/api/v1/user/profile");
export const updateProfile = (data) =>
  api.put("/api/v1/user/profile", data);

export default api;
