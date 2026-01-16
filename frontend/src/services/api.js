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
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* --- INTERCEPTORS: Session Guard --- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized: Session expired or invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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

/* ===================== MATCH APIs ===================== */
export const matchApi = {
  getLive: () => api.get("/api/v1/cricket/live"),
  getUpcoming: () => api.get("/api/v1/cricket/upcoming"),
  getRecent: () => api.get("/api/v1/cricket/recent"),

  getMatchDetail: (id) => api.get(`/api/v1/cricket/match/${id}`),
  getScorecard: (id) => api.get(`/api/v1/cricket/scorecard/${id}`),
  getCommentary: (id) => api.get(`/api/v1/cricket/commentary/${id}`),
  getSquads: (id) => api.get(`/api/v1/cricket/squads/${id}`),
  getOvers: (id) => api.get(`/api/v1/cricket/overs/${id}`),
};

/* ===================== SERIES APIs ===================== */
export const seriesApi = {
  getList: () => api.get("/api/v1/cricket/series"),
  getDetails: (id) => api.get(`/api/v1/cricket/series/${id}`),
};

/* ===================== STATS APIs ===================== */
export const statsApi = {
  /**
   * Fetches ICC International Rankings
   * @param {string} format - 't20', 'odi', or 'test'
   * @param {string} isWomen - '0' for men, '1' for women
   */
  getIccRankings: (format = "t20", isWomen = "0") =>
    api.get("/api/v1/cricket/rankings/international", {
      params: { format, isWomen },
    }),
};

/* ===================== TEAMS APIs ===================== */
export const teamsApi = {
  /**
   * type can be:
   * international | league | domestic | women | all
   */
  getTeams: (type = "all") => api.get(`/api/v1/cricket/teams/${type}`),

  getTeamSchedule: (teamId) => api.get(`/api/v1/cricket/team/${teamId}/schedule`),
  getTeamResults: (teamId) => api.get(`/api/v1/cricket/team/${teamId}/results`),
  getTeamPlayers: (teamId) => api.get(`/api/v1/cricket/team/${teamId}/players`),
  getTeamStats: (teamId) => api.get(`/api/v1/cricket/team/${teamId}/stats`),
  getTeamNews: (teamId) => api.get(`/api/v1/cricket/team/${teamId}/news`),
};

/* ===================== PLAYERS APIs ===================== */
export const playerApi = {
  getPlayerInfo: (playerId) => api.get(`/api/v1/cricket/player/${playerId}`),
  getPlayerBatting: (playerId) => api.get(`/api/v1/cricket/player/${playerId}/batting`),
  getPlayerBowling: (playerId) => api.get(`/api/v1/cricket/player/${playerId}/bowling`),
  getPlayerCareer: (playerId) => api.get(`/api/v1/cricket/player/${playerId}/career`),
};

/* ===================== VENUES APIs ===================== */
export const venueApi = {
  getVenueInfo: (venueId) => api.get(`/api/v1/cricket/venue/${venueId}`),
  getVenueMatches: (venueId) => api.get(`/api/v1/cricket/venue/${venueId}/matches`),
  getVenueStats: (venueId) => api.get(`/api/v1/cricket/venue/${venueId}/stats`),
};

/* ===================== NEWS APIs ===================== */
export const newsApi = {
  getNews: () => api.get("/api/v1/cricket/news"),
  getNewsDetail: (id) => api.get(`/api/v1/cricket/news/${id}`),
};

/* --- COMPATIBILITY / LEGACY EXPORTS --- */
export const getSeries = seriesApi.getList;
export const getSeriesDetail = seriesApi.getDetails;
export const getLiveMatches = matchApi.getLive;
export const getNews = newsApi.getNews;

export default api;
