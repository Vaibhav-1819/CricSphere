import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { motion, AnimatePresence } from 'framer-motion';

function LiveScore() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { data, loading, error } = useFetch('http://localhost:8081/api/v1/cricket/current-matches');

  // --- Helper: Generate Team Colors & Initials ---
  const getTeamMeta = (teamName) => {
    if (!teamName) return { initial: '?', color: 'from-gray-500 to-gray-700' };
    
    const initial = teamName.slice(0, 1).toUpperCase();
    let color = 'from-slate-600 to-slate-800'; // Default
    
    // Heuristic coloring for major nations
    const lowerName = teamName.toLowerCase();
    if (lowerName.includes('ind')) color = 'from-blue-600 to-indigo-700';
    if (lowerName.includes('aus')) color = 'from-yellow-500 to-orange-600';
    if (lowerName.includes('eng')) color = 'from-red-600 to-rose-700';
    if (lowerName.includes('pak')) color = 'from-emerald-600 to-teal-700';
    if (lowerName.includes('rsa') || lowerName.includes('south')) color = 'from-green-600 to-green-800';
    if (lowerName.includes('nz')) color = 'from-stone-700 to-black';
    if (lowerName.includes('wi') || lowerName.includes('west')) color = 'from-red-800 to-red-900';
    if (lowerName.includes('sri')) color = 'from-blue-800 to-blue-900';

    return { initial, color };
  };

  // --- Loading State (Skeleton Grid) ---
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-[60vh]">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center p-6">
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full mb-4">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Connection Issue</h3>
        <p className="text-gray-500 mt-2">{error.message || 'Unable to fetch live scores.'}</p>
      </div>
    );
  }

  // --- Filter Logic ---
  const matches = data?.data || [];
  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'All') return true;
    return match.matchType?.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const filterOptions = ['All', 'T20', 'ODI', 'Test', 'League'];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[80vh]">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Live Match Center
              </h2>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
           </div>
           <p className="text-slate-600 dark:text-slate-400">
             Real-time updates from matches around the world.
           </p>
        </div>

        {/* Filter Tabs (Pills) */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setSelectedFilter(option)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                selectedFilter === option 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg transform scale-105' 
                  : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* --- Matches Grid --- */}
      {filteredMatches.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
             visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMatches.map((match) => {
            const teams = match.name.split(' vs ');
            const team1 = teams[0] || 'Team A';
            const team2 = teams[1] || 'Team B';
            const t1Meta = getTeamMeta(team1);
            const t2Meta = getTeamMeta(team2);

            return (
              <motion.div
                key={match.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 group"
              >
                {/* Decorative Top Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Meta Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      {match.matchType || 'Match'}
                    </span>
                    {match.status?.toLowerCase().includes('live') && (
                       <span className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
                          ● LIVE
                       </span>
                    )}
                  </div>

                  {/* Teams Face-off */}
                  <div className="flex items-center justify-between mb-8">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center gap-3 w-1/3">
                       <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t1Meta.color} flex items-center justify-center text-white text-lg font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {t1Meta.initial}
                       </div>
                       <span className="text-sm font-bold text-slate-900 dark:text-white text-center leading-tight line-clamp-2 h-10 flex items-center">
                         {team1}
                       </span>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                       <span className="text-2xl font-black italic text-gray-200 dark:text-gray-700">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center gap-3 w-1/3">
                       <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t2Meta.color} flex items-center justify-center text-white text-lg font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {t2Meta.initial}
                       </div>
                       <span className="text-sm font-bold text-slate-900 dark:text-white text-center leading-tight line-clamp-2 h-10 flex items-center">
                         {team2}
                       </span>
                    </div>
                  </div>

                  {/* Match Info / Status */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                      {match.status}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                       {match.venue || 'Venue TBD'}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
           <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
           </div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">No {selectedFilter} Matches</h3>
           <p className="text-slate-500 mt-1">There are no live games matching this filter right now.</p>
           <button 
             onClick={() => setSelectedFilter('All')} 
             className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
           >
             View all matches
           </button>
        </div>
      )}
    </div>
  );
}

export default LiveScore;