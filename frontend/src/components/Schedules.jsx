import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Calendar, ChevronRight, Info, Filter,
  ArrowUpDown, Hash, Layers
} from "lucide-react";
// ✅ Fix 1: Modularized Import
import { seriesApi } from "../services/api";

export default function Schedules() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ Fix 2: Updated loadData with safe optional chaining
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await seriesApi.getList();
      // Safely access the nested data array
      setSeries(res.data?.data || []);
      setError(false);
    } catch (e) {
      console.error("Failed to fetch tournament schedules", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix 3: Removed interval to be quota-friendly
  useEffect(() => {
    loadData();
  }, []);

  const processedSeries = useMemo(() => {
    // ✅ Fix 4: Safe filter with empty string fallback
    let list = [...series].filter((s) =>
      (s.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (formatFilter !== "All") {
      list = list.filter(s => s[formatFilter.toLowerCase()] > 0);
    }

    list.sort((a, b) => {
      const da = new Date(a.startDate);
      const db = new Date(b.startDate);
      return sortOrder === "asc" ? da - db : db - da;
    });

    return list;
  }, [series, searchQuery, formatFilter, sortOrder]);

  if (loading) return <LoadingGrid />;
  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-[#080a0f]">
      
      {/* 🟢 HEADER SECTION */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
              Tournament <span className="text-blue-500">Schedules</span>
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Layers size={14} className="text-blue-500" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                International Tours & Global T20 Leagues
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              placeholder="Filter by series name..."
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* 🔵 FILTER & SORT BAR */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 dark:bg-[#111827] p-4 rounded-[2rem] border border-slate-200 dark:border-white/5">
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl gap-1">
            {["All", "T20", "ODI", "Test"].map(f => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                  formatFilter === f ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
          >
            <ArrowUpDown size={14} />
            {sortOrder === "asc" ? "Soonest First" : "Latest First"}
          </button>
        </div>
      </header>

      {/* 🟠 GRID DISPLAY */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {processedSeries.map(s => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </AnimatePresence>
      </motion.div>

      {processedSeries.length === 0 && <EmptyState />}
    </div>
  );
}

const SeriesCard = ({ series }) => {
  const total = (series.t20 || 0) + (series.odi || 0) + (series.test || 0);
  const formattedDate = new Date(series.startDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/schedules/${series.id}`}>
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 hover:border-blue-500/50 transition-all h-full flex flex-col group shadow-sm hover:shadow-2xl hover:shadow-blue-500/5">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-wrap gap-1.5">
              <MiniBadge type="T20" count={series.t20} />
              <MiniBadge type="ODI" count={series.odi} />
              <MiniBadge type="Test" count={series.test} />
            </div>
            {total > 0 && (
              <div className="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                <Hash size={10} /> {total} Matches
              </div>
            )}
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-blue-500 transition-colors">
            {series.name}
          </h3>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <Calendar size={14} className="text-blue-500" /> {formattedDate}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
              View Schedule <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const MiniBadge = ({ type, count }) => {
  if (!count) return null;
  const colors = {
    T20: "bg-blue-500/10 text-blue-500",
    ODI: "bg-emerald-500/10 text-emerald-500",
    Test: "bg-amber-500/10 text-amber-500"
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${colors[type]}`}>
      {count} {type}
    </span>
  );
};

/* --- 🟡 SUB-COMPONENTS --- */

const LoadingGrid = () => (
  <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-64 bg-slate-100 dark:bg-[#111827] rounded-[2rem] animate-pulse border border-slate-200 dark:border-white/5" />
    ))}
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6">
    <div className="p-6 bg-red-500/10 rounded-full mb-6">
      <Info className="text-red-500" size={48} />
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Connection Interrupted</h3>
    <p className="text-slate-500 text-sm mt-2 max-w-xs">Tournament service is temporarily unavailable. Check your network or retry.</p>
    <button onClick={onRetry} className="mt-8 px-8 py-3 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">
      Retry Connection
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-32">
    <div className="text-slate-700 dark:text-slate-300 text-6xl font-black italic uppercase tracking-tighter opacity-20">No Results Found</div>
    <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px]">Try adjusting your search or filters</p>
  </div>
);