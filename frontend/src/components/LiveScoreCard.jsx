import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Radio, Target, Trophy, Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- ENGINE ---------------- */

const isMatchDone = (status = "") => {
  const s = status.toLowerCase();
  return ["won", "draw", "tie", "abandon", "result"].some(k => s.includes(k));
};

/* ---------------- COMPONENT ---------------- */

export default function MatchFeed({ matches = [], title, isLive }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return matches;
    return matches.filter(m => m.matchType.toLowerCase() === filter);
  }, [matches, filter]);

  return (
    <div className="bg-[#0b1220] text-white rounded-3xl p-6">
      <header className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black uppercase flex items-center gap-2">
            <Activity size={18} className="text-blue-500" /> {title}
          </h2>
        </div>

        <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
          {["all", "t20", "odi", "test"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 text-[10px] uppercase font-black rounded-lg ${
                filter === t ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map(m => (
            <MatchCard key={m.id} match={m} isLive={isLive} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */

const MatchCard = ({ match, isLive }) => {
  const navigate = useNavigate();
  const done = isMatchDone(match.status);

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/match/${match.id}`)}
      className={`cursor-pointer bg-[#111a2e] rounded-2xl p-6 border transition-all ${
        !done ? "border-blue-500/20 shadow-blue-500/10 shadow-xl" : "border-white/5"
      }`}
    >
      <div className="flex justify-between text-[9px] uppercase font-black text-slate-500 mb-5">
        <span>{match.matchType}</span>
        {isLive && !done && (
          <span className="text-red-500 flex items-center gap-1">
            <Radio size={12} /> LIVE
          </span>
        )}
      </div>

      <div className="space-y-4 mb-5">
        <TeamRow data={match.team1} winner={match.winner === match.team1.name} />
        <TeamRow data={match.team2} winner={match.winner === match.team2.name} />
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className={`text-xs font-bold ${done ? "text-emerald-400" : "text-blue-400"}`}>
          <Target size={12} className="inline mr-1" />
          {match.status}
        </div>

        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 uppercase">
          <MapPin size={12} /> {match.venue}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- TEAM ---------------- */

const TeamRow = ({ data, winner }) => {
  return (
    <div className={`flex justify-between p-3 rounded-xl ${
      data.isBatting ? "bg-blue-500/10" : ""
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
          winner ? "bg-emerald-600" : data.isBatting ? "bg-blue-600" : "bg-slate-700"
        }`}>
          {data.name[0]}
        </div>
        <span className={`uppercase font-black ${
          winner ? "text-emerald-400" : data.isBatting ? "text-blue-400" : "text-slate-300"
        }`}>
          {data.name}
        </span>
        {data.isBatting && <span className="animate-bounce">🏏</span>}
      </div>

      <span className="font-mono font-bold">
        {data.runs}/{data.wickets} ({data.overs})
      </span>
    </div>
  );
};
