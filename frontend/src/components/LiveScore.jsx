import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  RefreshCcw,
  AlertCircle,
  Loader2,
  ChevronRight,
  Zap,
  Activity,
} from "lucide-react";
// ✅ Fix 1: Modularized Import
import { matchApi } from "../services/api";

export default function LiveScore() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      // ✅ Fix 1.1: Using modularized API call
      const res = await matchApi.getLive();

      /**
       * ✅ Fix 2: Data mapping crash fix (Safe Optional Chaining)
       * Prevents app from crashing if typeMatches or seriesMatches is missing.
       */
      const typeMatches = res.data?.typeMatches || [];
      const extractedMatches = [];

      typeMatches.forEach((type) => {
        (type.seriesMatches || []).forEach((series) => {
          const matchesList = series?.seriesAdWrapper?.matches;
          if (Array.isArray(matchesList)) {
            extractedMatches.push(...matchesList);
          }
        });
      });

      setMatches(extractedMatches);
      setError(false);
    } catch (err) {
      console.error("Live Score Sync Failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // ✅ Fix 3: Avoid hitting backend every 60s (Changed to 120,000ms / 2 mins)
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState retry={load} />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-600/10 dark:border-blue-500/20 shadow-sm">
              <Trophy size={24} />
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                Match <span className="text-blue-600 dark:text-blue-500">Center</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mt-2">
                Live Scores & Updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-[#080a0f] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
              Live Feed Active
            </span>
          </div>
        </header>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((m) => (
              <MatchCard key={m.matchInfo.matchId} match={m} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 bg-white dark:bg-[#080a0f] rounded-3xl border border-black/10 dark:border-white/10 shadow-sm">
            <Activity className="text-slate-200 dark:text-slate-700 mb-4" size={64} />
            <p className="text-lg font-bold text-slate-500 dark:text-slate-300">
              No live matches right now
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Waiting for the next update...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   Match Card (Professional Theme)
========================= */
const MatchCard = ({ match }) => {
  const nav = useNavigate();
  const info = match.matchInfo;
  const score = match.matchScore;

  const isLiveMatch =
    info.status.toLowerCase().includes("live") ||
    info.status.toLowerCase().includes("opt") ||
    info.status.toLowerCase().includes("trail");

  return (
    <div
      onClick={() => nav(`/match/${info.matchId}`)}
      className="group cursor-pointer bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 transition-all duration-300"
    >
      <div className="px-6 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-black/10 dark:border-white/10 flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest line-clamp-1">
          {info.matchFormat} • {info.seriesName}
        </span>

        {isLiveMatch && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <Zap size={10} className="text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" />
            <span className="text-red-600 dark:text-red-400 text-[9px] font-black uppercase">
              Live
            </span>
          </div>
        )}
      </div>

      <div className="p-7 space-y-5">
        <div className="flex justify-between items-center gap-4">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {info.team1.teamName}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {score?.team1Score?.inngs1
              ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets}`
              : "0/0"}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {info.team2.teamName}
          </span>
          <span className="text-lg font-black text-slate-400 dark:text-slate-500">
            {score?.team2Score?.inngs1
              ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets}`
              : "Yet to Bat"}
          </span>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900 dark:bg-white/[0.03] flex items-center justify-between group-hover:bg-blue-600 transition-colors">
        <p className="text-[10px] font-black text-white uppercase truncate">
          {info.status}
        </p>
        <ChevronRight
          size={16}
          className="text-white/40 group-hover:text-white transition-colors"
        />
      </div>
    </div>
  );
};

/* =========================
   States
========================= */
const LoadingState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#05070c]">
    <Loader2 className="animate-spin text-blue-600 dark:text-blue-500 mb-4" size={40} />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
      Loading Live Scores
    </span>
  </div>
);

const ErrorState = ({ retry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#05070c] px-6 text-center">
    <AlertCircle className="text-red-500 mb-4" size={48} />
    <h3 className="text-slate-900 dark:text-white font-black uppercase text-sm mb-2">
      Sync Error
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-xs mb-8">
      Unable to load live matches right now. Please retry.
    </p>
    <button
      onClick={retry}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      <RefreshCcw size={14} /> Retry
    </button>
  </div>
);
