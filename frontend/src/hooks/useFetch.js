import { useEffect, useState, useRef } from "react";
import { api } from "../context/AuthContext";

/**
 * Default cache duration = 5 minutes
 * Can be overridden per call using options.ttl
 */
const DEFAULT_TTL = 5 * 60 * 1000;

const makeCacheKey = (url) => `cache:${encodeURIComponent(url)}`;
const makeTsKey = (url) => `cache_ts:${encodeURIComponent(url)}`;

const useFetch = (url, options = {}) => {
  const {
    ttl = DEFAULT_TTL,
    noCache = false,
    refreshInterval = 0, // ms (0 = no auto refresh)
    enabled = true,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !url) {
      setLoading(false);
      return;
    }

    const cacheKey = makeCacheKey(url);
    const tsKey = makeTsKey(url);

    const readCache = () => {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTs = localStorage.getItem(tsKey);

        if (!cachedData || !cachedTs) return null;

        const age = Date.now() - Number(cachedTs);
        if (age > ttl) return null;

        return JSON.parse(cachedData);
      } catch {
        return null;
      }
    };

    const writeCache = (payload) => {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(payload));
        localStorage.setItem(tsKey, String(Date.now()));
      } catch {
        // ignore storage quota errors
      }
    };

    const fetchNow = async ({ bypassCache = false } = {}) => {
      if (!isMountedRef.current) return;

      // 1) Serve cache first (fast UI)
      if (!noCache && !bypassCache) {
        const cached = readCache();
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      // 2) Network request
      setLoading(true);
      try {
        const res = await api.get(url);

        if (!isMountedRef.current) return;

        setData(res.data);
        setError(null);

        if (!noCache) writeCache(res.data);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err);
      } finally {
        if (!isMountedRef.current) return;
        setLoading(false);
      }
    };

    // initial fetch
    fetchNow();

    // auto refresh
    let intervalId = null;
    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(() => {
        fetchNow({ bypassCache: true });
      }, refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [url, ttl, noCache, refreshInterval, enabled]);

  return { data, loading, error };
};

export default useFetch;
