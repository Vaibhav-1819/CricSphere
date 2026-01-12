import { Trophy, Radio, MapPin } from "lucide-react";

export default function MatchHeader({ match }) {
  if (!match) return null;

  const t1 = match.team1?.teamName;
  const t2 = match.team2?.teamName;
  const status = match.status || "Match in progress";
  const venue = match.venue?.ground || match.venue || "Stadium";

  const isLive =
    status.toLowerCase().includes("need") ||
    status.toLowerCase().includes("trail") ||
    status.toLowerCase().includes("lead") ||
    status.toLowerCase().includes("opt") ||
    status.toLowerCase().includes("chose");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Teams */}
        <div>
          <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {t1} <span className="text-slate-400 mx-2">vs</span> {t2}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin size={14} /> {venue}
            </div>

            {isLive && (
              <div className="flex items-center gap-1 text-red-500 font-bold">
                <Radio size={14} className="animate-pulse" /> LIVE
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
            Match Status
          </div>
          <div className="text-sm font-bold text-blue-600">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
