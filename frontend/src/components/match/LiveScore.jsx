import { Activity, TrendingUp } from "lucide-react";

/* =========================
   Helpers
========================= */
const toDecimalOvers = (oversStr) => {
  if (!oversStr) return 0;
  const val = parseFloat(oversStr);
  const wholeOvers = Math.floor(val);
  const balls = (val % 1) * 10; // .1 becomes 1, .3 becomes 3
  return wholeOvers + balls / 6;
};

const getScore = (teamScore) => {
  if (!teamScore || !teamScore.runs) return null;
  return `${teamScore.runs}/${teamScore.wickets || 0}`;
};

const getOvers = (teamScore) => {
  if (!teamScore || !teamScore.overs) return null;
  return `${teamScore.overs} ov`;
};

/* =========================
   Live Score Component
========================= */
export default function LiveScore({ match }) {
  if (!match?.matchScore) return null;

  const t1 = match.team1?.teamName;
  const t2 = match.team2?.teamName;

  // Determining which team is batting (usually team2 in second innings)
  const s1 = match.matchScore?.team1Score?.inngs1;
  const s2 = match.matchScore?.team2Score?.inngs1;

  /* --- Math Logic --- */
  const decimalOversS2 = toDecimalOvers(s2?.overs);
  
  // CRR
  let crr = null;
  if (decimalOversS2 > 0) {
    crr = (s2.runs / decimalOversS2).toFixed(2);
  }

  // RRR
  let rrr = null;
  if (s1 && s2 && match.matchFormat !== "TEST") {
    const maxOvers = 
      match.matchFormat === "T20" ? 20 : 
      match.matchFormat === "ODI" ? 50 : null;

    if (maxOvers) {
      const target = parseInt(s1.runs) + 1;
      const runsLeft = target - parseInt(s2.runs);
      const oversLeft = maxOvers - decimalOversS2;

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
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t1}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {getScore(s1) || "—"}
          </p>
          <p className="text-xs text-slate-400 mt-1">{getOvers(s1)}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t2}</p>
          <p className="text-3xl font-black text-emerald-500">
            {getScore(s2) || "Batting"}
          </p>
          <p className="text-xs text-slate-400 mt-1">{getOvers(s2)}</p>
        </div>
      </div>

      {/* Analytics Footer */}
      {(crr || rrr) && (
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="text-blue-500" size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">CRR</p>
              <p className="font-bold text-slate-900 dark:text-white">{crr || "0.00"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="text-emerald-500" size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">RRR</p>
              <p className="font-bold text-slate-900 dark:text-white">{rrr || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}