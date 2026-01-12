import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Calendar, MapPin, ChevronRight,
  Clock, Activity, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSeriesDetail } from "../api/cricketApi";

export default function SeriesPage() {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const load = async () => {
    try {
      const res = await getSeriesDetail(seriesId);
      setData(res.data.data);
      setError(false);
    } catch (e) {
      console.error("Series detail error", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000); // cache refresh safe
    return () => clearInterval(t);
  }, [seriesId]);

  const processedMatches = useMemo(() => {
    if (!data?.matchList) return [];

    let list = [...data.matchList].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (activeFilter !== "All") {
      list = list.filter(m =>
        m.name.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    return list;
  }, [data, activeFilter]);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState onBack={() => navigate(-1)} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">

      {/* HERO */}
      <div className="bg-slate-900 text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                <Calendar size={12} />
                {data.startDate} — {data.endDate}
              </div>
              <h1 className="text-3xl md:text-4xl font-black">{data.name}</h1>
            </div>

            <div className="flex gap-2">
              <FormatPill label="T20" count={data.t20} color="sky" />
              <FormatPill label="ODI" count={data.odi} color="indigo" />
              <FormatPill label="Test" count={data.test} color="red" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between mb-8">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Activity size={18} className="text-blue-600" /> Tour Timeline
          </h3>

          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border">
            {["All", "T20", "ODI", "Test"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg ${
                  activeFilter === f
                    ? "bg-slate-900 text-white"
                    : "text-slate-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {processedMatches.map((m, i) => (
              <MatchCard key={m.id || i} match={m} />
            ))}
          </AnimatePresence>
        </div>

        {processedMatches.length === 0 && <EmptyMatchesState />}
      </div>
    </div>
  );
}

/* ================== */

const MatchCard = ({ match }) => (
  <motion.div layout whileHover={{ y: -4 }}>
    <div className="bg-white dark:bg-slate-800 border rounded-xl p-5 h-full flex flex-col">
      <div className="flex justify-between mb-3 text-[10px] text-slate-500">
        <span>{match.status}</span>
        <Hash size={12} />
      </div>

      <h4 className="font-bold mb-4 line-clamp-2">{match.name}</h4>

      <div className="text-xs text-slate-500 space-y-1 mt-auto">
        <div className="flex items-center gap-2">
          <MapPin size={12} /> {match.venue || "TBA"}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} /> {match.date}
        </div>
      </div>

      <Link
        to={match.id ? `/match/${match.id}` : "#"}
        className="mt-4 text-blue-600 text-[10px] font-black uppercase flex items-center gap-1"
      >
        Match Center <ChevronRight size={14} />
      </Link>
    </div>
  </motion.div>
);

/* ================== */

const FormatPill = ({ label, count, color }) => {
  if (!count) return null;
  const styles = {
    sky: "bg-sky-100 text-sky-700",
    indigo: "bg-indigo-100 text-indigo-700",
    red: "bg-red-100 text-red-700"
  };
  return (
    <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${styles[color]}`}>
      {count} {label}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    ))}
  </div>
);

const ErrorState = ({ onBack }) => (
  <div className="h-screen flex flex-col items-center justify-center">
    <p className="text-slate-500 mb-4">Failed to load series</p>
    <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
      Go Back
    </button>
  </div>
);

const EmptyMatchesState = () => (
  <div className="text-center py-20 text-slate-400">
    No matches available.
  </div>
);
