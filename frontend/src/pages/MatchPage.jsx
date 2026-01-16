import { useState, useMemo } from "react";
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
   Commentary Extractor
========================= */
function extractCommentary(match) {
  // Try common shapes (Cricbuzz / RapidAPI variations)
  const comm =
    match?.commentary ||
    match?.comm ||
    match?.commentaryList ||
    match?.ballByBall ||
    match?.commentaryData ||
    match?.matchCommentary ||
    [];

  if (Array.isArray(comm)) return comm;

  // Some APIs wrap it inside object
  if (comm?.commentaryList && Array.isArray(comm.commentaryList))
    return comm.commentaryList;

  return [];
}

/* =========================
   Scorecard Extractor
========================= */
function extractScorecard(match) {
  // Most of your current response has matchScore only
  const scorecard =
    match?.scorecard ||
    match?.matchScore ||
    match?.scoreCard ||
    match?.innings ||
    null;

  return scorecard;
}

/* =========================
   MatchPage
========================= */
export default function MatchPage() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState("commentary");

  // ✅ Using relative URL (axios baseURL handled inside api instance)
  const { data, loading, error } = useFetch(`/api/v1/cricket/match/${matchId}`);

  const parsed = useMemo(() => {
    if (!data) return null;
    return typeof data === "string" ? safeJsonParse(data) : data;
  }, [data]);

  // ✅ Support multiple backend shapes
  const match = useMemo(() => {
    if (!parsed) return null;
    return parsed?.data || parsed?.matchDetails || parsed?.matchInfo || parsed;
  }, [parsed]);

  const info = match?.matchInfo || match;

  const team1Name = info?.team1?.teamName || "Team 1";
  const team2Name = info?.team2?.teamName || "Team 2";

  const commentaryList = useMemo(() => extractCommentary(match), [match]);
  const scorecard = useMemo(() => extractScorecard(match), [match]);

  const tabs = [
    { id: "commentary", label: "Commentary", icon: MessageSquare },
    { id: "scorecard", label: "Scorecard", icon: ListChecks },
    { id: "squads", label: "Squads", icon: Users2 },
  ];

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#080a0f] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Syncing Stadium Feed
        </span>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-400 gap-4">
        <Activity size={48} className="opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">
          Telemetry Connection Lost
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#080a0f] min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* 🟢 HERO SECTION */}
        <MatchHeader match={match} />
        <LiveScore match={match} />

        {/* 🔵 TAB NAVIGATION */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl mb-8 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 🟠 DYNAMIC CONTENT AREA */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* =========================
               COMMENTARY
            ========================= */}
            {activeTab === "commentary" && (
              <div className="space-y-4">
                {commentaryList.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                    <Info className="mx-auto text-slate-300 mb-3" size={32} />
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-bold">
                      Commentary not available yet
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      We’ll connect the commentary endpoint next for{" "}
                      {team1Name} vs {team2Name}.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Ball-by-ball Commentary
                      </h3>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {commentaryList.slice(0, 30).map((c, idx) => (
                        <div key={idx} className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {c?.overNumber || c?.over || c?.ball || "•"}
                              </p>
                              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                {c?.commText ||
                                  c?.text ||
                                  c?.commentary ||
                                  "Update not available."}
                              </p>
                            </div>

                            {c?.event && (
                              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                {c.event}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================
               SCORECARD
            ========================= */}
            {activeTab === "scorecard" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black uppercase tracking-tighter">
                    Scorecard
                  </h4>

                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    CricSphere
                  </span>
                </div>

                {!scorecard ? (
                  <div className="py-10 text-center text-slate-500">
                    <Info className="mx-auto mb-3 opacity-40" size={34} />
                    <p className="text-sm font-bold">
                      Scorecard data not available
                    </p>
                    <p className="text-xs mt-2">
                      We’ll connect full innings tables next.
                    </p>
                  </div>
                ) : (
                  <pre className="text-[10px] text-slate-500 overflow-auto bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    {JSON.stringify(scorecard, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* =========================
               SQUADS
            ========================= */}
            {activeTab === "squads" && <SquadsPanel match={match} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
