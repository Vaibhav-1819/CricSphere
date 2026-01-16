import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext'; // Using the axios instance we created

const CACHE_DURATION = 5 * 60 * 1000; // 5 Minutes

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks if component unmounts

    const fetchData = async () => {
      const cachedData = localStorage.getItem(url);
      const cachedTimestamp = localStorage.getItem(`${url}_timestamp`);

      // 1. Logic check: Use cache if it's fresh
      if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp) < CACHE_DURATION) {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 2. Use our 'api' axios instance (handles JWT headers automatically)
        const response = await api.get(url);
        
        if (isMounted) {
          // 3. Cache the successful response
          localStorage.setItem(url, JSON.stringify(response.data));
          localStorage.setItem(`${url}_timestamp`, Date.now());
          
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (url) fetchData();

    return () => { isMounted = false; };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;