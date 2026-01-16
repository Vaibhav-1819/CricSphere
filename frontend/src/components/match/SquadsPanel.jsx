import React, { useMemo, useState } from "react";
import { Users2, Shield, Swords, Star, Hand, Info } from "lucide-react";

/* ---------------- Helpers ---------------- */

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function getRole(player = {}) {
  const role =
    player?.role ||
    player?.playingRole ||
    player?.speciality ||
    player?.specialty ||
    "";

  const r = String(role).toLowerCase();

  if (r.includes("wk") || r.includes("keeper")) return "WK";
  if (r.includes("all") || r.includes("allround")) return "AR";
  if (r.includes("bowl")) return "BOWL";
  if (r.includes("bat")) return "BAT";

  // if unknown but player has isKeeper
  if (player?.isKeeper) return "WK";

  return "PLAYER";
}

function roleIcon(role) {
  if (role === "WK") return <Hand size={14} className="text-emerald-400" />;
  if (role === "AR") return <Star size={14} className="text-amber-400" />;
  if (role === "BOWL") return <Shield size={14} className="text-blue-400" />;
  if (role === "BAT") return <Swords size={14} className="text-purple-400" />;
  return <Users2 size={14} className="text-slate-400" />;
}

function roleBadge(role) {
  switch (role) {
    case "WK":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "AR":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "BOWL":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "BAT":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-white/10";
  }
}

/**
 * This supports multiple possible API structures.
 * We'll normalize to:
 * {
 *  team1: { name, players: [] },
 *  team2: { name, players: [] }
 * }
 */
function extractSquads(match) {
  const team1Name =
    match?.matchInfo?.team1?.teamName ||
    match?.team1?.teamName ||
    match?.team1 ||
    "Team 1";

  const team2Name =
    match?.matchInfo?.team2?.teamName ||
    match?.team2?.teamName ||
    match?.team2 ||
    "Team 2";

  // Cricbuzz sometimes gives squads under:
  // match.squad / match.squads / match.team1Players / match.team2Players
  const team1Players =
    match?.squad?.team1Players ||
    match?.squads?.team1Players ||
    match?.team1Players ||
    match?.team1Squad ||
    match?.team1?.players ||
    [];

  const team2Players =
    match?.squad?.team2Players ||
    match?.squads?.team2Players ||
    match?.team2Players ||
    match?.team2Squad ||
    match?.team2?.players ||
    [];

  // Also some APIs give "players" as map
  const normalizePlayers = (list) => {
    if (Array.isArray(list)) return list;

    // if object map: {id: playerObj}
    if (list && typeof list === "object") return Object.values(list);

    return [];
  };

  return {
    team1: { name: team1Name, players: normalizePlayers(team1Players) },
    team2: { name: team2Name, players: normalizePlayers(team2Players) },
  };
}

/* ---------------- UI ---------------- */

const Card = ({ children }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
    {children}
  </div>
);

const Header = () => (
  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
    <div className="p-2 rounded-xl bg-blue-500/10">
      <Users2 className="text-blue-500" size={18} />
    </div>
    <div>
      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
        Squads
      </h3>
      <p className="text-[11px] font-semibold text-slate-500">
        Playing XI • Roles • Team sheet
      </p>
    </div>
  </div>
);

const TeamTabs = ({ team1, team2, active, setActive }) => (
  <div className="px-6 pt-5">
    <div className="flex bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-1">
      {[team1, team2].map((t) => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            active === t.key
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
);

const PlayerCard = ({ p }) => {
  const name = p?.name || p?.fullName || p?.playerName || "Unknown Player";
  const role = getRole(p);

  const isCaptain =
    p?.isCaptain ||
    String(p?.captain || "").toLowerCase() === "true" ||
    String(p?.role || "").toLowerCase().includes("captain");

  const isKeeper =
    role === "WK" ||
    p?.isKeeper ||
    String(p?.role || "").toLowerCase().includes("wk");

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5 p-4 hover:border-blue-500/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            {roleIcon(role)}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">
              {name}
              {isCaptain ? (
                <span className="ml-2 text-[10px] font-black text-amber-500">
                  (C)
                </span>
              ) : null}
              {isKeeper ? (
                <span className="ml-2 text-[10px] font-black text-emerald-400">
                  (WK)
                </span>
              ) : null}
            </p>

            <div className="mt-2">
              <span
                className={`inline-flex px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${roleBadge(
                  role
                )}`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptySquads = () => (
  <div className="p-10 text-center">
    <Info className="mx-auto text-slate-300 mb-3" size={34} />
    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
      Squad data not available
    </p>
    <p className="text-[11px] text-slate-500 mt-2 max-w-md mx-auto">
      Your backend match endpoint is currently returning matchInfo + matchScore.
      Next we’ll add squad endpoint integration to show Playing XI properly.
    </p>
  </div>
);

export default function SquadsPanel({ match }) {
  const [activeTeam, setActiveTeam] = useState("team1");

  const squads = useMemo(() => extractSquads(match), [match]);

  const team1 = {
    key: "team1",
    label: squads.team1.name,
    players: safeArr(squads.team1.players),
  };

  const team2 = {
    key: "team2",
    label: squads.team2.name,
    players: safeArr(squads.team2.players),
  };

  const active = activeTeam === "team1" ? team1 : team2;

  return (
    <Card>
      <Header />

      <TeamTabs
        team1={{ key: "team1", label: team1.label }}
        team2={{ key: "team2", label: team2.label }}
        active={activeTeam}
        setActive={setActiveTeam}
      />

      <div className="p-6">
        {active.players.length === 0 ? (
          <EmptySquads />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Playing XI
              </p>
              <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                {active.players.length} Players
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {active.players.slice(0, 11).map((p, idx) => (
                <PlayerCard key={p?.id || p?.playerId || idx} p={p} />
              ))}
            </div>

            {active.players.length > 11 && (
              <div className="mt-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
                  Bench / Others
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-90">
                  {active.players.slice(11).map((p, idx) => (
                    <PlayerCard key={p?.id || p?.playerId || `b-${idx}`} p={p} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
