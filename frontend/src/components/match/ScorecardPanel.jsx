import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
    {children}
  </span>
);

const SectionCard = ({ title, subtitle, children }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
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

const TableHeader = () => (
  <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
    <div className="col-span-6">Batter</div>
    <div className="col-span-1 text-right">R</div>
    <div className="col-span-1 text-right">B</div>
    <div className="col-span-1 text-right">4s</div>
    <div className="col-span-1 text-right">6s</div>
    <div className="col-span-2 text-right">SR</div>
  </div>
);

const BatterRow = ({ p }) => {
  const name = p?.name || p?.batName || "Player";
  const out = p?.outDesc || p?.out || p?.howOut || "—";

  return (
    <div className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-slate-100 dark:border-slate-800/60">
      <div className="col-span-6">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {name}
        </p>
        <p className="text-[11px] text-slate-500 italic mt-0.5">{out}</p>
      </div>
      <div className="col-span-1 text-right font-black text-slate-900 dark:text-white">
        {p?.runs ?? p?.r ?? 0}
      </div>
      <div className="col-span-1 text-right text-slate-600 dark:text-slate-300 font-semibold">
        {p?.balls ?? p?.b ?? 0}
      </div>
      <div className="col-span-1 text-right text-slate-600 dark:text-slate-300 font-semibold">
        {p?.fours ?? p?.["4s"] ?? 0}
      </div>
      <div className="col-span-1 text-right text-slate-600 dark:text-slate-300 font-semibold">
        {p?.sixes ?? p?.["6s"] ?? 0}
      </div>
      <div className="col-span-2 text-right font-black text-emerald-600 dark:text-emerald-400">
        {p?.sr ?? p?.strikeRate ?? "0.0"}
      </div>
    </div>
  );
};

const BowlHeader = () => (
  <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
    <div className="col-span-5">Bowler</div>
    <div className="col-span-2 text-right">O</div>
    <div className="col-span-1 text-right">M</div>
    <div className="col-span-1 text-right">R</div>
    <div className="col-span-1 text-right">W</div>
    <div className="col-span-2 text-right">Econ</div>
  </div>
);

const BowlerRow = ({ b }) => {
  const name = b?.name || b?.bowlName || "Bowler";
  return (
    <div className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-slate-100 dark:border-slate-800/60">
      <div className="col-span-5">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {name}
        </p>
      </div>
      <div className="col-span-2 text-right font-semibold text-slate-700 dark:text-slate-300">
        {b?.overs ?? b?.o ?? "0.0"}
      </div>
      <div className="col-span-1 text-right font-semibold text-slate-700 dark:text-slate-300">
        {b?.maidens ?? b?.m ?? 0}
      </div>
      <div className="col-span-1 text-right font-semibold text-slate-700 dark:text-slate-300">
        {b?.runs ?? b?.r ?? 0}
      </div>
      <div className="col-span-1 text-right font-black text-slate-900 dark:text-white">
        {b?.wickets ?? b?.w ?? 0}
      </div>
      <div className="col-span-2 text-right font-black text-blue-600 dark:text-blue-400">
        {b?.econ ?? b?.economy ?? "0.0"}
      </div>
    </div>
  );
};

const Expandable = ({ title, right, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <div className="text-left">
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {title}
          </p>
          {right ? (
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
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

export default function ScorecardPanel({ match }) {
  /**
   * Your backend response may differ depending on provider.
   * We'll support multiple shapes safely.
   */
  const scorecard = useMemo(() => {
    // Try common possible paths:
    // match.scorecard, match.matchScorecard, match?.data?.scorecard etc.
    return (
      match?.scorecard ||
      match?.matchScorecard ||
      match?.scoreCard ||
      match?.matchScorecardData ||
      null
    );
  }, [match]);

  const info = match?.matchInfo || {};

  // If scorecard is missing, show fallback
  if (!scorecard) {
    return (
      <SectionCard
        title="Scorecard not available"
        subtitle="Backend is not returning detailed innings yet"
      >
        <div className="text-sm text-slate-500">
          This match endpoint currently gives live score summary, but not full
          innings scorecard.  
          <br />
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Next step:
          </span>{" "}
          we will add backend route to fetch scorecard details from API.
        </div>
      </SectionCard>
    );
  }

  // Try extract innings array
  const innings =
    safeArr(scorecard?.innings) ||
    safeArr(scorecard?.scoreCard) ||
    safeArr(scorecard?.inngs) ||
    [];

  return (
    <div className="space-y-6">
      <SectionCard
        title={`${info?.team1?.teamName || "Team 1"} vs ${
          info?.team2?.teamName || "Team 2"
        }`}
        subtitle={info?.status || "Scorecard"}
      >
        <div className="space-y-5">
          {innings.length === 0 ? (
            <p className="text-sm text-slate-500">
              Scorecard innings data is empty.
            </p>
          ) : (
            innings.map((inn, idx) => {
              const teamName = inn?.batTeamName || inn?.teamName || `Innings ${idx + 1}`;
              const runs = inn?.runs ?? inn?.r ?? 0;
              const wkts = inn?.wickets ?? inn?.w ?? 0;
              const overs = inn?.overs ?? inn?.o ?? "0.0";

              const batters = safeArr(inn?.batters || inn?.batsmen || inn?.batting);
              const bowlers = safeArr(inn?.bowlers || inn?.bowling);

              return (
                <Expandable
                  key={idx}
                  title={`${teamName}`}
                  right={`${runs}/${wkts} (${overs} ov)`}
                >
                  {/* Batting */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-5">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Batting
                      </p>
                    </div>

                    <TableHeader />
                    {batters.length > 0 ? (
                      batters.map((p, i) => <BatterRow key={p?.id || p?.name || i} p={p} />)
                    ) : (
                      <div className="p-4 text-sm text-slate-500">
                        Batting details not available.
                      </div>
                    )}
                  </div>

                  {/* Bowling */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Bowling
                      </p>
                    </div>

                    <BowlHeader />
                    {bowlers.length > 0 ? (
                      bowlers.map((b, i) => <BowlerRow key={b?.id || b?.name || i} b={b} />)
                    ) : (
                      <div className="p-4 text-sm text-slate-500">
                        Bowling details not available.
                      </div>
                    )}
                  </div>
                </Expandable>
              );
            })
          )}
        </div>
      </SectionCard>
    </div>
  );
}
