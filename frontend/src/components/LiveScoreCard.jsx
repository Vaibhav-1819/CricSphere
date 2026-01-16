import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Radio, Target, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- 🧠 ENGINE ---------------- */

const isMatchDone = (status = "") => {
  const s = status.toLowerCase();
  return ["won", "draw", "tie", "abandon", "result", "complete"].some(k => s.includes(k));
};

/* ---------------- 🏛️ COMPONENT ---------------- */

export default function MatchFeed({ matches = [], title, isLiveFeed }) {
  const [filter, setFilter] = useState("all");

  const filteredMatches = useMemo(() => {
    if (filter === "all") return matches;
    return matches.filter(m => m.matchType?.toLowerCase() === filter);
  }, [matches, filter]);

  return (
    <div className="bg-[#0b1220] text-white rounded-[2.5rem] p-8 border border-white/5">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Activity size={20} className="text-blue-500" />
            </div>
            {title}
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 ml-12">
            {filteredMatches.length} Matches Found
          </p>
        </div>

        {/* Format Filter Chips */}
        <div className="flex bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-1.5">
          {["all", "t20", "odi", "test"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2 text-[10px] uppercase font-black rounded-xl transition-all duration-300 ${
                filter === t 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredMatches.map(m => (
            <MatchCard key={m.id} match={m} isLiveFeed={isLiveFeed} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------------- 🃏 CARD ---------------- */

const MatchCard = ({ match, isLiveFeed }) => {
  const navigate = useNavigate();
  const done = isMatchDone(match.status);
  
  // Logical highlight for Live vs Finished
  const cardBorder = !done && isLiveFeed 
    ? "border-blue-500/30 bg-[#151f35] shadow-2xl shadow-blue-500/5" 
    : "border-white/5 bg-[#111a2e]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, borderColor: "rgba(59, 130, 246, 0.5)" }}
      onClick={() => navigate(`/match/${match.id}`)}
      className={`group cursor-pointer rounded-3xl p-6 border transition-all duration-500 ${cardBorder}`}
    >
      <div className="flex justify-between items-center text-[10px] uppercase font-black mb-6">
        <span className="px-2 py-1 bg-white/5 rounded text-slate-400 group-hover:text-blue-400 transition-colors">
          {match.matchType}
        </span>
        {isLiveFeed && !done && (
          <span className="text-red-500 flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full">
            <Radio size={12} className="animate-pulse" /> LIVE
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <TeamRow 
          data={match.team1} 
          winner={match.winner === match.team1.name} 
          isBatting={match.team1.isBatting}
        />
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[9px] font-black text-slate-600 italic">VS</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <TeamRow 
          data={match.team2} 
          winner={match.winner === match.team2.name} 
          isBatting={match.team2.isBatting}
        />
      </div>

      <div className="pt-5 border-t border-white/5">
        <div className={`text-xs font-black uppercase tracking-tight leading-tight ${done ? "text-emerald-400" : "text-blue-400"}`}>
          {match.status}
        </div>

        <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <MapPin size={12} className="text-slate-600" /> {match.venue}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- 🏏 TEAM ROW ---------------- */

const TeamRow = ({ data, winner, isBatting }) => {
  return (
    <div className={`flex justify-between items-center p-3 rounded-2xl transition-colors ${
      isBatting ? "bg-blue-500/5 border border-blue-500/10" : "bg-transparent"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-transform ${
          winner ? "bg-emerald-600 scale-110 shadow-lg shadow-emerald-600/20" : 
          isBatting ? "bg-blue-600 animate-pulse" : "bg-slate-800"
        }`}>
          {data.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs uppercase font-black tracking-tighter ${
            winner ? "text-emerald-400" : isBatting ? "text-blue-400" : "text-slate-300"
          }`}>
            {data.name}
          </span>
          {isBatting && <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mt-0.5">Batting</span>}
        </div>
      </div>

      <div className="text-right">
        <div className="font-mono font-black text-sm">
          {data.runs || 0}<span className="text-slate-500">/</span>{data.wickets || 0}
        </div>
        <div className="text-[9px] font-bold text-slate-600 italic">
          {data.overs || 0} OV
        </div>
      </div>
    </div>
  );
};