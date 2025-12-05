import { useState, useEffect } from 'react';

// Set a cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check for cached data
      const cachedData = localStorage.getItem(url);
      const cachedTimestamp = localStorage.getItem(`${url}_timestamp`);

      if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp) < CACHE_DURATION) {
        console.log("Loading from cache:", url);
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // 2. If no valid cache, fetch from API
      console.log("Fetching from API:", url);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // 3. Store new data in cache
        localStorage.setItem(url, JSON.stringify(result));
        localStorage.setItem(`${url}_timestamp`, Date.now());

        setData(result);
      } catch (e) {
        console.error("Fetch error:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};

export default useFetch;