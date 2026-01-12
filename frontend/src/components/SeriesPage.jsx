import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, ChevronRight, 
  Clock, Activity, Hash 
} from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { motion, AnimatePresence } from 'framer-motion';

const SeriesPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
// Use the Environment Variable you set in Vercel
  const { data, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/v1/cricket/series/${seriesId}`);  
  const [activeFilter, setActiveFilter] = useState('All');

  // --- Logic: Sorting (Ascending) & Filtering ---
  const processedMatches = useMemo(() => {
    if (!data?.data?.matchList) return [];
    
    let list = [...data.data.matchList];

    // 1. Sort by Date (Ascending - earliest first)
    list.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. Filter by Format/Name
    if (activeFilter !== 'All') {
      list = list.filter(m => m.name.toLowerCase().includes(activeFilter.toLowerCase()));
    }

    return list;
  }, [data, activeFilter]);

  if (loading) return <LoadingSkeleton />;
  if (error || !data?.data) return <ErrorState onBack={() => navigate(-1)} />;

  const series = data.data;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500">
      
      {/* --- HERO BANNER (Compact) --- */}
      <div className="bg-slate-900 text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-900/30 z-0" />
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">Series Dashboard</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                  <Calendar size={12} /> {series.startDate} — {series.endDate}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {series.name}
              </h1>
            </div>

            {/* Format Pills (Original Palette) */}
            <div className="flex gap-2">
              <FormatPill label="T20" count={series.t20} color="sky" />
              <FormatPill label="ODI" count={series.odi} color="indigo" />
              <FormatPill label="Test" count={series.test} color="red" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- LIST CONTROLS --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="text-blue-600" size={18} /> Tour Timeline
          </h3>

          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
            {['All', 'T20', 'ODI', 'Test'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === f 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* --- COMPACT MATCH GRID (4 Columns) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {processedMatches.map((match, idx) => (
              <MatchCard key={match.id || idx} match={match} />
            ))}
          </AnimatePresence>
        </div>

        {processedMatches.length === 0 && <EmptyMatchesState />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MatchCard = ({ match }) => {
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('live')) return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50';
    if (s.includes('won') || s.includes('result')) return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50';
    return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
    >
      <div className="flex justify-between items-center mb-4">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusColor(match.status)}`}>
          {match.status}
        </span>
        <Hash size={12} className="text-slate-300 dark:text-slate-600" />
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
        {match.name}
      </h4>

      <div className="space-y-2 mb-6 mt-auto">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <MapPin size={12} className="text-blue-500" />
          <span className="truncate">{match.venue || "Stadium TBA"}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <Clock size={12} className="text-slate-400" />
          <span>{match.date || "Schedule TBA"}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
         <Link 
            to={match.id ? `/match/${match.id}` : '#'} 
            className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
          >
            Match Center <ChevronRight size={14} />
          </Link>
      </div>
    </motion.div>
  );
};

const FormatPill = ({ label, count, color }) => {
  if (count === 0) return null;
  const styles = {
    sky: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
    red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
  };
  return (
    <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${styles[color]}`}>
      <span className="text-[10px] font-black uppercase">{label}</span>
      <div className="w-px h-3 bg-current opacity-20" />
      <span className="text-sm font-black">{count}</span>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="p-8 max-w-7xl mx-auto animate-pulse">
    <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-10" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
    <p className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">Error Loading Tour</p>
    <button onClick={onBack} className="px-8 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">
      Go Back
    </button>
  </div>
);

const EmptyMatchesState = () => (
  <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
    <p className="text-slate-400 font-bold italic">No upcoming matches scheduled.</p>
  </div>
);

export default SeriesPage;