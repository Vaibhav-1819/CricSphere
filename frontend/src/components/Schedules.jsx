import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Calendar, ChevronRight, Info, ArrowUpDown, Hash, Layers } from "lucide-react";
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
      list = list.filter((s) => s[formatFilter.toLowerCase()] > 0);
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
    <div className="min-h-screen bg-white dark:bg-[#080a0f]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 🟢 HEADER SECTION */}
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm flex items-center justify-center">
                  <Layers size={18} className="text-blue-600 dark:text-blue-400" />
                </div>

                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Fixtures & Series Calendar
                </p>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Match <span className="text-blue-600 dark:text-blue-400">Schedules</span>
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                Browse upcoming international tours, leagues, and series. Filter by format and sort by start date.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search by series name..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* 🔵 FILTER & SORT BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] border border-slate-200 dark:border-white/10">
            {/* Format Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Format
              </span>

              <div className="flex bg-white dark:bg-[#05070c] border border-slate-200 dark:border-white/10 p-1 rounded-2xl gap-1">
                {["All", "T20", "ODI", "Test"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormatFilter(f)}
                    className={`px-5 py-2 text-[10px] font-black uppercase rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      formatFilter === f
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-500 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-[#05070c] border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <ArrowUpDown size={14} />
              {sortOrder === "asc" ? "Start Date: Soonest" : "Start Date: Latest"}
            </button>
          </div>
        </header>

        {/* 🟠 GRID DISPLAY */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {processedSeries.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </AnimatePresence>
        </motion.div>

        {processedSeries.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}

const SeriesCard = ({ series }) => {
  const total = (series.t20 || 0) + (series.odi || 0) + (series.test || 0);

  const formattedDate = new Date(series.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/schedules/${series.id}`}>
        <div className="bg-white dark:bg-[#05070c] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 hover:border-blue-500/40 transition-all h-full flex flex-col group shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
          {/* Top Row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-wrap gap-1.5">
              <MiniBadge type="T20" count={series.t20} />
              <MiniBadge type="ODI" count={series.odi} />
              <MiniBadge type="Test" count={series.test} />
            </div>

            {total > 0 && (
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-white/10">
                <Hash size={10} /> {total} Matches
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {series.name}
          </h3>

          {/* Footer */}
          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Starts on {formattedDate}</span>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-between items-center text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.18em]">
              View details
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
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
    T20: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    ODI: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Test: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <span
      className={`text-[9px] font-black px-2 py-0.5 rounded-xl uppercase border border-black/5 dark:border-white/10 ${colors[type]}`}
    >
      {count} {type}
    </span>
  );
};

/* --- 🟡 SUB-COMPONENTS --- */

const LoadingGrid = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-64 bg-slate-100 dark:bg-white/5 rounded-[2rem] animate-pulse border border-slate-200 dark:border-white/10"
        />
      ))}
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-6 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
        <Info className="text-red-500" size={48} />
      </div>

      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        Unable to load schedules
      </h3>

      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-md">
        We couldn’t fetch the tournament list right now. Please check your internet connection and try again.
      </p>

      <button
        onClick={onRetry}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        Try again
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-24">
    <div className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
      No schedules found
    </div>
    <p className="text-slate-500 dark:text-slate-400 font-medium mt-3">
      Try a different search term or change the format filter.
    </p>
  </div>
);
