import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Activity,
  ShieldAlert,
  Clock,
  Loader2,
  Zap,
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";

import { matchApi } from "../services/api";

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [commentary, setCommentary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");

  const loadMatchCore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await matchApi.getMatchDetail(id);

      // Cricbuzz structures vary, keep safe fallback
      const data = res.data?.matchDetails || res.data?.matchInfo || res.data;
      setMatch(data || null);
    } catch (err) {
      console.error("Match fetch failed:", err);
      setMatch(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadScorecard = useCallback(async () => {
    setTabLoading(true);
    try {
      const res = await matchApi.getScorecard(id);
      setScorecard(res.data || null);
    } catch (err) {
      console.error("Scorecard fetch failed:", err);
      setScorecard(null);
    } finally {
      setTabLoading(false);
    }
  }, [id]);

  const loadCommentary = useCallback(async () => {
    setTabLoading(true);
    try {
      const res = await matchApi.getCommentary(id);
      setCommentary(res.data || null);
    } catch (err) {
      console.error("Commentary fetch failed:", err);
      setCommentary(null);
    } finally {
      setTabLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Reset tab data when match changes
    setMatch(null);
    setScorecard(null);
    setCommentary(null);
    setActiveTab("overview");

    loadMatchCore();
  }, [id, loadMatchCore]);

  // Lazy-load tab data only when needed (quota-friendly)
  useEffect(() => {
    if (activeTab === "scorecard" && !scorecard) loadScorecard();
    if (activeTab === "commentary" && !commentary) loadCommentary();
  }, [activeTab, scorecard, commentary, loadScorecard, loadCommentary]);

  if (loading) return <LoadingState />;
  if (!match) return <DetailError navigate={navigate} />;

  // Safe mapping
  const info = match.matchInfo || match;
  const score = match.matchScore || {};
  const t1 = info?.team1 || {};
  const t2 = info?.team2 || {};

  const statusText = info?.status || "Match status unavailable";
  const isDone =
    statusText.toLowerCase().includes("won") ||
    statusText.toLowerCase().includes("complete") ||
    info?.state === "Complete";

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white">
      {/* Subtle Professional Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.22em]">
              Back
            </span>
          </button>

          <div className="flex items-center gap-3 px-4 py-1.5 bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-full shadow-sm">
            <div
              className={`h-2 w-2 rounded-full ${
                isDone ? "bg-slate-300 dark:bg-slate-600" : "bg-red-600 animate-pulse"
              }`}
            />
            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider">
              {isDone ? "Post Match" : "Live"}
            </span>
          </div>
        </div>

        {/* PRIMARY MATCH CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-xl shadow-black/5 dark:shadow-black/40 overflow-hidden mb-8"
        >
          {/* Series Info Header */}
          <div className="px-8 md:px-10 py-4 bg-slate-900 text-white flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 line-clamp-1">
              {info?.seriesName || "International Fixture"}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {info?.matchFormat || "N/A"}
              </span>

              <button
                onClick={loadMatchCore}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
                title="Refresh"
              >
                <RefreshCcw size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Refresh
                </span>
              </button>
            </div>
          </div>

          <div className="p-8 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 md:gap-12">
              <TeamDisplay
                team={t1}
                score={score?.team1Score}
                isWinner={statusText.includes(t1?.teamName || "")}
              />

              <div className="flex flex-col items-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] mb-3">
                  VS
                </div>

                <div className="hidden md:block h-16 w-px bg-black/10 dark:bg-white/10" />

                <div className="mt-4 px-4 py-2 bg-blue-600/10 border border-blue-600/10 dark:border-blue-500/20 rounded-2xl">
                  <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                    {statusText}
                  </span>
                </div>
              </div>

              <TeamDisplay
                team={t2}
                score={score?.team2Score}
                isWinner={statusText.includes(t2?.teamName || "")}
              />
            </div>
          </div>
        </motion.div>

        {/* ANALYTICS TABS */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-slate-100 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl w-fit shadow-sm">
          <TabBtn
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            label="Overview"
            icon={<LayoutDashboard size={14} />}
          />
          <TabBtn
            active={activeTab === "scorecard"}
            onClick={() => setActiveTab("scorecard")}
            label="Scorecard"
            icon={<ListOrdered size={14} />}
          />
          <TabBtn
            active={activeTab === "commentary"}
            onClick={() => setActiveTab("commentary")}
            label="Commentary"
            icon={<MessageSquare size={14} />}
          />
        </div>

        {tabLoading && activeTab !== "overview" && (
          <div className="mb-6 bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={18} />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Loading {activeTab}...
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              <InfoBlock
                icon={<MapPin size={18} />}
                label="Venue"
                value={info?.venueInfo?.shortName || info?.venue || "N/A"}
              />
              <InfoBlock
                icon={<Clock size={18} />}
                label="Local Time"
                value={
                  info?.startDate
                    ? new Date(info.startDate).toLocaleString()
                    : "N/A"
                }
              />
              <InfoBlock
                icon={<Activity size={18} />}
                label="Innings Status"
                value={statusText}
              />
            </motion.div>
          )}

          {activeTab === "scorecard" && (
            <motion.div
              key="scorecard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-sm"
            >
              <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-[0.22em]">
                Scorecard (Raw)
              </div>

              {scorecard ? (
                <pre className="text-xs overflow-auto max-h-[500px] bg-slate-50 dark:bg-black/30 p-4 rounded-2xl border border-black/5 dark:border-white/10">
                  {JSON.stringify(scorecard, null, 2)}
                </pre>
              ) : (
                <EmptyTabState text="Scorecard not available for this match yet." />
              )}
            </motion.div>
          )}

          {activeTab === "commentary" && (
            <motion.div
              key="commentary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-sm"
            >
              <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-[0.22em]">
                Commentary (Raw)
              </div>

              {commentary ? (
                <pre className="text-xs overflow-auto max-h-[500px] bg-slate-50 dark:bg-black/30 p-4 rounded-2xl border border-black/5 dark:border-white/10">
                  {JSON.stringify(commentary, null, 2)}
                </pre>
              ) : (
                <EmptyTabState text="Commentary not available for this match." />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =========================
   SUB-COMPONENTS
========================= */

const TeamDisplay = ({ team = {}, score, isWinner }) => (
  <div className="flex flex-col items-center text-center">
    <div
      className={`w-24 h-24 rounded-3xl border flex items-center justify-center text-3xl font-black mb-6 transition-all duration-300 shadow-sm ${
        isWinner
          ? "border-blue-600/30 text-blue-600 dark:text-blue-400 bg-blue-600/10"
          : "border-black/10 dark:border-white/10 text-slate-900 dark:text-white bg-slate-50 dark:bg-white/[0.03]"
      }`}
    >
      {team?.teamName ? team.teamName[0] : "?"}
    </div>

    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
      {team?.teamName || "Unknown"}
    </h2>

    <div className="text-3xl font-mono font-black text-slate-900 dark:text-white">
      {score?.inngs1?.runs || 0}
      <span className="text-slate-300 dark:text-slate-600">/</span>
      {score?.inngs1?.wickets || 0}
    </div>

    <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
      {score?.inngs1?.overs || 0} Overs
    </div>
  </div>
);

const TabBtn = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm border border-black/10 dark:border-white/10"
        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
    }`}
  >
    {icon} {label}
  </button>
);

const InfoBlock = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 rounded-2xl border border-black/5 dark:border-white/10">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.22em] mb-1">
        {label}
      </div>
      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
        {value}
      </div>
    </div>
  </div>
);

const EmptyTabState = ({ text }) => (
  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
    <Zap size={16} className="text-slate-300 dark:text-slate-600" />
    {text}
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-white dark:bg-[#05070c] flex flex-col items-center justify-center">
    <Loader2 className="animate-spin text-blue-600 dark:text-blue-500 mb-4" size={40} />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
      Loading Match Details
    </span>
  </div>
);

const DetailError = ({ navigate }) => (
  <div className="min-h-screen bg-white dark:bg-[#05070c] flex flex-col items-center justify-center text-center p-6">
    <ShieldAlert size={64} className="text-slate-200 dark:text-slate-700 mb-6" />
    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">
      Match Unavailable
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs">
      Match data could not be loaded right now.
    </p>
    <button
      onClick={() => navigate("/home")}
      className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      Return to Dashboard
    </button>
  </div>
);
