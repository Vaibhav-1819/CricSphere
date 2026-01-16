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
    <div className="bg-white dark:bg-[#080a0f] text-slate-900 dark:text-white rounded-[2.5rem] p-6 md:p-8 border border-black/10 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-600/10 dark:border-blue-500/20 shadow-sm">
            <Activity size={22} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {title}
            </h2>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.22em] mt-1">
              {filteredMatches.length} Matches
            </p>
          </div>
        </div>

        <div className="flex bg-white dark:bg-[#05070c] rounded-2xl border border-black/10 dark:border-white/10 p-1.5 shadow-sm">
          {["all", "t20", "odi", "test"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2 text-[10px] uppercase font-black rounded-xl transition-all duration-300 ${
                filter === t
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
      ? "border-blue-500/30 bg-blue-600/5 dark:bg-blue-600/10 shadow-xl shadow-blue-600/10"
      : "border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/match/${info.matchId}`)}
      className={`group cursor-pointer rounded-3xl p-6 border transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 ${cardBorder}`}
    >
      <div className="flex justify-between items-center text-[10px] uppercase font-black mb-5">
        <span className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10">
          {info.matchFormat || "NA"}
        </span>

        {isLiveFeed && !done && (
          <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 animate-pulse">
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

        <div className="flex items-center gap-4 opacity-25">
          <div className="h-px flex-1 bg-black dark:bg-white" />
          <span className="text-[8px] font-black italic text-slate-500 dark:text-slate-400">
            VS
          </span>
          <div className="h-px flex-1 bg-black dark:bg-white" />
        </div>

        <TeamRow
          name={info?.team2?.teamName}
          score={score?.team2Score?.inngs1}
          isBatting={!!score?.team2Score?.inngs1}
        />
      </div>

      <div className="pt-5 border-t border-black/10 dark:border-white/10">
        <div
          className={`text-xs font-black tracking-tight ${
            done
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-blue-600 dark:text-blue-500"
          }`}
        >
          {info.status || "Status unavailable"}
        </div>

        <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5 font-black uppercase tracking-widest">
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
      className={`flex justify-between items-center p-3 rounded-2xl transition-all border ${
        isBatting
          ? "bg-blue-600/10 border-blue-500/20"
          : "bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black shadow-sm ${
            isBatting
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-white dark:bg-white/10"
          }`}
        >
          {safeName.substring(0, 2).toUpperCase()}
        </div>

        <span
          className={`text-[11px] uppercase font-black tracking-tight truncate ${
            isBatting
              ? "text-blue-700 dark:text-blue-400"
              : "text-slate-800 dark:text-slate-200"
          }`}
        >
          {safeName}
        </span>
      </div>

      <div className="text-right">
        <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
          {score?.runs ?? 0}
          <span className="text-slate-400 dark:text-slate-600">/</span>
          {score?.wickets ?? 0}
        </div>

        <div className="text-[8px] font-black text-slate-500 dark:text-slate-400 italic uppercase tracking-widest">
          {score?.overs ?? 0} OV
        </div>
      </div>
    </div>
  );
};
