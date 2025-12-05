import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { motion } from 'framer-motion';

const SeriesPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  
  // Fetching data
  const { data, loading, error } = useFetch(`http://localhost:8081/api/v1/cricket/series/${seriesId}`);

  // -------------------------------------------
  // Helper: Status Color Logic
  // -------------------------------------------
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('live')) return 'bg-red-500/10 text-red-600 border-red-200 dark:text-red-400 dark:border-red-900';
    if (s.includes('won') || s.includes('result')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-900';
    if (s.includes('scheduled') || s.includes('upcoming')) return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-900';
    return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
  };

  // -------------------------------------------
  // State: Loading (Skeleton UI)
  // -------------------------------------------
  if (loading) return (
    <div className="p-6 max-w-5xl mx-auto min-h-[60vh] animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8"></div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        ))}
      </div>
    </div>
  );

  // -------------------------------------------
  // State: Error
  // -------------------------------------------
  if (error || !data || !data.data) return (
    <div className="flex flex-col justify-center items-center h-full min-h-[60vh] text-center p-6">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load series</h3>
      <p className="text-gray-500 mt-2 mb-6">We couldn't fetch the details. Please try again later.</p>
      <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">Go Back</button>
    </div>
  );

  const seriesInfo = data.data;
  const matchList = seriesInfo.matchList;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="max-w-6xl mx-auto p-4 md:p-6"
    >
      {/* -------------------------------------------
          1. Header / Hero Section
      ------------------------------------------- */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 shadow-xl mb-8 p-8 text-white"
      >
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm text-blue-200 hover:text-white mb-6 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/10 rounded text-xs font-semibold tracking-wider uppercase backdrop-blur-sm border border-white/10">
                  Series
                </span>
                <span className="text-blue-200 text-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {seriesInfo.startDate} — {seriesInfo.endDate}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {seriesInfo.name}
              </h2>
            </div>
            
            {/* Format Stats Badges */}
            <div className="flex gap-3">
              {seriesInfo.matches > 0 && (
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                  <div className="text-xl font-bold">{seriesInfo.matches}</div>
                  <div className="text-xs text-blue-200 uppercase">Total</div>
                </div>
              )}
              {seriesInfo.odi > 0 && (
                <div className="text-center px-4 py-2 bg-emerald-500/20 rounded-xl backdrop-blur-md border border-emerald-500/20">
                  <div className="text-xl font-bold text-emerald-300">{seriesInfo.odi}</div>
                  <div className="text-xs text-emerald-200 uppercase">ODIs</div>
                </div>
              )}
              {seriesInfo.t20 > 0 && (
                <div className="text-center px-4 py-2 bg-cyan-500/20 rounded-xl backdrop-blur-md border border-cyan-500/20">
                  <div className="text-xl font-bold text-cyan-300">{seriesInfo.t20}</div>
                  <div className="text-xs text-cyan-200 uppercase">T20s</div>
                </div>
              )}
              {seriesInfo.test > 0 && (
                <div className="text-center px-4 py-2 bg-red-500/20 rounded-xl backdrop-blur-md border border-red-500/20">
                  <div className="text-xl font-bold text-red-300">{seriesInfo.test}</div>
                  <div className="text-xs text-red-200 uppercase">Tests</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* -------------------------------------------
          2. Match List Grid
      ------------------------------------------- */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
        Match Schedule
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {matchList?.length > 0 ? (
          matchList.map((match, index) => (
            <motion.div
              key={match.id || index}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusStyle(match.status)}`}>
                     {match.status}
                  </span>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full">
                     {/* Generic Cricket Icon */}
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                        <path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2">
                  {match.name}
                </h4>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {match.venue || "Venue TBD"}
                </p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {match.date || "Date TBD"}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  Match Center 
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No match schedule available for this series yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SeriesPage;