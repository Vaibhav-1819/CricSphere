import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radio,
  Trophy,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { getLiveMatches } from "../services/api";

/* =========================
   Helpers
========================= */
const isLive = (status = "") =>
  status.toLowerCase().includes("need") ||
  status.toLowerCase().includes("trail") ||
  status.toLowerCase().includes("lead");

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
      setMatches(res.data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 120000); // 2 min
    return () => clearInterval(t);
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error retry={load} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080a0f]">
      <div className="container mx-auto px-4 py-10">
        <header className="flex items-center gap-3 mb-10">
          <Trophy className="text-amber-500" />
          <h1 className="text-3xl font-black dark:text-white">
            Live Match Center
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((m) => (
            <MatchCard key={m.matchId} match={m} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Match Card
========================= */
const MatchCard = ({ match }) => {
  const nav = useNavigate();

  const t1 = match.team1?.teamName;
  const t2 = match.team2?.teamName;
  const s1 = match.matchScore?.team1Score?.inngs1;
  const s2 = match.matchScore?.team2Score?.inngs1;

  return (
    <div
      onClick={() => nav(`/match/${match.matchId}`)}
      className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-xl transition"
    >
      <div className="flex justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase">
          {match.matchFormat}
        </span>
        {isLive(match.status) && (
          <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
            <Radio size={12} /> LIVE
          </span>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <Row name={t1} score={s1} />
        <Row name={t2} score={s2} />
      </div>

      <p className="text-xs text-blue-600 font-bold truncate">
        {match.status}
      </p>
    </div>
  );
};

const Row = ({ name, score }) => (
  <div className="flex justify-between font-semibold text-sm dark:text-white">
    <span>{name}</span>
    <span className="font-mono">
      {score ? `${score.runs}/${score.wickets}` : "-"}
    </span>
  </div>
);

/* =========================
   States
========================= */
const Loading = () => (
  <div className="h-screen flex items-center justify-center">
    <Radio className="animate-pulse text-red-500" size={40} />
  </div>
);

const Error = ({ retry }) => (
  <div className="h-screen flex flex-col items-center justify-center">
    <AlertCircle className="text-red-500 mb-4" size={40} />
    <button
      onClick={retry}
      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
    >
      <RefreshCcw size={16} /> Retry
    </button>
  </div>
);
