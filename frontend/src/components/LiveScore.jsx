import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  RefreshCcw,
  AlertCircle,
  Loader2,
  ChevronRight,
  Zap,
  Activity
} from "lucide-react";
import { getLiveMatches } from "../services/api";

export default function LiveScore() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getLiveMatches();
      
      /**
       * 🟢 CRITICAL FIX: DATA MAPPING
       * RapidAPI Cricbuzz Structure: res.data.typeMatches -> seriesMatches -> seriesAdWrapper -> matches
       */
      const typeMatches = res.data?.typeMatches || [];
      const extractedMatches = [];

      typeMatches.forEach((type) => {
        type.seriesMatches.forEach((series) => {
          if (series.seriesAdWrapper?.matches) {
            extractedMatches.push(...series.seriesAdWrapper.matches);
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
    const t = setInterval(load, 60000); 
    return () => clearInterval(t);
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState retry={load} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="container relative mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Trophy className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Match <span className="text-blue-600">Center</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Real-Time Analytics Dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Telemetry Active</span>
          </div>
        </header>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {matches.map((m) => (
              <MatchCard key={m.matchInfo.matchId} match={m} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Activity className="text-slate-200 mb-4" size={64} />
            <p className="text-lg font-bold text-slate-400">No active matches found in the arena.</p>
            <p className="text-sm text-slate-300">Syncing with global servers...</p>
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

  const isLiveMatch = info.status.toLowerCase().includes("live") || 
                      info.status.toLowerCase().includes("opt") ||
                      info.status.toLowerCase().includes("trail");

  return (
    <div
      onClick={() => nav(`/match/${info.matchId}`)}
      className="group cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
    >
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {info.matchFormat} • {info.seriesName}
        </span>
        {isLiveMatch && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 rounded">
             <Zap size={10} className="text-red-600 fill-red-600" />
             <span className="text-red-600 text-[9px] font-black uppercase">Live</span>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-slate-800">{info.team1.teamName}</span>
          <span className="text-lg font-black text-slate-900">
            {score?.team1Score?.inngs1 ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets}` : "0/0"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-slate-800">{info.team2.teamName}</span>
          <span className="text-lg font-black text-slate-400">
             {score?.team2Score?.inngs1 ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets}` : "Yet to Bat"}
          </span>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900 flex items-center justify-between group-hover:bg-blue-600 transition-colors">
        <p className="text-[10px] font-bold text-white uppercase truncate">
          {info.status}
        </p>
        <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

/* =========================
   States
========================= */
const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Initializing Arena Link</span>
  </div>
);

const ErrorState = ({ retry }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-white">
    <AlertCircle className="text-red-500 mb-4" size={48} />
    <h3 className="text-slate-900 font-black uppercase text-sm mb-2">Sync Error</h3>
    <p className="text-slate-400 text-xs mb-8">Unable to establish telemetry connection.</p>
    <button
      onClick={retry}
      className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all"
    >
      <RefreshCcw size={14} /> Reconnect Feed
    </button>
  </div>
);