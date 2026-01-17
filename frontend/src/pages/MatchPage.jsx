import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

import MatchHeader from "../components/match/MatchHeader";
import LiveScore from "../components/match/LiveScore";
import SquadsPanel from "../components/match/SquadsPanel";

import {
  Loader2,
  MessageSquare,
  ListChecks,
  Users2,
  Activity,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { matchApi } from "../services/api";

/* =========================
   Safe JSON Parse
========================= */
function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/* =========================
   Safe Extractors
========================= */
function extractMatchCore(parsed) {
  if (!parsed) return null;
  return parsed?.data || parsed?.matchDetails || parsed?.matchInfo || parsed;
}

function extractCommentary(raw) {
  if (!raw) return [];

  const comm =
    raw?.commentaryList ||
    raw?.commLines ||
    raw?.commentary ||
    raw?.data?.commentaryList ||
    raw?.data?.commLines ||
    raw?.data?.commentary ||
    [];

  if (Array.isArray(comm)) return comm;

  if (comm?.commentaryList && Array.isArray(comm.commentaryList)) {
    return comm.commentaryList;
  }

  return [];
}

function extractScorecard(raw) {
  if (!raw) return null;

  return (
    raw?.scorecard ||
    raw?.scoreCard ||
    raw?.matchScorecard ||
    raw?.innings ||
    raw?.data?.scorecard ||
    raw?.data?.scoreCard ||
    raw?.data?.matchScorecard ||
    null
  );
}

/* =========================
   MatchPage
========================= */
export default function MatchPage() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState("commentary");

  // 1) Overview loads first
  const { data, loading, error } = useFetch(`/api/v1/cricket/match/${matchId}`);

  const parsedOverview = useMemo(() => {
    if (!data) return null;
    return typeof data === "string" ? safeJsonParse(data) : data;
  }, [data]);

  const match = useMemo(() => extractMatchCore(parsedOverview), [parsedOverview]);
  const info = match?.matchInfo || match;

  const team1Name = info?.team1?.teamName || "Team 1";
  const team2Name = info?.team2?.teamName || "Team 2";

  // 2) Lazy tab data
  const [commentaryData, setCommentaryData] = useState(null);
  const [scorecardData, setScorecardData] = useState(null);
  const [squadsData, setSquadsData] = useState(null);

  const [tabLoading, setTabLoading] = useState(false);

  // Reset when match changes
  useEffect(() => {
    setCommentaryData(null);
    setScorecardData(null);
    setSquadsData(null);
  }, [matchId]);

  const loadCommentary = useCallback(async () => {
    if (commentaryData) return;
    setTabLoading(true);
    try {
      const res = await matchApi.getCommentary(matchId);
      setCommentaryData(res.data || null);
    } catch (e) {
      console.error("Commentary fetch failed:", e);
      setCommentaryData(null);
    } finally {
      setTabLoading(false);
    }
  }, [matchId, commentaryData]);

  const loadScorecard = useCallback(async () => {
    if (scorecardData) return;
    setTabLoading(true);
    try {
      const res = await matchApi.getScorecard(matchId);
      setScorecardData(res.data || null);
    } catch (e) {
      console.error("Scorecard fetch failed:", e);
      setScorecardData(null);
    } finally {
      setTabLoading(false);
    }
  }, [matchId, scorecardData]);

  const loadSquads = useCallback(async () => {
    if (squadsData) return;
    setTabLoading(true);
    try {
      const res = await matchApi.getSquads(matchId);
      setSquadsData(res.data || null);
    } catch (e) {
      console.error("Squads fetch failed:", e);
      setSquadsData(null);
    } finally {
      setTabLoading(false);
    }
  }, [matchId, squadsData]);

  // Lazy load when tab changes
  useEffect(() => {
    if (activeTab === "commentary") loadCommentary();
    if (activeTab === "scorecard") loadScorecard();
    if (activeTab === "squads") loadSquads();
  }, [activeTab, loadCommentary, loadScorecard, loadSquads]);

  const commentaryList = useMemo(
    () => extractCommentary(commentaryData),
    [commentaryData]
  );

  const scorecard = useMemo(
    () => extractScorecard(scorecardData),
    [scorecardData]
  );

  const tabs = [
    { id: "commentary", label: "Commentary", icon: MessageSquare },
    { id: "scorecard", label: "Scorecard", icon: ListChecks },
    { id: "squads", label: "Squads", icon: Users2 },
  ];

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#05070c] gap-3">
        <Loader2 className="animate-spin text-blue-500" size={38} />
        <span className="text-[12px] font-semibold text-slate-500">
          Loading match details...
        </span>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#05070c] text-slate-500 gap-3">
        <Activity size={44} className="opacity-30" />
        <p className="text-sm font-semibold">Unable to load match right now.</p>
        <p className="text-[12px] text-slate-400">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#05070c] min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        {/* Header blocks */}
        <MatchHeader match={match} />
        <LiveScore match={match} />

        {/* Tabs */}
        <div className="mt-6 mb-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-1 shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-extrabold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab loading */}
        {tabLoading && (
          <div className="mb-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-4 flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={18} />
            <p className="text-[12px] font-semibold text-slate-500">
              Loading {activeTab}...
            </p>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {/* Commentary */}
            {activeTab === "commentary" && (
              <div className="space-y-4">
                {commentaryList.length === 0 ? (
                  <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-8 text-center">
                    <Info className="mx-auto text-slate-300 mb-3" size={32} />
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                      Commentary not available yet
                    </p>
                    <p className="text-slate-500 text-[12px] mt-2">
                      Match: {team1Name} vs {team2Name}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] overflow-hidden">
                    <div className="px-5 py-4 border-b border-black/10 dark:border-white/10">
                      <h3 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest">
                        Ball-by-ball
                      </h3>
                    </div>

                    <div className="divide-y divide-black/10 dark:divide-white/10">
                      {commentaryList.slice(0, 30).map((c, idx) => {
                        const over = c?.overNumber || c?.over || c?.ball || "•";
                        const text =
                          c?.commText ||
                          c?.text ||
                          c?.commentary ||
                          "Update not available.";

                        return (
                          <div key={idx} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-[12px] font-extrabold text-slate-900 dark:text-white">
                                  {over}
                                </p>
                                <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                  {text}
                                </p>
                              </div>

                              {c?.event ? (
                                <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  {c.event}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scorecard */}
            {activeTab === "scorecard" && (
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-extrabold">Scorecard</h4>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    CricSphere
                  </span>
                </div>

                {!scorecard ? (
                  <div className="py-10 text-center text-slate-500">
                    <Info className="mx-auto mb-3 opacity-40" size={34} />
                    <p className="text-sm font-semibold">
                      Scorecard data not available
                    </p>
                    <p className="text-[12px] mt-2">
                      This match might not have full innings tables yet.
                    </p>
                  </div>
                ) : (
                  <pre className="text-[11px] text-slate-600 dark:text-slate-300 overflow-auto bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl p-4">
                    {JSON.stringify(scorecard, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Squads */}
            {activeTab === "squads" && (
              <SquadsPanel match={squadsData || match} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
