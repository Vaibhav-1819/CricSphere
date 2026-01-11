import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getCurrentMatches = () =>
  api.get("/api/v1/cricket/current-matches");

export const getSeries = () =>
  api.get("/api/v1/cricket/series");

export const getNews = () =>
  api.get("/api/v1/cricket/news-feed");
