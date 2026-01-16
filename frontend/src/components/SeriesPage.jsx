import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Activity,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// ✅ Fix 1: Modularized Import
import { seriesApi } from "../services/api";

export default function SeriesPage() {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // ✅ Fix 2: Updated loadDetail with modular API and safe mapping
  const loadDetail = async () => {
    setLoading(true);
    try {
      const res = await seriesApi.getDetails(seriesId);
      // Maps to SeriesDetailResponse.data (SeriesDetail)
      setData(res.data?.data || null);
      setError(false);
    } catch (e) {
      console.error("Critical: Failed to load series timeline", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix 3: Removed interval to preserve API quota
  useEffect(() => {
    loadDetail();
  }, [seriesId]);

  // ✅ Fix 4: Robust processedMatches filter (checks format/type/name)
  const processedMatches = useMemo(() => {
    if (!data?.matchList) return [];

    let list = [...data.matchList].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (activeFilter !== "All") {
      list = list.filter((m) => {
        // Robust check for format across multiple possible API fields
        const format = (m.matchType || m.matchFormat || m.format || "").toLowerCase();
        return format.includes(activeFilter.toLowerCase());
      });
    }

    return list;
  }, [data, activeFilter]);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState onBack={() => navigate(-1)} />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white pb-20">
      {/* 🟢 HERO */}
      <div className="relative overflow-hidden bg-white dark:bg-[#080a0f] border-b border-black/10 dark:border-white/10 pt-10 pb-12">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 text-[10px] font-black uppercase tracking-[0.22em] transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Schedules
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-600/10 dark:border-blue-500/20">
                  <Trophy size={18} />
                </span>

                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Tournament
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-500">
                    {data.startDate} — {data.endDate}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {data.name}
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Browse the match timeline and open match center for details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <FormatPill label="T20" count={data.t20} color="sky" />
              <FormatPill label="ODI" count={data.odi} color="emerald" />
              <FormatPill label="Test" count={data.test} color="amber" />
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 FILTERS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/10 dark:border-emerald-500/20">
              <Activity size={18} />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
              Match Timeline
            </h3>
          </div>

          <div className="flex bg-white dark:bg-[#080a0f] p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            {["All", "T20", "ODI", "Test"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === f
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 🟠 MATCH GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {processedMatches.map((m, i) => (
              <TimelineCard key={m.id || i} match={m} />
            ))}
          </AnimatePresence>
        </motion.div>

        {processedMatches.length === 0 && <EmptyMatchesState />}
      </div>
    </div>
  );
}

/* ---------------- 🃏 SUB-COMPONENTS ---------------- */

const TimelineCard = ({ match }) => {
  const isLive =
    match.status?.toLowerCase().includes("live") ||
    match.status?.toLowerCase().includes("batting");

  const isFinished = ["won", "draw", "tie", "result"].some((k) =>
    match.status?.toLowerCase().includes(k)
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-3xl p-6 h-full flex flex-col transition-all duration-300 border shadow-sm bg-white dark:bg-[#080a0f] ${
        isLive
          ? "border-red-500/40 shadow-xl shadow-red-500/10"
          : "border-black/10 dark:border-white/10 hover:border-blue-500/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40"
      }`}
    >
      <div className="flex justify-between items-center mb-5">
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            isLive
              ? "bg-red-500 text-white border-red-500 animate-pulse"
              : isFinished
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-black/10 dark:border-white/10"
          }`}
        >
          {match.status}
        </span>

        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">
          #{match.id?.slice(-3)}
        </span>
      </div>

      <h4 className="text-base font-black mb-5 leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
        {match.name}
      </h4>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <MapPin size={14} className="text-slate-400 dark:text-slate-600" />
          <span className="truncate">{match.venue || "Venue TBA"}</span>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <Clock size={14} className="text-blue-600 dark:text-blue-500" />
          {match.date}
        </div>

        <Link
          to={match.id ? `/match/${match.id}` : "#"}
          className={`mt-6 w-full py-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.22em] transition-all border ${
            match.id
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20"
              : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed border-black/10 dark:border-white/10"
          }`}
        >
          {match.id ? "Match Center" : "Schedule Only"}
        </Link>
      </div>
    </motion.div>
  );
};

const FormatPill = ({ label, count, color }) => {
  if (!count) return null;

  const colors = {
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <div
      className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${colors[color]}`}
    >
      {count} {label}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-[#05070c] p-6 md:p-12">
    <div className="max-w-7xl mx-auto">
      <div className="h-44 md:h-52 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] animate-pulse mb-10 border border-black/10 dark:border-white/10" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-slate-100 dark:bg-white/5 rounded-3xl animate-pulse border border-black/10 dark:border-white/10"
          />
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({ onBack }) => (
  <div className="min-h-screen bg-white dark:bg-[#05070c] flex flex-col items-center justify-center text-center px-6">
    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
      <Activity className="text-red-500" size={38} />
    </div>

    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
      Series Unavailable
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-md">
      The requested series timeline could not be loaded right now.
    </p>

    <button
      onClick={onBack}
      className="mt-8 px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg shadow-blue-600/20 transition-all"
    >
      Return to Schedules
    </button>
  </div>
);

const EmptyMatchesState = () => (
  <div className="text-center py-28">
    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-300 dark:text-slate-700">
      No Matches Found
    </h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
      Try switching filters to view other formats.
    </p>
  </div>
);
