import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Calendar, MapPin, ChevronRight,
  Clock, Activity, Hash, Trophy
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
    <div className="min-h-screen bg-[#080a0f] text-white pb-20">
      
      {/* 🟢 DYNAMIC HERO HEADER */}
      <div className="relative overflow-hidden bg-[#111827] border-b border-white/5 pt-12 pb-16">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-white mb-10 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Schedules
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                  <Trophy size={20} />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Intel</span>
                  <span className="text-xs font-bold text-blue-400">{data.startDate} — {data.endDate}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">{data.name}</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <FormatPill label="T20" count={data.t20} color="sky" />
              <FormatPill label="ODI" count={data.odi} color="emerald" />
              <FormatPill label="Test" count={data.test} color="amber" />
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 TIMELINE FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-3">
            <Activity size={18} className="text-emerald-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Match Timeline</h3>
          </div>

          <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
            {["All", "T20", "ODI", "Test"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                  activeFilter === f
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 🟠 MATCH TIMELINE GRID */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  const isLive = match.status?.toLowerCase().includes("live") || match.status?.toLowerCase().includes("batting");
  const isFinished = ["won", "draw", "tie", "result"].some(k => match.status?.toLowerCase().includes(k));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className={`group relative bg-[#111827] border rounded-[2rem] p-6 h-full flex flex-col transition-all duration-500 ${
        isLive ? "border-red-500/40 shadow-2xl shadow-red-500/5" : "border-white/5 shadow-xl"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
          isLive ? "bg-red-500 text-white animate-pulse" : 
          isFinished ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
          "bg-slate-800 text-slate-500"
        }`}>
          {match.status}
        </span>
        <span className="text-[10px] font-bold text-slate-700">#{match.id?.slice(-3)}</span>
      </div>

      <h4 className="text-lg font-black text-white mb-6 leading-tight group-hover:text-blue-500 transition-colors uppercase tracking-tighter">
        {match.name}
      </h4>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500">
          <MapPin size={14} className="text-slate-700" /> 
          <span className="truncate">{match.venue || "Venue TBA"}</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500">
          <Clock size={14} className="text-blue-500" /> 
          {match.date}
        </div>

        <Link
          to={match.id ? `/match/${match.id}` : "#"}
          className={`mt-6 w-full py-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            match.id 
              ? "bg-white text-black hover:bg-blue-600 hover:text-white shadow-xl" 
              : "bg-white/5 text-slate-700 cursor-not-allowed border border-white/5"
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
    sky: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  };
  return (
    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${colors[color]}`}>
      {count} {label}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#080a0f] p-12 grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="col-span-full h-48 bg-white/5 rounded-[3rem] animate-pulse mb-10" />
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
    ))}
  </div>
);

const ErrorState = ({ onBack }) => (
  <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center text-center">
    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
      <Activity className="text-red-500" size={40} />
    </div>
    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Timeline Offline</h3>
    <p className="text-slate-500 text-sm mt-2">The requested series data is currently unreachable.</p>
    <button onClick={onBack} className="mt-8 px-10 py-3 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl">
      Return to Schedules
    </button>
  </div>
);

const EmptyMatchesState = () => (
  <div className="text-center py-32 opacity-20 italic">
    <h2 className="text-5xl font-black uppercase text-slate-700 tracking-tighter">No Matches Found</h2>
  </div>
);