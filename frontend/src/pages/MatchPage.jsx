import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import MatchHeader from "../components/match/MatchHeader";
import LiveScore from "../components/match/LiveScore";
import { Loader2 } from "lucide-react";

export default function MatchPage() {
  const { matchId } = useParams();

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/api/v1/cricket/match/${matchId}`
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080a0f]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Failed to load match data
      </div>
    );
  }

  const match = data.data;

  return (
    <div className="bg-slate-50 dark:bg-[#080a0f] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* MATCH HEADER */}
        <MatchHeader match={match} />

        {/* LIVE SCORE + CRR + RRR */}
        <LiveScore match={match} />

        {/* STATUS BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm mb-8">
          <p className="text-sm font-bold text-blue-600">
            {match.status}
          </p>
        </div>

        {/* Placeholder for future sections */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-slate-400 text-sm">
          Ball-by-ball, scorecard, commentary, wagon wheel and partnerships will appear here.
        </div>

      </div>
    </div>
  );
}
