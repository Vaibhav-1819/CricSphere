import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import MatchHeader from "../components/match/MatchHeader";
import LiveScore from "../components/match/LiveScore";
import {
  Loader2,
  MessageSquare,
  ListChecks,
  Users2,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchPage() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState("commentary");

  // ✅ FIX: Use relative URL (api instance already has baseURL)
  const { data, loading, error } = useFetch(`/api/v1/cricket/match/${matchId}`);

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

  if (error || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-400 gap-4">
        <Activity size={48} className="opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">
          Telemetry Connection Lost
        </p>
      </div>
    );
  }

  // Backend returns JSON string OR object sometimes
  // If your backend sends String, then axios gives string -> parse it safely
  const parsed = typeof data === "string" ? safeJsonParse(data) : data;

  // In your backend controller you return ResponseEntity<String>
  // so frontend will get raw JSON string unless backend sets proper JSON content-type
  // We'll support both shapes:
  const match = parsed?.matchDetails || parsed?.matchInfo || parsed;

  const info = match?.matchInfo || match;
  const score = match?.matchScore || {};

  const team1Name = info?.team1?.teamName || "Team 1";
  const team2Name = info?.team2?.teamName || "Team 2";

  const tabs = [
    { id: "commentary", label: "Commentary", icon: MessageSquare },
    { id: "scorecard", label: "Scorecard", icon: ListChecks },
    { id: "squads", label: "Squads", icon: Users2 },
  ];

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
            {activeTab === "commentary" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                  <p className="text-slate-500 italic text-sm">
                    Ball-by-ball commentary for {team1Name} vs {team2Name} will
                    stream here...
                  </p>
                </div>
              </div>
            )}

            {activeTab === "scorecard" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                <h4 className="text-sm font-black uppercase tracking-tighter mb-4">
                  Detailed Scorecard
                </h4>

                <pre className="text-[10px] text-slate-500 overflow-auto">
                  {JSON.stringify(score, null, 2)}
                </pre>
              </div>
            )}

            {activeTab === "squads" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SquadList teamName={team1Name} />
                <SquadList teamName={team2Name} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const SquadList = ({ teamName }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
    <h3 className="text-[10px] font-black uppercase text-blue-500 mb-4 tracking-widest">
      {teamName} XI
    </h3>
    <div className="space-y-3">
      {[...Array(11)].map((_, i) => (
        <div
          key={i}
          className="h-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse"
        />
      ))}
    </div>
  </div>
);

// ✅ Safe JSON parse helper
function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
