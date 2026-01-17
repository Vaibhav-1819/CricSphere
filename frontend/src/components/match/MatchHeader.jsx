import { Trophy, Radio, MapPin, Clock } from "lucide-react";

export default function MatchHeader({ match }) {
  if (!match) return null;

  const info = match?.matchInfo || match;

  const t1 =
  info?.team1?.teamName ||
  info?.team1?.teamname ||
  info?.team1?.teamsname ||
  info?.team1?.shortName ||
  "Team 1";

const t2 =
  info?.team2?.teamName ||
  info?.team2?.teamname ||
  info?.team2?.teamsname ||
  info?.team2?.shortName ||
  "Team 2";


  const status = info?.status || match?.status || "Match in progress";

  const venue =
    info?.venueInfo?.ground ||
    info?.venueInfo?.city ||
    info?.venue ||
    "Venue N/A";

  const format = info?.matchFormat || info?.matchType || "INTL";

  const isLive =
    status.toLowerCase().includes("live") ||
    status.toLowerCase().includes("opt") ||
    status.toLowerCase().includes("trail") ||
    status.toLowerCase().includes("need") ||
    status.toLowerCase().includes("lead");

  return (
    <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* LEFT */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider border border-white/10">
              {format}
            </span>

            {isLive && (
              <span className="flex items-center gap-1 text-[10px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                <Radio size={10} /> Live
              </span>
            )}
          </div>

          <div className="text-3xl font-black text-white flex items-center flex-wrap">
            {t1}
            <span className="text-slate-500 mx-3 font-light text-xl">vs</span>
            {t2}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-500" />
              {venue}
            </div>

            {info?.matchDesc && (
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-slate-500" />
                {info.matchDesc}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:w-72 bg-white/5 px-5 py-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
              Match Status
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
