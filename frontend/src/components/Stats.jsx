import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Users,
  Swords,
  Shield,
  Loader2,
  Info,
  RefreshCcw,
  Search,
} from "lucide-react";
import axios from "../services/api";

/**
 * Ranking Types:
 * - teams -> /api/v1/cricket/rankings/international
 * - batsmen -> /api/v1/cricket/rankings/batsmen
 * - bowlers -> /api/v1/cricket/rankings/bowlers
 * - allrounders -> /api/v1/cricket/rankings/allrounders
 *
 * Params:
 * - format: test | odi | t20
 * - isWomen: "0" men, "1" women
 */

const RANK_TABS = [
  { key: "teams", label: "Teams", icon: <Users size={14} /> },
  { key: "batsmen", label: "Batters", icon: <Swords size={14} /> },
  { key: "bowlers", label: "Bowlers", icon: <Shield size={14} /> },
  { key: "allrounders", label: "All-Rounders", icon: <Star size={14} /> },
];

const FORMATS = ["TEST", "ODI", "T20"];

const safeText = (v, fallback = "") =>
  typeof v === "string" && v.trim() ? v : fallback;

export default function Rankings() {
  const [tab, setTab] = useState("teams");
  const [format, setFormat] = useState("T20");
  const [isWomen, setIsWomen] = useState("0");

  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");

  const endpoint = useMemo(() => {
    if (tab === "teams") return "/api/v1/cricket/rankings/international";
    return `/api/v1/cricket/rankings/${tab}`;
  }, [tab]);

  const fetchRankings = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await axios.get(endpoint, {
        params: {
          format: format.toLowerCase(),
          isWomen,
        },
      });

      setRawData(res.data);
    } catch (e) {
      console.error("Rankings fetch failed:", e);
      setError(true);
      setRawData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    // no auto refresh to protect quota
  }, [endpoint, format, isWomen]);

  const list = useMemo(() => {
    if (!rawData) return [];

    /**
     * Possible backend shapes:
     * - { rank: [...] }
     * - { rankings: [...] }
     * - { list: [...] }
     * - { data: [...] }
     */
    const items =
      rawData?.rank ||
      rawData?.rankings ||
      rawData?.list ||
      rawData?.data ||
      [];

    return Array.isArray(items) ? items : [];
  }, [rawData]);

  const filteredList = useMemo(() => {
    if (!search.trim()) return list;

    const q = search.toLowerCase();
    return list.filter((item) => {
      const name =
        item?.name || item?.teamName || item?.team || item?.country || "";
      return String(name).toLowerCase().includes(q);
    });
  }, [list, search]);

  const podium = useMemo(() => filteredList.slice(0, 3), [filteredList]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white pb-20">
      {/* HEADER */}
      <div className="py-12 md:py-14 bg-white dark:bg-[#080a0f] border-b border-black/10 dark:border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 dark:bg-blue-600/10 blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-600/10 dark:border-blue-500/20">
                  <Trophy size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  ICC Rankings
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                Global <span className="text-blue-600 dark:text-blue-500">Rankings</span>
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 flex items-center gap-2">
                <Trophy size={14} className="text-blue-600 dark:text-blue-500" />
                Rankings by format and category
              </p>
            </div>

            <button
              onClick={fetchRankings}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
            >
              <RefreshCcw size={14} />
              Refresh
            </button>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 p-2 rounded-2xl shadow-sm">
              {RANK_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    tab === t.key
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Format + Women */}
            <div className="flex flex-wrap gap-3 items-center justify-start lg:justify-end">
              <div className="flex bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 p-2 rounded-2xl shadow-sm">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      format === f
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsWomen((p) => (p === "0" ? "1" : "0"))}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm ${
                  isWomen === "1"
                    ? "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400"
                    : "bg-white dark:bg-[#080a0f] border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {isWomen === "1" ? "Women" : "Men"}
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team/player..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 text-sm font-semibold outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* BODY */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={44} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Loading Rankings
            </span>
          </div>
        ) : error ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
            <Info className="text-red-500" size={48} />
            <h2 className="text-xl font-black uppercase tracking-tight">
              Rankings Unavailable
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
              This rankings endpoint returned an error. Please retry.
            </p>
            <button
              onClick={fetchRankings}
              className="mt-4 px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Retry
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-90">
            <p className="text-3xl font-black uppercase tracking-tight text-slate-300 dark:text-slate-700">
              No Data Found
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Try switching format, tabs, or clearing search.
            </p>
          </div>
        ) : (
          <>
            {/* PODIUM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {podium.map((item, idx) => (
                <motion.div
                  key={item?.id || item?.name || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`rounded-3xl border p-7 relative overflow-hidden shadow-sm ${
                    idx === 0
                      ? "bg-gradient-to-br from-amber-500/15 to-transparent border-amber-500/20"
                      : "bg-white dark:bg-[#080a0f] border-black/10 dark:border-white/10"
                  }`}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[90px]" />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Rank
                      </p>
                      <p className="text-3xl font-black text-blue-600 dark:text-blue-500 font-mono">
                        {item?.rank || `0${idx + 1}`}
                      </p>
                    </div>

                    {idx === 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        Top
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <p className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      {item?.name || item?.teamName || item?.team || "Unknown"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
                      {safeText(
                        item?.country,
                        tab === "teams" ? "International" : "Player"
                      )}
                    </p>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Rating
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {item?.rating ?? item?.points ?? "-"}
                      </p>
                    </div>
                    <Trophy size={20} className="text-amber-500 opacity-70" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/40">
              <div className="p-7 md:p-8 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50/60 dark:bg-white/[0.02]">
                <h3 className="font-black uppercase tracking-widest text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  {tab.toUpperCase()} • {format} • {isWomen === "1" ? "Women" : "Men"}
                </h3>

                <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 bg-blue-600/10 px-3 py-1 rounded-full uppercase tracking-tighter border border-blue-600/10 dark:border-blue-500/20">
                  Cached • Quota Safe
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-black/10 dark:border-white/10">
                      <th className="p-6">Pos</th>
                      <th className="p-6">Name</th>
                      <th className="p-6">Country</th>
                      <th className="p-6 text-right">Rating</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-black/10 dark:divide-white/10">
                    <AnimatePresence mode="popLayout">
                      {filteredList.map((item, index) => {
                        const name =
                          item?.name || item?.teamName || item?.team || "Unknown";
                        const country =
                          item?.country ||
                          item?.team ||
                          (tab === "teams" ? "International" : "-");
                        const rating = item?.rating ?? item?.points ?? "-";
                        const rank = item?.rank || index + 1;

                        return (
                          <motion.tr
                            key={item?.id || name || index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="p-6 text-blue-600 dark:text-blue-500 font-black font-mono">
                              {rank < 10 ? `0${rank}` : rank}
                            </td>

                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <span className="font-black uppercase tracking-tight text-base text-slate-900 dark:text-white">
                                  {name}
                                </span>

                                {index === 0 && (
                                  <Star
                                    size={12}
                                    className="text-amber-500 fill-amber-500"
                                  />
                                )}
                              </div>
                            </td>

                            <td className="p-6">
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                {country}
                              </span>
                            </td>

                            <td className="p-6 text-right font-black text-2xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                              {rating}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
