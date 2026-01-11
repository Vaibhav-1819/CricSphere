import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Loader2, TrendingUp, Trophy, 
  Users, Globe, Zap, Activity, ChevronRight, 
  ArrowUpRight, Star, Filter, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../hooks/useFetch";

/* ---------- JANUARY 2026 ICC DATA (STATIC) ---------- */
const ICC_RANKINGS = {
  TEST: {
    TEAMS: [
      { rank: 1, team: "Australia", rating: 124, matches: 30 },
      { rank: 2, team: "South Africa", rating: 116, matches: 31 },
      { rank: 3, team: "England", rating: 112, matches: 40 },
    ],
    PLAYERS: [
      { rank: 1, name: "Joe Root", country: "ENG", rating: 867, role: "Batter" },
      { rank: 2, name: "Harry Brook", country: "ENG", rating: 846, role: "Batter" },
      { rank: 3, name: "Kane Williamson", country: "NZ", rating: 822, role: "Batter" },
    ]
  },
  ODI: {
    TEAMS: [
      { rank: 1, team: "India", rating: 121, matches: 42 },
      { rank: 2, team: "New Zealand", rating: 113, matches: 44 },
      { rank: 3, team: "Australia", rating: 109, matches: 38 },
    ],
    PLAYERS: [
      { rank: 1, name: "Rohit Sharma", country: "IND", rating: 781, role: "Batter" },
      { rank: 2, name: "Virat Kohli", country: "IND", rating: 773, role: "Batter" },
      { rank: 3, name: "Daryl Mitchell", country: "NZ", rating: 766, role: "Batter" },
    ]
  },
  T20: {
    TEAMS: [
      { rank: 1, team: "India", rating: 272, matches: 71 },
      { rank: 2, team: "Australia", rating: 267, matches: 42 },
      { rank: 3, team: "England", rating: 258, matches: 45 },
    ],
    PLAYERS: [
      { rank: 1, name: "Abhishek Sharma", country: "IND", rating: 908, role: "Batter" },
      { rank: 2, name: "Phil Salt", country: "ENG", rating: 849, role: "Batter" },
      { rank: 3, name: "Tilak Varma", country: "IND", rating: 805, role: "Batter" },
    ]
  }
};

export default function Stats() {
  const [format, setFormat] = useState("T20");

  return (
    // Fixed: max-w-6xl instead of 7xl to prevent the "enlarged" look
    <div className="min-h-screen bg-[#080a0f] text-white font-sans selection:bg-blue-500/30">
      
      {/* ===== PROFESSIONAL BROADCAST HEADER ===== */}
      <div className="relative py-8 md:py-12 px-6 bg-[#0b1220] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2">
               <div className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded text-[9px] font-black uppercase tracking-widest text-blue-400">
                 Global Hub
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">ICC Database Sync</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
               Official <span className="text-blue-500">Rankings.</span>
             </h1>
          </div>

          {/* Format Switcher - Smaller & Tighter */}
          <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            {["TEST", "ODI", "T20"].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-6 md:px-10 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  format === f ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ---------- TEAM RANKINGS TABLE (DOMINANT) ---------- */}
          <div className="lg:col-span-7">
            <div className="bg-[#111a2e] rounded-[2rem] border border-white/5 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <Trophy className="text-amber-500" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Team Standings</h3>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Season 2026</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 w-16">Rank</th>
                      <th className="px-6 py-4">Nation</th>
                      <th className="px-6 py-4 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ICC_RANKINGS[format].TEAMS.map((t) => (
                      <tr key={t.team} className="hover:bg-blue-600/5 transition-all group">
                        <td className="px-6 py-5 text-xl font-black text-slate-800 group-hover:text-blue-500 transition-colors">
                          0{t.rank}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-black text-[9px] text-slate-500 border border-white/10">
                               {t.team.substring(0,3).toUpperCase()}
                            </div>
                            <span className="text-md font-black uppercase tracking-tight text-slate-200">
                              {t.team}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-xl tracking-tighter text-blue-500">
                          {t.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ---------- PLAYER RANKINGS LIST (SIDEBAR) ---------- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111a2e] rounded-[2rem] border border-white/5 overflow-hidden shadow-xl">
               <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
                  <Star className="text-blue-500 fill-blue-500" size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">Top Batters</h3>
               </div>
               <div className="divide-y divide-white/5">
                  {ICC_RANKINGS[format].PLAYERS.map((p) => (
                    <div key={p.name} className="p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-slate-700 group-hover:text-blue-500 transition-colors">0{p.rank}</span>
                        <div>
                          <div className="font-black uppercase italic tracking-tighter text-slate-200 text-sm group-hover:text-white">{p.name}</div>
                          <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                             <Globe size={10} /> {p.country} • {p.role}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black tracking-tighter text-blue-500 leading-none">{p.rating}</div>
                        <div className="text-[8px] font-black text-emerald-500 uppercase mt-1">▲ Rising</div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Micro-Analytics Tile */}
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 group">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
                 <Activity size={14} className="text-blue-500" /> Market Intelligence
               </h4>
               <div className="space-y-4">
                  {["Virat Kohli", "Rishabh Pant", "Harry Brook"].map(name => (
                    <div key={name} className="flex justify-between items-center group/item cursor-pointer">
                      <span className="text-sm font-bold text-slate-400 group-hover/item:text-white transition-colors">{name}</span>
                      <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-black tracking-widest uppercase">
                         Pro Profile
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- BROADCAST LOGS (FOOTER) --- */}
      <footer className="max-w-6xl mx-auto px-6 pb-10 mt-10">
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
               Database Synced
             </div>
             <span>Region: Global</span>
           </div>
           <div className="flex items-center gap-2 text-slate-500">
              <BarChart3 size={12} /> CricSphere Analytics Engine v2.6
           </div>
        </div>
      </footer>
    </div>
  );
}