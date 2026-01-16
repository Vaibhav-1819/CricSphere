import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, ChevronLeft, Shield, TrendingUp, Search, MapPin } from "lucide-react";
import axios from "../services/api";

export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const [playersRes, statsRes] = await Promise.all([
          axios.get(`/api/v1/cricket/team/${teamId}/players`),
          axios.get(`/api/v1/cricket/team/${teamId}/stats`),
        ]);

        const playersRaw =
          playersRes.data?.player || playersRes.data?.players || playersRes.data || [];

        const squad = Array.isArray(playersRaw)
          ? playersRaw.map((p) => ({
              name: p.name || p.fullName || "Unknown",
              role: p.role || p.playingRole || "Player",
              isInternational: !!p.isInternational,
            }))
          : [];

        const stats = statsRes.data || {};

        const teamObj = {
          id: teamId,
          name: stats?.teamName || stats?.name || `Team ${teamId}`,
          logo: stats?.teamLogo || stats?.logo || "",
          location: stats?.country || stats?.location || "N/A",
          captain: stats?.captain || "N/A",
          coach: stats?.coach || "N/A",
          overview: stats?.overview || "Team overview not available.",
          rankings: {
            t20: stats?.rankings?.t20 || stats?.t20Rank || "-",
          },
          trophyCabinet: stats?.trophyCabinet || [],
          squad,
        };

        if (mounted) setTeam(teamObj);
      } catch (e) {
        console.error("Failed to load team details", e);
        if (mounted) setTeam(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [teamId]);

  const filteredSquad = useMemo(() => {
    if (!team?.squad) return [];

    let list = [...team.squad];

    // role filter (simple + safe)
    if (activeTab !== "All") {
      const map = {
        Batters: "bat",
        Bowlers: "bowl",
        "All-Rounders": "all",
      };

      const key = map[activeTab];
      list = list.filter((p) => String(p.role).toLowerCase().includes(key));
    }

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => String(p.name).toLowerCase().includes(q));
    }

    return list;
  }, [team, activeTab, searchQuery]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-[#05070c] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-[#05070c] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-extrabold uppercase tracking-widest text-[11px]">
          Team not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-wide"
        >
          Go Back
        </button>
      </div>
    );
  }

  const totalTrophies =
    team.trophyCabinet?.reduce((a, b) => a + (b.count || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] text-slate-900 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* TOP BAR */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {/* HEADER CARD */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-5 md:p-6">
          <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center overflow-hidden">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-[11px] font-extrabold text-slate-400">
                    N/A
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                    {team.name}
                  </h1>

                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <MapPin size={12} />
                    {team.location}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                    <Users size={14} className="text-blue-500" />
                    Captain: <b className="text-slate-800 dark:text-slate-200">{team.captain}</b>
                  </span>

                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                    <Shield size={14} className="text-emerald-500" />
                    Coach: <b className="text-slate-800 dark:text-slate-200">{team.coach}</b>
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <StatCard icon={Trophy} label="Titles" value={totalTrophies} />
              <StatCard
                icon={TrendingUp}
                label="T20 Rank"
                value={team.rankings?.t20 ? `#${team.rankings.t20}` : "-"}
              />
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="mt-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4">
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {team.overview}
            </p>
          </div>
        </div>

        {/* SQUAD */}
        <div className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] overflow-hidden">
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <h2 className="text-lg font-black tracking-tight">Squad</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                {["All", "Batters", "Bowlers", "All-Rounders"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-extrabold transition ${
                      activeTab === t
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-[260px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] px-10 py-2.5 text-[12px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="p-5 md:p-6">
            {filteredSquad.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[12px] font-semibold text-slate-500">
                  No players found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredSquad.map((p, idx) => (
                    <motion.div
                      layout
                      key={`${p.name}-${idx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-4 py-3 flex items-center justify-between hover:border-blue-500/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-extrabold text-blue-600 dark:text-blue-400 text-[12px]">
                          {(p.name || "NA").substring(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-[13px] font-extrabold text-slate-900 dark:text-white">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{p.role}</p>
                        </div>
                      </div>

                      {p.isInternational ? (
                        <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          INTL
                        </span>
                      ) : null}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-4 py-3 text-center">
    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-2">
      <Icon size={16} className="text-blue-500" />
    </div>
    <div className="text-xl font-black text-slate-900 dark:text-white">
      {value}
    </div>
    <div className="text-[11px] font-semibold text-slate-500">{label}</div>
  </div>
);
