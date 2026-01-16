import React, { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Globe,
  Star,
  Activity,
  BarChart3,
  ChevronUp,
  Loader2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function Stats() {
  const [format, setFormat] = useState("T20"); // TEST, ODI, T20
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await api.get("/api/v1/cricket/rankings/international", {
          params: {
            format: format.toLowerCase(),
            isWomen: "0",
          },
        });

        if (!mounted) return;
        setRawData(res.data);
      } catch (e) {
        console.error("Failed to fetch rankings", e);
        if (!mounted) return;
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [format]);

  const displayData = useMemo(() => {
    if (!rawData) return { teams: [] };

    // Cricbuzz rankings usually return "rank" array
    const teams = rawData?.rank || rawData?.rankings || [];

    return { teams };
  }, [rawData]);

  if (loading)
    return (
      <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Decrypting Ranking Matrices
        </span>
      </div>
    );

  if (error)
    return (
      <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4 text-center px-6">
        <Info className="text-red-500" size={48} />
        <h2 className="text-xl font-black uppercase tracking-tight text-white">
          Rankings Offline
        </h2>
        <p className="text-slate-500 text-sm">
          Unable to fetch ICC rankings right now. Try again later.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#080a0f] text-white pb-20">
      {/* 🟢 DYNAMIC HEADER */}
      <div className="py-16 bg-[#0b1220] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              World <span className="text-blue-500">Rankings</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
              <Activity size={14} className="text-blue-500" /> ICC Global Telemetry
            </p>
          </div>

          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
            {["TEST", "ODI", "T20"].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-8 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${
                  format === f
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔵 DATA GRID */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- TEAM RANKINGS --- */}
        <motion.div
          layout
          className="col-span-12 bg-[#111a2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3 text-slate-400">
              <Trophy className="text-amber-500" size={18} /> National Teams
            </h3>
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
              ICC {format} Standard
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Pos</th>
                  <th className="p-6">Nation</th>
                  <th className="p-6 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {displayData.teams.map((t, index) => (
                    <motion.tr
                      key={t.id || t.name || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-6 text-blue-500 font-black font-mono">
                        {t.rank || (index + 1 < 10 ? `0${index + 1}` : index + 1)}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <span className="font-black uppercase tracking-tighter text-lg">
                            {t.name || t.teamName || "Unknown"}
                          </span>
                          {index === 0 && (
                            <Star
                              size={12}
                              className="text-amber-500 fill-amber-500"
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-right font-black text-2xl group-hover:text-blue-500 transition-colors">
                        {t.rating ?? t.points ?? "-"}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* 🟠 FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            ICC Database Synced
          </span>
          <span className="text-slate-800">|</span>
          <span className="text-blue-500/50">RapidAPI Node Active</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={12} className="text-blue-500" /> CricSphere Analytics
          Engine v1.0
        </div>
      </footer>
    </div>
  );
}
