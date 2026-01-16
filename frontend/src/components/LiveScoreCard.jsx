import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Radio, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- 🧠 ENGINE ---------------- */

const isMatchDone = (status = "") => {
  const s = String(status).toLowerCase();
  return ["won", "draw", "tie", "abandon", "result", "complete"].some((k) =>
    s.includes(k)
  );
};

/* ---------------- 🏛️ COMPONENT ---------------- */

export default function MatchFeed({ matches = [], title, isLiveFeed = false }) {
  const [filter, setFilter] = useState("all");

  const filteredMatches = useMemo(() => {
    if (filter === "all") return matches;

    // Sync with 'matchFormat' field from the backend
    return matches.filter(
      (m) => m?.matchInfo?.matchFormat?.toLowerCase() === filter
    );
  }, [matches, filter]);

  return (
    <div className="bg-[#0b1220] text-white rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 rounded-2xl">
            <Activity size={24} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {title}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
              {filteredMatches.length} Matches in Feed
            </p>
          </div>
        </div>

        <div className="flex bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-1.5">
          {["all", "t20", "odi", "test"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2 text-[10px] uppercase font-black rounded-xl transition-all duration-300 ${
                filter === t
                  ? "bg-blue-600 text-white shadow-lg"
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
          {filteredMatches.map((m) => (
            <MatchCard
              key={m?.matchInfo?.matchId}
              match={m}
              isLiveFeed={isLiveFeed}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------------- 🃏 CARD ---------------- */

const MatchCard = ({ match, isLiveFeed }) => {
  const navigate = useNavigate();

  const info = match?.matchInfo || {};
  const score = match?.matchScore || {};
  const done = isMatchDone(info.status);

  const cardBorder =
    !done && isLiveFeed
      ? "border-blue-500/30 bg-[#151f35] shadow-2xl shadow-blue-500/10"
      : "border-white/5 bg-[#111a2e]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, borderColor: "rgba(59, 130, 246, 0.5)" }}
      onClick={() => navigate(`/match/${info.matchId}`)}
      className={`group cursor-pointer rounded-[2rem] p-6 border transition-all duration-500 ${cardBorder}`}
    >
      <div className="flex justify-between items-center text-[10px] uppercase font-black mb-6">
        <span className="px-2 py-1 bg-white/5 rounded text-slate-500 group-hover:text-blue-400">
          {info.matchFormat || "NA"}
        </span>

        {isLiveFeed && !done && (
          <span className="text-red-500 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full animate-pulse">
            <Radio size={10} /> LIVE
          </span>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <TeamRow
          name={info?.team1?.teamName}
          score={score?.team1Score?.inngs1}
          isBatting={!!score?.team1Score?.inngs1 && !score?.team2Score?.inngs1}
        />

        <div className="flex items-center gap-4 opacity-20">
          <div className="h-px flex-1 bg-white" />
          <span className="text-[8px] font-black italic">VS</span>
          <div className="h-px flex-1 bg-white" />
        </div>

        <TeamRow
          name={info?.team2?.teamName}
          score={score?.team2Score?.inngs1}
          isBatting={!!score?.team2Score?.inngs1}
        />
      </div>

      <div className="pt-5 border-t border-white/5">
        <div
          className={`text-xs font-black uppercase tracking-tight italic ${
            done ? "text-emerald-400" : "text-blue-400"
          }`}
        >
          {info.status || "Status unavailable"}
        </div>

        <div className="text-[9px] text-slate-500 mt-2 flex items-center gap-1.5 font-bold uppercase">
          <MapPin size={10} />{" "}
          {info?.venueInfo?.shortName || "International Venue"}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- 🏏 TEAM ROW ---------------- */

const TeamRow = ({ name, score, isBatting }) => {
  const safeName = name || "NA";

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-2xl transition-all ${
        isBatting ? "bg-blue-600/10 ring-1 ring-blue-500/20" : "bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
            isBatting ? "bg-blue-600" : "bg-slate-800"
          }`}
        >
          {safeName.substring(0, 2).toUpperCase()}
        </div>

        <span
          className={`text-[11px] uppercase font-black tracking-tight ${
            isBatting ? "text-blue-400" : "text-slate-300"
          }`}
        >
          {safeName}
        </span>
      </div>

      <div className="text-right">
        <div className="font-mono font-black text-sm">
          {score?.runs ?? 0}
          <span className="text-slate-600">/</span>
          {score?.wickets ?? 0}
        </div>

        <div className="text-[8px] font-bold text-slate-600 italic uppercase">
          {score?.overs ?? 0} OV
        </div>
      </div>
    </div>
  );
};
