import { Activity, TrendingUp } from "lucide-react";

/* =========================
   Helpers
========================= */

const getScore = (teamScore) => {
  if (!teamScore) return null;
  return `${teamScore.runs}/${teamScore.wickets}`;
};

const getOvers = (teamScore) => {
  if (!teamScore) return null;
  return `${teamScore.overs} ov`;
};

/* =========================
   Live Score Component
========================= */

export default function LiveScore({ match }) {
  if (!match?.matchScore) return null;

  const t1 = match.team1?.teamName;
  const t2 = match.team2?.teamName;

  const s1 = match.matchScore?.team1Score?.inngs1;
  const s2 = match.matchScore?.team2Score?.inngs1;

  /* --- CRR --- */
  let crr = null;
  if (s2?.overs > 0) {
    crr = (s2.runs / s2.overs).toFixed(2);
  }

  /* --- RRR (if target exists) --- */
  let rrr = null;
  if (s1 && s2 && match.matchFormat !== "TEST") {
    const maxOvers =
      match.matchFormat === "T20" ? 20 :
      match.matchFormat === "ODI" ? 50 : null;

    if (maxOvers) {
      const target = s1.runs + 1;
      const runsLeft = target - s2.runs;
      const oversLeft = maxOvers - s2.overs;

      if (oversLeft > 0) {
        rrr = (runsLeft / oversLeft).toFixed(2);
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
      
      {/* Scores */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase font-bold text-slate-400">{t1}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {getScore(s1) || "—"}
          </p>
          <p className="text-xs text-slate-400">{getOvers(s1)}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase font-bold text-slate-400">{t2}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {getScore(s2) || "—"}
          </p>
          <p className="text-xs text-slate-400">{getOvers(s2)}</p>
        </div>
      </div>

      {/* CRR + RRR */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <Activity className="text-blue-500" />
          <div>
            <p className="text-[11px] uppercase font-black text-slate-400">CRR</p>
            <p className="font-bold text-blue-600 text-lg">
              {crr || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <TrendingUp className="text-emerald-500" />
          <div>
            <p className="text-[11px] uppercase font-black text-slate-400">RRR</p>
            <p className="font-bold text-emerald-600 text-lg">
              {rrr || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
