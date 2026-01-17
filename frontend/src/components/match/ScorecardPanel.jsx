import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

/* ---------------- Helpers ---------------- */

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function safeText(v, fallback = "") {
  return typeof v === "string" && v.trim() ? v : fallback;
}

function toNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toStr(v, fallback = "0.0") {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

/* ---------------- UI Atoms ---------------- */

const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10">
    {children}
  </span>
);

const SectionCard = ({ title, subtitle, children }) => (
  <div className="bg-white dark:bg-[#0b0f16] border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            {subtitle}
          </p>
        ) : null}
      </div>
      <Pill>Scorecard</Pill>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Expandable = ({ title, right, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
      >
        <div className="text-left min-w-0">
          <p className="text-sm font-black text-slate-900 dark:text-white truncate">
            {title}
          </p>
          {right ? (
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 truncate">
              {right}
            </p>
          ) : null}
        </div>

        {open ? (
          <ChevronUp className="text-slate-500" size={18} />
        ) : (
          <ChevronDown className="text-slate-500" size={18} />
        )}
      </button>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

/* ---------------- Tables ---------------- */

const BatHeader = () => (
  <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-black/10 dark:border-white/10">
    <div className="col-span-6">Batter</div>
    <div className="col-span-1 text-right">R</div>
    <div className="col-span-1 text-right">B</div>
    <div className="col-span-1 text-right">4s</div>
    <div className="col-span-1 text-right">6s</div>
    <div className="col-span-2 text-right">SR</div>
  </div>
);

const BatterRow = ({ p }) => {
  const name = safeText(p?.name) || safeText(p?.nickname) || "Player";
  const out = safeText(p?.outdec) || safeText(p?.outDesc) || "—";

  return (
    <div className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-black/5 dark:border-white/10">
      <div className="col-span-6 min-w-0">
        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
          {name}
          {p?.iscaptain ? (
            <span className="ml-2 text-[10px] font-black text-amber-500">(C)</span>
          ) : null}
          {p?.iskeeper ? (
            <span className="ml-2 text-[10px] font-black text-emerald-400">(WK)</span>
          ) : null}
        </p>
        <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-2">
          {out}
        </p>
      </div>

      <div className="col-span-1 text-right font-black text-slate-900 dark:text-white">
        {toNum(p?.runs)}
      </div>
      <div className="col-span-1 text-right text-slate-600 dark:text-slate-300 font-semibold">
        {toNum(p?.balls)}
      </div>
      <div className="col-span-1 text-right text-slate-600 dark:text-slate-300 font-semibold">
        {toNum(p?.fours)}
      </div>
      <div className="col-span-1 text-right text-slate-600 dark:text-slate-300 font-semibold">
        {toNum(p?.sixes)}
      </div>
      <div className="col-span-2 text-right font-black text-emerald-600 dark:text-emerald-400">
        {toStr(p?.strkrate, "0.0")}
      </div>
    </div>
  );
};

const BowlHeader = () => (
  <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-black/10 dark:border-white/10">
    <div className="col-span-5">Bowler</div>
    <div className="col-span-2 text-right">O</div>
    <div className="col-span-1 text-right">M</div>
    <div className="col-span-1 text-right">R</div>
    <div className="col-span-1 text-right">W</div>
    <div className="col-span-2 text-right">Econ</div>
  </div>
);

const BowlerRow = ({ b }) => {
  const name = safeText(b?.name) || safeText(b?.nickname) || "Bowler";

  return (
    <div className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-black/5 dark:border-white/10">
      <div className="col-span-5 min-w-0">
        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
          {name}
        </p>
      </div>

      <div className="col-span-2 text-right font-semibold text-slate-700 dark:text-slate-300">
        {toStr(b?.overs, "0")}
      </div>
      <div className="col-span-1 text-right font-semibold text-slate-700 dark:text-slate-300">
        {toNum(b?.maidens)}
      </div>
      <div className="col-span-1 text-right font-semibold text-slate-700 dark:text-slate-300">
        {toNum(b?.runs)}
      </div>
      <div className="col-span-1 text-right font-black text-slate-900 dark:text-white">
        {toNum(b?.wickets)}
      </div>
      <div className="col-span-2 text-right font-black text-blue-600 dark:text-blue-400">
        {toStr(b?.economy, "0.0")}
      </div>
    </div>
  );
};

/* ---------------- Extras / FOW ---------------- */

const MiniStat = ({ label, value }) => (
  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-4 py-3">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
      {label}
    </p>
    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
      {value}
    </p>
  </div>
);

/* ---------------- Main ---------------- */

export default function ScorecardPanel({ scorecard, match }) {
  /**
   * scorecard can be:
   * - array (your response)
   * - object with innings inside
   */
  const innings = useMemo(() => {
    if (Array.isArray(scorecard)) return scorecard;

    const maybe =
      scorecard?.innings ||
      scorecard?.scoreCard ||
      scorecard?.inngs ||
      scorecard?.data ||
      null;

    if (Array.isArray(maybe)) return maybe;
    return [];
  }, [scorecard]);

  const info = match?.matchInfo || match || {};

  if (!innings || innings.length === 0) {
    return (
      <SectionCard
        title="Scorecard not available"
        subtitle="This match may not have full innings data yet"
      >
        <div className="py-10 text-center text-slate-500">
          <Info className="mx-auto mb-3 opacity-40" size={34} />
          <p className="text-sm font-semibold">No innings data found</p>
          <p className="text-[12px] mt-2">
            Try again after a few minutes.
          </p>
        </div>
      </SectionCard>
    );
  }

  const headerTitle =
    safeText(info?.team1?.teamName) && safeText(info?.team2?.teamName)
      ? `${info.team1.teamName} vs ${info.team2.teamName}`
      : "Match Scorecard";

  return (
    <div className="space-y-6">
      <SectionCard title={headerTitle} subtitle={safeText(info?.status, "Scorecard")}>
        <div className="space-y-5">
          {innings.map((inn, idx) => {
            const teamName =
              safeText(inn?.batteamname) ||
              safeText(inn?.batTeamName) ||
              `Innings ${idx + 1}`;

            const runs = toNum(inn?.score);
            const wkts = toNum(inn?.wickets);
            const overs = toStr(inn?.overs, "0");

            const batters = safeArr(inn?.batsman);
            const bowlers = safeArr(inn?.bowler);

            const extras = inn?.extras || {};
            const fow = safeArr(inn?.fow?.fow);

            return (
              <Expandable
                key={inn?.inningsid || idx}
                title={teamName}
                right={`${runs}/${wkts} (${overs} ov)`}
              >
                {/* Summary mini stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <MiniStat label="Run Rate" value={toStr(inn?.runrate, "0.00")} />
                  <MiniStat label="Extras" value={toNum(extras?.total)} />
                  <MiniStat label="Wides" value={toNum(extras?.wides)} />
                  <MiniStat label="Leg Byes" value={toNum(extras?.legbyes)} />
                </div>

                {/* Batting */}
                <div className="rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden mb-5">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-black/10 dark:border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Batting
                    </p>
                  </div>

                  <BatHeader />
                  {batters.length > 0 ? (
                    batters.map((p, i) => (
                      <BatterRow key={p?.id || `${idx}-bat-${i}`} p={p} />
                    ))
                  ) : (
                    <div className="p-4 text-sm text-slate-500">
                      Batting details not available.
                    </div>
                  )}
                </div>

                {/* Bowling */}
                <div className="rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden mb-5">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-black/10 dark:border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Bowling
                    </p>
                  </div>

                  <BowlHeader />
                  {bowlers.length > 0 ? (
                    bowlers.map((b, i) => (
                      <BowlerRow key={b?.id || `${idx}-bowl-${i}`} b={b} />
                    ))
                  ) : (
                    <div className="p-4 text-sm text-slate-500">
                      Bowling details not available.
                    </div>
                  )}
                </div>

                {/* Fall of Wickets */}
                {fow.length > 0 ? (
                  <div className="rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-b border-black/10 dark:border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Fall of Wickets
                      </p>
                    </div>

                    <div className="p-4 flex flex-wrap gap-2">
                      {fow.map((x, i) => (
                        <span
                          key={`${x?.batsmanid || i}`}
                          className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-200"
                        >
                          {safeText(x?.batsmanname, "Player")} • {toNum(x?.runs)}
                          {" / "}
                          {toStr(x?.overnbr, "0.0")} ov
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Expandable>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
