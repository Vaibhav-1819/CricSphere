import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Loader2,
  Trophy,
  Radio,
  Zap,
  Lightbulb,
  Crown,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { getCurrentMatches } from "../api/cricketApi";

/* --- 1. ACCURACY ENGINES --- */
const isMatchDone = (status = "") => {
  const s = status.toLowerCase();
  return ["won", "draw", "tie", "abandon", "no result", "result"].some((k) =>
    s.includes(k)
  );
};

const getTeamScore = (match, teamName) => {
  if (!match?.score || !Array.isArray(match.score)) return null;
  return match.score.find((s) =>
    s.inning?.toLowerCase().includes(teamName.toLowerCase())
  );
};

/* --- 2. LIVE HUB COMPONENT --- */
const LiveStrip = ({ rawMatches, loading }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const processedMatches = useMemo(() => {
    if (!rawMatches) return [];
    return [...rawMatches].sort((a, b) => {
      const aDone = isMatchDone(a.status);
      const bDone = isMatchDone(b.status);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return b.dateTimeGMT.localeCompare(a.dateTimeGMT);
    });
  }, [rawMatches]);

  const scroll = (dir) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({
        left: dir === "left" ? -350 : 350,
        behavior: "smooth",
      });
  };

  if (loading && !rawMatches)
    return (
      <div className="h-32 bg-slate-100 dark:bg-slate-900 animate-pulse m-4 rounded-2xl" />
    );

  return (
    <div className="w-full bg-white/80 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 pt-6 pb-6 sticky top-0 z-30 backdrop-blur-xl group/strip">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            Live Action Hub
          </h3>
          <Link
            to="/live-scores"
            className="group flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 hover:text-blue-600 transition-all"
          >
            Match Center{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 p-2 rounded-full shadow-xl opacity-0 group-hover/strip:opacity-100 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto no-scrollbar snap-x px-1"
          >
            {processedMatches.map((match) => {
              const [t1, t2] = match.teams;
              const s1 = getTeamScore(match, t1);
              const s2 = getTeamScore(match, t2);
              const done = isMatchDone(match.status);

              return (
                <div
                  key={match.id}
                  onClick={() =>
                    navigate(`/match/${match.id}`, {
                      state: { matchData: match },
                    })
                  }
                  className="snap-start min-w-[300px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {match.matchType}
                    </span>
                    {!done && (
                      <span className="text-[9px] font-black text-red-500 flex items-center gap-1 animate-pulse">
                        <Radio size={12} /> LIVE
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold truncate max-w-[140px]">
                        {t1}
                      </span>
                      <span className="font-mono font-black">
                        {s1 ? `${s1.r}/${s1.w}` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold truncate max-w-[140px]">
                        {t2}
                      </span>
                      <span className="font-mono font-black">
                        {s2 ? `${s2.r}/${s2.w}` : "-"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold truncate border-t pt-3">
                    {match.status}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 p-2 rounded-full shadow-xl opacity-0 group-hover/strip:opacity-100 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- 3. MAIN PAGE --- */
const Home = () => {
  const [matchesData, setMatchesData] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    getCurrentMatches()
      .then((res) => {
        setMatchesData(res.data); // ← correct mapping
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setMatchesLoading(false));
  }, []);

  if (matchesLoading && !matchesData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-slate-500 text-xs uppercase tracking-widest">
          Syncing Arena Telemetry...
        </p>
      </div>
    );
  }

  return (
    <>
      <TrendingBar />
      <LiveStrip rawMatches={matchesData} loading={matchesLoading} />
    </>
  );
};

/* --- SUPPORTING --- */
const TrendingBar = () => (
  <div className="bg-white dark:bg-slate-900 border-b py-3">
    <div className="container mx-auto px-4 flex items-center gap-6">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500">
        <TrendingUp size={14} /> Global Threads
      </span>
    </div>
  </div>
);

export default Home;
