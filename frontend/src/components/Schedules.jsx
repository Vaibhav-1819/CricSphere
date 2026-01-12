import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Calendar, ChevronRight, Info, Filter,
  ArrowUpDown, Hash
} from "lucide-react";
import { getSeries } from "../api/cricketApi";

/* ===================== */

export default function Schedules() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  /* --- Production-safe fetch --- */
  const load = async () => {
    try {
      const res = await getSeries();
      setSeries(res.data.data || []);
      setError(false);
    } catch (e) {
      console.error("Series API error", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000); // refresh every 5 minutes
    return () => clearInterval(t);
  }, []);

  /* --- Filter + Sort --- */
  const processedSeries = useMemo(() => {
    let list = [...series].filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
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
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-[#0f172a]">

      {/* HEADER */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Tournament <span className="text-blue-600">Schedules</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse international tours & leagues.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search series..."
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
            />
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border">
          <div className="flex gap-2">
            {["All", "T20", "ODI", "Test"].map(f => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md ${
                  formatFilter === f ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 border rounded-md text-xs font-bold"
          >
            <ArrowUpDown size={14} />
            {sortOrder === "asc" ? "Earliest" : "Latest"}
          </button>
        </div>
      </header>

      {/* GRID */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {processedSeries.map(s => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </AnimatePresence>
      </motion.div>

      {processedSeries.length === 0 && <EmptyState />}
    </div>
  );
}

/* ===================== */

const SeriesCard = ({ series }) => {
  const total = (series.t20 || 0) + (series.odi || 0) + (series.test || 0);

  return (
    <motion.div layout whileHover={{ y: -4 }}>
      <Link to={`/schedules/${series.id}`}>
        <div className="bg-white dark:bg-slate-800 border rounded-xl p-5 hover:border-blue-400 transition-all h-full flex flex-col">
          <div className="flex justify-between mb-4">
            <div className="flex gap-1">
              <MiniBadge type="T20" count={series.t20} />
              <MiniBadge type="ODI" count={series.odi} />
              <MiniBadge type="Test" count={series.test} />
            </div>
            {total > 0 && (
              <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <Hash size={12} /> {total}
              </div>
            )}
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
            {series.name}
          </h3>

          <div className="mt-auto flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} /> {series.startDate}
          </div>

          <div className="pt-3 mt-3 border-t flex justify-between text-blue-600 text-xs font-black">
            Full Schedule <ChevronRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const MiniBadge = ({ type, count }) => {
  if (!count) return null;
  return (
    <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
      {count} {type}
    </span>
  );
};

/* ===================== */

const LoadingGrid = () => (
  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    ))}
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="h-[60vh] flex flex-col items-center justify-center">
    <Info className="text-red-500 mb-4" size={36} />
    <p className="font-bold">Series service offline</p>
    <button onClick={onRetry} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 text-slate-400">
    No series match this filter.
  </div>
);
