import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  AlertCircle,
  RefreshCcw,
  Clock,
  Radio,
  Trophy,
  CheckCircle2,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

/* ---------------- MATCH STATE HELPERS ---------------- */

const isMatchDone = (status = "") => {
  const s = status.toLowerCase();
  return ["won", "draw", "tie", "abandon", "no result", "result"].some(k => s.includes(k));
};

const isBreak = (status = "") =>
  status.toLowerCase().includes("innings break");

/* ---------------- PRECISION ENGINES ---------------- */

const getLastCompletedInnings = (match) => {
  if (!Array.isArray(match.score)) return null;
  return match.score.filter(i => i.r !== undefined).slice(-2);
};

const getLiveInnings = (match) => {
  if (!Array.isArray(match.score) || match.score.length === 0) return null;
  return match.score[match.score.length - 1];
};

const getBattingTeam = match => {
  const live = getLiveInnings(match);
  if (!live) return null;

  return match.teams.find(t =>
    live.inning.toLowerCase().includes(t.toLowerCase())
  );
};

const getWinner = match => {
  if (match.matchWinner) return match.matchWinner;

  const [t1, t2] = match.teams;
  const status = match.status.toLowerCase();

  if (status.includes("won")) {
    if (status.includes(t1.toLowerCase())) return t1;
    if (status.includes(t2.toLowerCase())) return t2;
  }

  const innings = getLastCompletedInnings(match);
  if (!innings || innings.length < 2) return null;

  const i1 = innings[0];
  const i2 = innings[1];

  const team1Runs = i1.inning.toLowerCase().includes(t1.toLowerCase()) ? i1.r : i2.r;
  const team2Runs = i2.inning.toLowerCase().includes(t1.toLowerCase()) ? i2.r : i1.r;

  return team1Runs > team2Runs ? t1 : (team2Runs > team1Runs ? t2 : null);
};

const getTeamScore = (match, team) => {
  if (!Array.isArray(match.score)) return null;
  return match.score.find(s =>
    s.inning?.toLowerCase().includes(team.toLowerCase())
  );
};

/* ---------------- TARGET + RATES ---------------- */

const getMatchContext = (match) => {
  const scores = match.score || [];
  const first = scores[0];
  const current = getLiveInnings(match);

  if (!first || !current) return null;

  const oversLimit =
    match.matchType?.toLowerCase() === "t20" ? 20 :
    match.matchType?.toLowerCase() === "odi" ? 50 : null;

  if (scores.length === 1 && !isBreak(match.status)) {
    const cr = first.o > 0 ? (first.r / first.o).toFixed(2) : null;
    return { phase: "first", cr };
  }

  if (isBreak(match.status)) {
    return { phase: "break", target: first.r + 1 };
  }

  if (scores.length >= 2 && oversLimit) {
    const target = first.r + 1;
    const runsLeft = target - current.r;
    const oversLeft = oversLimit - current.o;
    const rrr = oversLeft > 0 ? (runsLeft / oversLeft).toFixed(2) : null;

    return { phase: "chase", runsLeft, oversLeft, rrr };
  }

  return null;
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function LiveScore() {
  const { data, loading, error, reFetch } = useFetch(
    "http://localhost:8081/api/v1/cricket/current-matches"
  );
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const t = setInterval(reFetch, 30000);
    return () => clearInterval(t);
  }, [reFetch]);

  const { live, results } = useMemo(() => {
    if (!data?.data) return { live: [], results: [] };

    const all = data.data.map(m => ({
      ...m,
      done: isMatchDone(m.status)
    }));

    const sorted = [...all].sort((a, b) =>
      sortOrder === "desc"
        ? b.dateTimeGMT.localeCompare(a.dateTimeGMT)
        : a.dateTimeGMT.localeCompare(b.dateTimeGMT)
    );

    return {
      live: sorted.filter(m => !m.done),
      results: sorted.filter(m => m.done)
    };
  }, [data, sortOrder]);

  if (loading) return <LoadingGrid />;
  if (error) return <ErrorState onRetry={reFetch} />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 min-h-screen bg-[#0b1220] text-white">
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3">
          <Trophy className="text-amber-400" size={28} />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Match Center</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Logic-Driven Realtime Feed</p>
          </div>
        </div>
        <button
          onClick={() => setSortOrder(p => (p === "asc" ? "desc" : "asc"))}
          className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <Clock size={14} /> {sortOrder === "desc" ? "Latest" : "Oldest"}
        </button>
      </header>

      <Section title="Ongoing" live data={live} />
      <Section title="Recent Results" data={results} />
    </div>
  );
}

const Section = ({ title, live, data }) => (
  <div className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-white/5 rounded-lg border border-white/10">
        {live ? <Radio className="text-red-500 animate-pulse" size={16} /> : <CheckCircle2 className="text-emerald-500" size={16} />}
      </div>
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      <div className="h-px flex-1 bg-white/5" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {data.map(m => <MatchCard key={m.id} match={m} />)}
      </AnimatePresence>
    </div>
  </div>
);

/* ---------------- MATCH CARD ---------------- */

const MatchCard = ({ match }) => {
  const navigate = useNavigate();

  const [t1, t2] = match.teams;
  const s1 = getTeamScore(match, t1);
  const s2 = getTeamScore(match, t2);

  const done = isMatchDone(match.status);
  const batting = getBattingTeam(match);
  const winner = done ? getWinner(match) : null;
  const context = getMatchContext(match);

  const handleCardClick = () => {
    navigate(`/match/${match.id}`, {
      state: { matchData: match } // The key 'matchData' must match MatchDetail extraction
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`cursor-pointer bg-[#111a2e] border rounded-2xl p-6 transition-all ${!done ? 'border-blue-500/20 shadow-blue-500/5 shadow-xl' : 'border-white/5'}`}
    >
      <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase mb-6 tracking-widest">
        <span>{match.matchType}</span>
        {!done && <span className="text-red-500 flex items-center gap-1.5"><Radio size={10} /> LIVE</span>}
      </div>

      <div className="space-y-3 mb-6">
        <TeamRow name={t1} score={s1} batting={!winner && batting === t1} winner={winner === t1} />
        <TeamRow name={t2} score={s2} batting={!winner && batting === t2} winner={winner === t2} />
      </div>

      {context && !done && (
        <div className="text-[10px] text-center text-blue-400 font-bold bg-blue-400/5 py-2 rounded-lg mb-4">
          {context.phase === "first" && `CRR ${context.cr}`}
          {context.phase === "break" && `Target ${context.target}`}
          {context.phase === "chase" && `Need ${context.runsLeft} from ${context.oversLeft.toFixed(1)} ov (RRR ${context.rrr})`}
        </div>
      )}

      <div className="pt-4 border-t border-white/5">
        <div className={`flex items-center gap-2 mb-2 text-[11px] font-bold ${!done ? 'text-blue-400' : 'text-emerald-500'}`}>
          <Target size={14}/> {match.status}
        </div>
        <div className="text-slate-500 flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter">
          <MapPin size={12} className="text-blue-500/50" /> {match.venue?.split(',')[0]}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------- TEAM ROW ---------------- */

const TeamRow = ({ name, score, batting, winner }) => {
  const highlight =
    winner ? "bg-emerald-500/20 ring-1 ring-emerald-400/50"
    : batting ? "bg-blue-500/20 ring-1 ring-blue-400/50"
    : "";

  const color =
    winner ? "text-emerald-400 font-black"
    : batting ? "text-blue-400 font-semibold"
    : "text-slate-300";

  return (
    <div className={`flex justify-between items-center px-3 py-2 rounded-lg transition-all ${highlight}`}>
      <div className="flex items-center gap-2">
        <span className={`uppercase text-sm tracking-tight ${color}`}>{name}</span>
        {batting && <span className="text-[14px] animate-bounce">🏏</span>}
        {winner && <Trophy size={10} className="text-emerald-400" />}
      </div>
      <span className={`font-mono text-sm ${winner ? 'text-emerald-400 font-black' : 'text-white'}`}>
        {score ? `${score.r}/${score.w} (${score.o})` : "—"}
      </span>
    </div>
  );
};

/* ---------------- FEEDBACK STATES ---------------- */

const LoadingGrid = () => (
  <div className="p-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse bg-[#0b1220] h-screen">
    {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-[#111a2e] rounded-2xl" />)}
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#0b1220] text-center">
    <AlertCircle size={48} className="text-red-500 mb-4" />
    <h3 className="text-xl font-black text-white">Sync Interrupted</h3>
    <button onClick={onRetry} className="mt-6 px-8 py-3 bg-blue-600 rounded-xl font-bold">
      <RefreshCcw size={16} /> Retry Sync
    </button>
  </div>
);
