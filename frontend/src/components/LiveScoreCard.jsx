import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, AlertCircle, RefreshCcw, Clock, Radio, 
  Target, Trophy, ChevronRight, Activity 
} from "lucide-react";
import useFetch from "../hooks/useFetch";

/* --- ACCURACY ENGINES --- */

const isMatchDone = (status = "") => {
  const s = status.toLowerCase();
  return ["won", "draw", "tie", "abandon", "result"].some(key => s.includes(key));
};

const getBattingSide = (match) => {
  const status = match.status?.toLowerCase() || "";
  const [t1, t2] = match.teams;
  // Dynamic parsing of toss strings to find active batting side
  if (status.includes("opt to bat")) return status.split(" opt")[0].trim();
  if (status.includes("opt to bowl")) {
    const tossWinner = status.split(" opt")[0].trim();
    return tossWinner.toLowerCase() === t1.toLowerCase() ? t2 : t1;
  }
  return null;
};

const getScoreForTeam = (match, team) => {
  if (!Array.isArray(match.score)) return null;
  // Match team name to inning string for precision mapping
  return match.score.find(s => s.inning.toLowerCase().includes(team.toLowerCase()));
};

/* --- MAIN COMPONENT --- */

export default function LiveScore() {
  const { data, loading, error, reFetch } = useFetch("http://localhost:8081/api/v1/cricket/current-matches");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const i = setInterval(reFetch, 30000); // 30s Polling
    return () => clearInterval(i);
  }, [reFetch]);

  const { ongoing, results } = useMemo(() => {
    if (!data?.data) return { ongoing: [], results: [] };
    
    let processed = data.data.map(m => ({ ...m, done: isMatchDone(m.status) }));
    
    // Filtering by Match Type
    if (filter !== "all") {
      processed = processed.filter(m => m.matchType.toLowerCase() === filter);
    }

    processed.sort((a, b) => sortOrder === "desc" 
      ? b.dateTimeGMT.localeCompare(a.dateTimeGMT) 
      : a.dateTimeGMT.localeCompare(b.dateTimeGMT));

    return {
      ongoing: processed.filter(m => !m.done),
      results: processed.filter(m => m.done)
    };
  }, [data, sortOrder, filter]);

  if (loading && !data) return <div className="p-10 text-center text-slate-500 animate-pulse">Synchronizing match telemetry...</div>;
  if (error) return <ErrorState onRetry={reFetch} />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-[#0b1220] text-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Activity size={28} className="text-blue-500" /> Match Center
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Logic-Driven Realtime Feed</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
          {["all", "t20", "odi", "test"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </header>

      <MatchSection title="Ongoing" icon={<Radio size={14} className="text-red-500 animate-pulse" />} data={ongoing} isLive />
      <MatchSection title="Recent Results" icon={<CheckCircle2 size={14} className="text-emerald-500" />} data={results} />
    </div>
  );
}

const MatchSection = ({ title, icon, data, isLive }) => (
  <div className="mb-12">
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 bg-white/5 rounded-lg border border-white/10">{icon}</div>
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      <div className="h-px flex-1 bg-white/5" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.length > 0 ? data.map(m => <MatchCard key={m.id} match={m} isLive={isLive} />) : <p className="text-xs text-slate-600 italic">No matches found in this category.</p>}
    </div>
  </div>
);

const MatchCard = ({ match, isLive }) => {
  const [t1, t2] = match.teams;
  const battingNow = getBattingSide(match);
  const score1 = getScoreForTeam(match, t1);
  const score2 = getScoreForTeam(match, t2);
  const isBreak = match.status.toLowerCase().includes("break");
  
  // Highlighting winner logic
  const winner = isMatchDone(match.status) ? (match.status.toLowerCase().includes(t1.toLowerCase()) ? t1 : t2) : null;

  return (
    <motion.div layout className={`bg-[#111a2e] rounded-2xl p-6 border transition-all ${isLive ? 'border-blue-500/20 shadow-blue-500/5 shadow-xl' : 'border-white/5'}`}>
      <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase mb-6 tracking-widest">
        <span>{match.matchType}</span>
        {isLive && <span className="text-red-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE</span>}
      </div>

      <div className="space-y-4 mb-6">
        <TeamRow name={t1} score={score1} batting={battingNow === t1} winner={winner === t1} />
        <TeamRow name={t2} score={score2} batting={battingNow === t2} winner={winner === t2} />
      </div>

      <div className="pt-5 border-t border-white/5">
        <div className={`flex items-center gap-2 mb-2 text-[11px] font-bold ${isLive ? 'text-blue-400' : 'text-slate-400'}`}>
          <Target size={14}/> {isBreak ? <span className="text-amber-500 uppercase">Innings Break</span> : match.status}
        </div>
        <div className="text-slate-500 flex items-center gap-1 text-[10px] font-medium uppercase tracking-tighter">
          <MapPin size={12} className="text-blue-500"/> {match.venue?.split(',')[0]}
        </div>
      </div>
    </motion.div>
  );
};

const TeamRow = ({ name, score, batting, winner }) => (
  <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${batting ? 'bg-blue-500/10' : ''}`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-inner ${winner ? 'bg-emerald-600' : batting ? 'bg-blue-600' : 'bg-slate-700'}`}>
        {name.charAt(0)}
      </div>
      <span className={`text-sm font-black uppercase tracking-tight ${winner ? 'text-emerald-400' : batting ? 'text-blue-400' : 'text-slate-300'}`}>
        {name}
      </span>
      {batting && <span className="text-[14px] animate-bounce">🏏</span>}
    </div>
    <span className={`font-mono text-sm ${winner ? 'text-emerald-400 font-black' : 'text-white'}`}>
      {score ? `${score.r}/${score.w} (${score.o})` : "—"}
    </span>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="h-screen flex flex-col items-center justify-center text-center">
    <AlertCircle size={48} className="text-red-500 mb-4" />
    <h3 className="text-xl font-black">Sync Interrupted</h3>
    <button onClick={onRetry} className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 rounded-lg font-bold">
      <RefreshCcw size={16} /> Reconnect
    </button>
  </div>
);