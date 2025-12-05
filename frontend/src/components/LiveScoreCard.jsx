import React, { useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LiveScoreCard = () => {
  const { data, loading, error } = useFetch('http://localhost:8081/api/v1/cricket/current-matches');

  // --- Helper: Get Team Initials & Color ---
  const getTeamMeta = (teamName) => {
    if (!teamName) return { initial: '?', color: 'from-gray-500 to-gray-700' };
    
    const initial = teamName.slice(0, 1).toUpperCase();
    let color = 'from-gray-600 to-gray-800'; // Default
    
    // Basic color mapping for major teams
    const lowerName = teamName.toLowerCase();
    if (lowerName.includes('ind')) color = 'from-blue-500 to-blue-700';
    if (lowerName.includes('aus')) color = 'from-yellow-400 to-yellow-600';
    if (lowerName.includes('eng')) color = 'from-red-500 to-red-700';
    if (lowerName.includes('pak')) color = 'from-emerald-500 to-emerald-700';
    if (lowerName.includes('rsa')) color = 'from-green-500 to-green-700';
    if (lowerName.includes('nz')) color = 'from-slate-700 to-black';

    return { initial, color };
  };

  // --- Loading State (Skeleton) ---
  if (loading) return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
       <div className="flex justify-between mb-8">
         <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
         <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
       </div>
       <div className="flex justify-between items-center mb-6">
         <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
         <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
         <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
       </div>
       <div className="h-4 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    </div>
  );

  // --- Error / Empty State ---
  if (error || !data || !data.data || data.data.length === 0) return (
    <div className="h-full min-h-[250px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-center shadow-inner">
      <span className="text-4xl mb-3">🏏</span>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Live Action</h3>
      <p className="text-sm text-slate-500 mb-4">Check back later for live scores.</p>
      <Link to="/schedules" className="text-sm font-semibold text-blue-600 hover:underline">
        View Schedule &rarr;
      </Link>
    </div>
  );

  // Process Data
  const match = data.data[0];
  const teams = match.name.split(' vs ');
  const team1Name = teams[0] || 'Team A';
  const team2Name = teams[1] || 'Team B';
  
  const t1Meta = getTeamMeta(team1Name);
  const t2Meta = getTeamMeta(team2Name);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl ring-1 ring-white/10 group"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>

      {/* --- Header --- */}
      <div className="relative z-10 flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
           </span>
           <span className="text-xs font-bold tracking-widest text-red-400 uppercase">Live Now</span>
        </div>
        <div className="px-2 py-1 rounded bg-white/10 text-xs font-semibold tracking-wide text-white/80">
          {match.matchType || 'T20'} Match
        </div>
      </div>

      {/* --- Scoreboard Body --- */}
      <div className="relative z-10 p-6 flex flex-col items-center">
        
        {/* Teams Row */}
        <div className="flex w-full justify-between items-center mb-6">
          
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${t1Meta.color} flex items-center justify-center shadow-lg ring-2 ring-white/20`}>
              <span className="text-xl md:text-2xl font-bold">{t1Meta.initial}</span>
            </div>
            <span className="text-sm md:text-base font-bold text-center leading-tight">{team1Name}</span>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center w-1/3">
             <span className="text-2xl md:text-4xl font-black italic text-white/10 select-none">VS</span>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${t2Meta.color} flex items-center justify-center shadow-lg ring-2 ring-white/20`}>
              <span className="text-xl md:text-2xl font-bold">{t2Meta.initial}</span>
            </div>
             <span className="text-sm md:text-base font-bold text-center leading-tight">{team2Name}</span>
          </div>
        </div>

        {/* Status Text */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl px-4 py-3 w-full text-center border border-white/5">
          <p className="text-sm font-medium text-blue-200 animate-pulse">
            {match.status || "Match is currently in progress"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
             {match.venue || "Venue Details Unavailable"}
          </p>
        </div>
      </div>

      {/* --- Footer / CTA --- */}
      <div className="relative z-10 bg-white/5 p-4 flex justify-center border-t border-white/5 hover:bg-white/10 transition-colors">
        <Link 
          to="/live" 
          className="flex items-center gap-2 text-sm font-bold text-white transition-all group-hover:gap-3"
        >
          Detailed Scorecard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default LiveScoreCard;