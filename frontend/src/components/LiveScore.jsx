import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radio,
  Trophy,
  RefreshCcw,
  AlertCircle,
  Loader2,
  ChevronRight,
  Zap
} from "lucide-react";
import { getLiveMatches } from "../services/api";

/* =========================
   Helpers
========================= */
const isLive = (status = "") => {
  const s = status.toLowerCase();
  return s.includes("need") || s.includes("trail") || s.includes("lead") || s.includes("opt");
};

/* =========================
   Page
========================= */
export default function LiveScore() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      const res = await getLiveMatches();
      // 🟢 DEFENSIVE MAPPING: Ensures 'matches' is always an array
      const data = res.data?.type || res.data?.matches || (Array.isArray(res.data) ? res.data : []);
      setMatches(data);
      setError(false);
    } catch (err) {
      console.error("Live Score Sync Failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60000); // 1 min for live scores
    return () => clearInterval(t);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState retry={load} />;

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-200 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <Trophy className="text-amber-500" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                Live Match <span className="text-blue-500">Center</span>
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Global Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Telemetry Active</span>
          </div>
        </header>

        {/* 🟢 Defensive Map Check */}
        {Array.isArray(matches) && matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {matches.map((m) => (
              <MatchCard key={m.matchId} match={m} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <Radio className="text-slate-800 mb-4" size={48} />
            <p className="text-sm font-bold text-slate-500">No active matches found in the arena.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   Match Card (Glassmorphism)
========================= */
const MatchCard = ({ match }) => {
  const nav = useNavigate();

  const t1 = match.team1?.teamName || "Team 1";
  const t2 = match.team2?.teamName || "Team 2";
  const s1 = match.matchScore?.team1Score?.inngs1;
  const s2 = match.matchScore?.team2Score?.inngs1;

  return (
    <div
      onClick={() => nav(`/match/${match.matchId}`)}
      className="group cursor-pointer bg-[#111827]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all duration-500 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded uppercase border border-blue-500/20">
          {match.matchFormat}
        </span>
        {isLive(match.status) && (
          <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest">
            <Zap size={12} className="fill-red-500" /> Live Now
          </span>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <ScoreRow name={t1} score={s1} />
        <ScoreRow name={t2} score={s2} />
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-black text-emerald-500 uppercase italic truncate pr-4">
          {match.status}
        </p>
        <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  );
};

const ScoreRow = ({ name, score }) => (
  <div className="flex justify-between items-center group-hover:translate-x-1 transition-transform">
    <span className="text-sm font-black text-slate-300 group-hover:text-white">{name}</span>
    <span className="text-sm font-mono font-black text-white bg-white/5 px-2 py-1 rounded">
      {score ? `${score.runs}/${score.wickets}` : "0/0"}
    </span>
  </div>
);

/* =========================
   States
========================= */
const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f]">
    <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing Arena Data</span>
  </div>
);

const ErrorState = ({ retry }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f]">
    <AlertCircle className="text-red-500 mb-4" size={48} />
    <h3 className="text-white font-black uppercase text-sm mb-6">Telemetry Connection Lost</h3>
    <button
      onClick={retry}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-600/20"
    >
      <RefreshCcw size={14} /> Reconnect
    </button>
  </div>
);