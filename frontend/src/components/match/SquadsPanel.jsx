import React, { useMemo, useState } from "react";
import { Users2, Shield, Swords, Star, Hand, Info } from "lucide-react";

/* ---------------- Helpers ---------------- */

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function safeText(v, fallback = "") {
  return typeof v === "string" && v.trim() ? v : fallback;
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

  if (player?.keeper === true) return "WK";

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

function normalizeSquadsResponse(raw) {
  if (!raw) return null;

  // The response is already: { team1: {team, players}, team2: {team, players} }
  const t1 = raw?.team1 || {};
  const t2 = raw?.team2 || {};

  const team1Name =
    safeText(t1?.team?.teamname) ||
    safeText(raw?.matchInfo?.team1?.teamName) ||
    "Team 1";

  const team2Name =
    safeText(t2?.team?.teamname) ||
    safeText(raw?.matchInfo?.team2?.teamName) ||
    "Team 2";

  const team1Groups = safeArr(t1?.players);
  const team2Groups = safeArr(t2?.players);

  return {
    team1: { name: team1Name, groups: team1Groups },
    team2: { name: team2Name, groups: team2Groups },
  };
}

function categoryTitle(category = "") {
  const c = String(category).toLowerCase();
  if (c.includes("playing")) return "Playing XI";
  if (c.includes("bench")) return "Bench";
  if (c.includes("support")) return "Support Staff";
  return category || "Squad";
}

/* ---------------- UI ---------------- */

const Card = ({ children }) => (
  <div className="bg-white dark:bg-[#0b0f16] border border-black/10 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden">
    {children}
  </div>
);

const Header = () => (
  <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
    <div className="p-2 rounded-xl bg-blue-500/10">
      <Users2 className="text-blue-500" size={18} />
    </div>
    <div>
      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
        Squads
      </h3>
      <p className="text-[11px] font-semibold text-slate-500">
        Playing XI • Bench • Support staff
      </p>
    </div>
  </div>
);

const TeamTabs = ({ team1, team2, active, setActive }) => (
  <div className="px-6 pt-5">
    <div className="flex bg-slate-100 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-1">
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
  const name = safeText(p?.name) || safeText(p?.fullName) || "Unknown Player";
  const role = getRole(p);

  const isCaptain = p?.captain === true;
  const isKeeper = p?.keeper === true || role === "WK";

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] p-4 hover:border-blue-500/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center border border-black/10 dark:border-white/10">
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
      This match may not have squads published yet.
    </p>
  </div>
);

export default function SquadsPanel({ match }) {
  const [activeTeam, setActiveTeam] = useState("team1");

  // IMPORTANT: squads is not inside match object,
  // so we expect you will pass squads response to this component.
  // But still support both.
  const normalized = useMemo(() => {
    const raw =
      match?.team1?.players && match?.team2?.players
        ? match
        : match?.squads || match?.teams || match;

    return normalizeSquadsResponse(raw);
  }, [match]);

  if (!normalized) {
    return (
      <Card>
        <Header />
        <EmptySquads />
      </Card>
    );
  }

  const team1 = {
    key: "team1",
    label: normalized.team1.name,
    groups: safeArr(normalized.team1.groups),
  };

  const team2 = {
    key: "team2",
    label: normalized.team2.name,
    groups: safeArr(normalized.team2.groups),
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

      <div className="p-6 space-y-6">
        {active.groups.length === 0 ? (
          <EmptySquads />
        ) : (
          active.groups.map((group, gi) => {
            const title = categoryTitle(group?.category);
            const players = safeArr(group?.player);

            return (
              <div key={`${title}-${gi}`}>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    {title}
                  </p>
                  <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-tighter border border-blue-500/20">
                    {players.length} Members
                  </span>
                </div>

                {players.length === 0 ? (
                  <div className="text-[12px] text-slate-500 mb-6">
                    No players found for {title}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.map((p, idx) => (
                      <PlayerCard key={p?.id || `${title}-${idx}`} p={p} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
