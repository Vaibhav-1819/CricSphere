import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import MatchHeader from "../components/match/MatchHeader";
import LiveScore from "../components/match/LiveScore";
import { Loader2, MessageSquare, ListChecks, Users2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchPage() {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState("commentary");

  // Note: For Live Matches, we ideally pass a 'noCache' flag to useFetch 
  // or use a shorter CACHE_DURATION to ensure the score updates.
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/api/v1/cricket/match/${matchId}`
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#080a0f] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing Stadium Feed</span>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-400 gap-4">
        <Activity size={48} className="opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">Telemetry Connection Lost</p>
      </div>
    );
  }

  const match = data.data;

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
                 {/* This would eventually be a Commentary Component */}
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                    <p className="text-slate-500 italic text-sm">Ball-by-ball commentary for {match.team1.name} vs {match.team2.name} will stream here...</p>
                 </div>
              </div>
            )}

            {activeTab === "scorecard" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                 <h4 className="text-sm font-black uppercase tracking-tighter mb-4">Detailed Scorecard</h4>
                 {/* Scorecard Table component goes here */}
              </div>
            )}

            {activeTab === "squads" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SquadList teamName={match.team1.name} />
                <SquadList teamName={match.team2.name} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

// Internal Mini-Component for Squads
const SquadList = ({ teamName }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
    <h3 className="text-[10px] font-black uppercase text-blue-500 mb-4 tracking-widest">{teamName} XI</h3>
    <div className="space-y-3">
      {[...Array(11)].map((_, i) => (
        <div key={i} className="h-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse" />
      ))}
    </div>
  </div>
);