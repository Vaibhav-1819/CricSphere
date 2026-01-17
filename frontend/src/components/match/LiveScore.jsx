import React, { useMemo } from "react";
import { Activity, TrendingUp } from "lucide-react";

/* =========================
   Helpers
========================= */
const safeArr = (v) => (Array.isArray(v) ? v : []);

const toDecimalOvers = (oversVal) => {
  if (oversVal === undefined || oversVal === null) return 0;

  const val = parseFloat(String(oversVal));
  if (Number.isNaN(val)) return 0;

  const wholeOvers = Math.floor(val);
  const balls = Math.round((val % 1) * 10); // 19.6 => 6 balls
  return wholeOvers + balls / 6;
};

const formatScore = (runs, wkts) => {
  if (runs === undefined || runs === null) return "—";
  return `${runs}/${wkts ?? 0}`;
};

const formatOvers = (overs) => {
  if (overs === undefined || overs === null) return "";
  return `${overs} ov`;
};

const getTeamName = (teamObj, fallback) => {
  return (
    teamObj?.teamName ||
    teamObj?.teamname ||
    teamObj?.shortName ||
    teamObj?.teamsname ||
    teamObj?.name ||
    fallback
  );
};

/* =========================
   Live Score Component
========================= */
export default function LiveScore({ match, overs }) {
  const data = useMemo(() => {
    if (!match && !overs) return null;

    // match info can be either match.matchInfo or match itself (your API)
    const info = match?.matchInfo || match || {};

    const team1Name = getTeamName(info?.team1, "Team 1");
    const team2Name = getTeamName(info?.team2, "Team 2");

    const statusText =
      overs?.miniscore?.custstatus ||
      overs?.matchheaders?.status ||
      info?.status ||
      info?.tossstatus ||
      info?.shortstatus ||
      "Live score";

    const matchFormat =
      overs?.matchheaders?.matchformat ||
      info?.matchFormat ||
      info?.matchformat ||
      "T20";

    const inningsList = safeArr(
      overs?.miniscore?.inningsscores?.inningsscore
    );

    // We identify innings by batteamshortname ("DSG", "PR") if possible
    const team1Short =
      info?.team1?.shortName || info?.team1?.teamsname || null;
    const team2Short =
      info?.team2?.shortName || info?.team2?.teamsname || null;

    const team1Innings =
      inningsList.find((x) => x?.batteamshortname === team1Short) || null;

    const team2Innings =
      inningsList.find((x) => x?.batteamshortname === team2Short) || null;

    // If shortnames don't match, fallback by innings order
    const fallbackTeam1 = team1Innings || inningsList[0] || null;
    const fallbackTeam2 = team2Innings || inningsList[1] || null;

    // Rates + target
    const crr = overs?.miniscore?.crr ?? null;
    const rrr = overs?.miniscore?.rrr ?? null;
    const target = overs?.miniscore?.target ?? null;

    return {
      team1Name,
      team2Name,
      team1Score: fallbackTeam1
        ? {
            runs: fallbackTeam1?.runs,
            wkts: fallbackTeam1?.wickets,
            overs: fallbackTeam1?.overs,
          }
        : null,
      team2Score: fallbackTeam2
        ? {
            runs: fallbackTeam2?.runs,
            wkts: fallbackTeam2?.wickets,
            overs: fallbackTeam2?.overs,
          }
        : null,
      statusText,
      matchFormat: String(matchFormat).toUpperCase(),
      crr,
      rrr,
      target,
    };
  }, [match, overs]);

  if (!data) return null;

  const {
    team1Name,
    team2Name,
    team1Score,
    team2Score,
    statusText,
    matchFormat,
    crr,
    rrr,
    target,
  } = data;

  // If overs not available, show a minimal clean fallback
  const hasScores = !!team1Score || !!team2Score;

  const team2IsBatting = !!team2Score?.runs;

  // If match is limited overs and second innings exists, show target
  const targetText =
    target && matchFormat !== "TEST" ? `Target: ${target}` : null;

  // If CRR not provided, compute from innings if possible
  const computedCrr = useMemo(() => {
    const inningsForRate = team2Score?.runs != null ? team2Score : team1Score;
    if (!inningsForRate) return null;

    const decOvers = toDecimalOvers(inningsForRate?.overs);
    if (decOvers <= 0 || inningsForRate?.runs == null) return null;

    return (Number(inningsForRate.runs) / decOvers).toFixed(2);
  }, [team1Score, team2Score]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
            Live Score
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {statusText}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Format: <span className="font-semibold">{matchFormat}</span>
          </p>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
          {hasScores ? "Updated" : "Waiting"}
        </span>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team 1 */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5 p-5">
          <p className="text-[10px] uppercase font-bold text-slate-400">
            {team1Name}
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {formatScore(team1Score?.runs, team1Score?.wkts)}
            </p>

            <p className="text-xs text-slate-400">
              {formatOvers(team1Score?.overs)}
            </p>
          </div>
        </div>

        {/* Team 2 */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5 p-5">
          <p className="text-[10px] uppercase font-bold text-slate-400">
            {team2Name}
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p
              className={`text-3xl font-black ${
                team2IsBatting ? "text-emerald-500" : "text-slate-900 dark:text-white"
              }`}
            >
              {team2Score?.runs != null
                ? formatScore(team2Score?.runs, team2Score?.wkts)
                : "Yet to Bat"}
            </p>

            <p className="text-xs text-slate-400">
              {team2Score?.runs != null ? formatOvers(team2Score?.overs) : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {(crr || rrr || targetText || computedCrr) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {/* CRR */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Activity className="text-blue-500" size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                CRR
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {crr ?? computedCrr ?? "—"}
              </p>
              {targetText && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {targetText}
                </p>
              )}
            </div>
          </div>

          {/* RRR */}
          <div className="flex items-center gap-3 justify-start sm:justify-end">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="text-emerald-500" size={18} />
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                RRR
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {rrr ?? "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No score fallback */}
      {!hasScores && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Score not available yet. Once overs API returns inningsscores, it will
            display automatically.
          </p>
        </div>
      )}
    </div>
  );
}
