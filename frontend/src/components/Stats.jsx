import React, { useEffect, useState } from "react";
import {
  Trophy, Globe, Star, Activity, BarChart3, ChevronUp, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../services/api";
export default function Stats() {
  const [format, setFormat] = useState("T20");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/v1/cricket/rankings")
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [format]);

  if (loading) {
    return (
      <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing ICC Database</span>
      </div>
    );
  }

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
              <Activity size={14} className="text-blue-500" /> Live ICC Telemetry
            </p>
          </div>

          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
            {["TEST", "ODI", "T20"].map(f => (
              <button key={f}
                onClick={() => setFormat(f)}
                className={`px-8 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${
                  format === f ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔵 MAIN DATA GRID */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- TEAM RANKINGS --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-7 bg-[#111a2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3 text-slate-400">
              <Trophy className="text-amber-500" size={18}/> National Teams
            </h3>
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase">Top 10</span>
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
              <tbody>
                <AnimatePresence mode="wait">
                  {data?.teams?.map((t, index) => (
                    <motion.tr 
                      key={t.team}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-6 text-blue-500 font-black font-mono">
                        {t.rank < 10 ? `0${t.rank}` : t.rank}
                      </td>
                      <td className="p-6 font-black uppercase tracking-tighter text-lg">{t.team}</td>
                      <td className="p-6 text-right">
                        <span className="text-2xl font-black text-white group-hover:text-blue-500 transition-colors">
                          {t.rating}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- PLAYER RANKINGS --- */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-5 bg-[#111a2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-blue-600/5">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3 text-slate-400">
              <Star className="text-blue-500" size={18}/> Elite Batters
            </h3>
            <ChevronUp className="text-emerald-500 animate-bounce" size={18} />
          </div>

          <div className="flex-1">
            {data?.players?.map((p, index) => (
              <motion.div 
                key={p.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border-b border-white/5 flex justify-between items-center group hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-5">
                  <div className="text-xs font-black text-slate-700">{index + 1}</div>
                  <div>
                    <div className="font-black uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{p.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                      <Globe size={10} className="text-slate-600"/> {p.country}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-500 italic">{p.rating}</div>
              </motion.div>
            ))}
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
          <span>Verified Protocol</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={12} className="text-blue-500"/> CricSphere Analytics Engine v1.0
        </div>
      </footer>
    </div>
  );
}