import { Trophy, Radio, MapPin, Clock } from "lucide-react";

export default function MatchHeader({ match }) {
  if (!match) return null;

  const t1 = match.team1?.teamName;
  const t2 = match.team2?.teamName;
  const status = match.status || "Match in progress";
  const venue = match.venue?.ground || match.venue || "Stadium";
  const format = match.matchFormat || match.matchType || "Intl";

  const isLive =
    status.toLowerCase().includes("need") ||
    status.toLowerCase().includes("trail") ||
    status.toLowerCase().includes("lead") ||
    status.toLowerCase().includes("opt") ||
    status.toLowerCase().includes("chose");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Teams & Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
             <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200 dark:border-slate-700">
               {format}
             </span>
             {isLive && (
              <span className="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded animate-pulse uppercase tracking-wider">
                <Radio size={10} /> Live
              </span>
            )}
          </div>

          <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center flex-wrap">
            {t1} <span className="text-slate-300 dark:text-slate-700 mx-3 font-light text-xl">vs</span> {t2}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" /> {venue}
            </div>
            {match.matchDesc && (
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-slate-400" /> {match.matchDesc}
              </div>
            )}
          </div>
        </div>

        {/* Status Box */}
        <div className="lg:w-72 bg-blue-50/50 dark:bg-blue-500/5 px-5 py-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
              Match Status
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}