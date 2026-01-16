import React from "react";
import { Activity, TrendingUp } from "lucide-react";

/* =========================
   Helpers
========================= */
const toDecimalOvers = (oversStr) => {
  if (!oversStr) return 0;

  // Overs can come like "12.3" (12 overs + 3 balls)
  const val = parseFloat(oversStr);
  if (Number.isNaN(val)) return 0;

  const wholeOvers = Math.floor(val);
  const balls = Math.round((val % 1) * 10); // .3 => 3 balls
  return wholeOvers + balls / 6;
};

const getScore = (teamScore) => {
  if (!teamScore) return null;

  const runs = teamScore?.runs ?? teamScore?.r;
  const wkts = teamScore?.wickets ?? teamScore?.w;

  if (runs === undefined || runs === null) return null;
  return `${runs}/${wkts ?? 0}`;
};

const getOvers = (teamScore) => {
  if (!teamScore) return null;

  const overs = teamScore?.overs ?? teamScore?.o;
  if (overs === undefined || overs === null) return null;

  return `${overs} ov`;
};

/* =========================
   Live Score Component
========================= */
export default function LiveScore({ match }) {
  const info = match?.matchInfo;
  const score = match?.matchScore;

  if (!info || !score) return null;

  const t1 = info?.team1?.teamName || info?.team1?.name || "Team 1";
  const t2 = info?.team2?.teamName || info?.team2?.name || "Team 2";

  // Most of the time Cricbuzz gives innings like this
  const s1 = score?.team1Score?.inngs1 || null;
  const s2 = score?.team2Score?.inngs1 || null;

  const matchFormat = info?.matchFormat?.toUpperCase?.() || "T20";

  /* --- Math Logic --- */
  // If team2 innings exists, use that for CRR (usually chasing / second innings)
  const inningsForRate = s2 || s1;
  const decimalOvers = toDecimalOvers(inningsForRate?.overs);

  // CRR
  let crr = null;
  if (decimalOvers > 0 && inningsForRate?.runs != null) {
    crr = (Number(inningsForRate.runs) / decimalOvers).toFixed(2);
  }

  // RRR (only if second innings + limited overs)
  let rrr = null;
  let targetText = null;

  if (s1 && s2 && matchFormat !== "TEST") {
    const maxOvers = matchFormat === "T20" ? 20 : matchFormat === "ODI" ? 50 : null;

    if (maxOvers) {
      const target = Number(s1.runs) + 1;
      const runsLeft = target - Number(s2.runs);
      const oversLeft = maxOvers - decimalOvers;

      targetText = `Target: ${target}`;

      if (oversLeft > 0 && runsLeft > 0) {
        rrr = (runsLeft / oversLeft).toFixed(2);
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="border-r border-slate-100 dark:border-slate-800 pr-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            {t1}
          </p>

          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {getScore(s1) || "—"}
          </p>

          <p className="text-xs text-slate-400 mt-1">{getOvers(s1) || ""}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            {t2}
          </p>

          <p className="text-3xl font-black text-emerald-500">
            {getScore(s2) || "Yet to Bat"}
          </p>

          <p className="text-xs text-slate-400 mt-1">{getOvers(s2) || ""}</p>
        </div>
      </div>

      {/* Analytics Footer */}
      {(crr || rrr || targetText) && (
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="text-blue-500" size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                CRR
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {crr || "—"}
              </p>
              {targetText && (
                <p className="text-[10px] text-slate-400 mt-0.5">{targetText}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="text-emerald-500" size={18} />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                RRR
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {rrr || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
