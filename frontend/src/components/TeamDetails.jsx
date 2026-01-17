import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  ChevronLeft,
  Shield,
  TrendingUp,
  Search,
  MapPin,
  Calendar,
  ListOrdered,
} from "lucide-react";
import axios from "../services/api";

/* ---------------- 🧠 HELPERS ---------------- */
const safeStr = (v, fallback = "") =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

const getAvatarLogo = (name, code = "") => {
  const label = code || name || "Team";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    label
  )}&background=0f172a&color=ffffff&size=256&bold=true`;
};

const normalizePlayer = (p) => {
  const name = safeStr(p?.name || p?.fullName, "Unknown Player");
  const role = safeStr(p?.role || p?.playingRole || p?.category, "Player");

  return {
    name,
    role,
    isInternational: Boolean(p?.isInternational || p?.intl || p?.international),
  };
};

const roleMatchesTab = (role, tab) => {
  const r = String(role || "").toLowerCase();

  if (tab === "All") return true;

  if (tab === "Batters") {
    return (
      r.includes("bat") ||
      r.includes("batsman") ||
      r.includes("batter") ||
      r.includes("top order") ||
      r.includes("middle order")
    );
  }

  if (tab === "Bowlers") {
    return (
      r.includes("bowl") ||
      r.includes("bowler") ||
      r.includes("fast") ||
      r.includes("pace") ||
      r.includes("spin")
    );
  }

  if (tab === "All-Rounders") {
    return r.includes("all") || r.includes("rounder");
  }

  return true;
};

const extractMatchList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  // common shapes
  if (Array.isArray(data?.matchScheduleMap)) return data.matchScheduleMap;
  if (Array.isArray(data?.matchDetails)) return data.matchDetails;
  if (Array.isArray(data?.list)) return data.list;
  if (Array.isArray(data?.matches)) return data.matches;

  return [];
};

const normalizeMatchItem = (m) => {
  // We keep it very safe because Cricbuzz response differs across endpoints
  const matchId =
    m?.matchId ||
    m?.matchInfo?.matchId ||
    m?.match?.matchId ||
    m?.id ||
    null;

  const matchDesc =
    safeStr(m?.matchDesc) ||
    safeStr(m?.matchInfo?.matchDesc) ||
    safeStr(m?.match?.matchDesc) ||
    "Match";

  const seriesName =
    safeStr(m?.seriesName) ||
    safeStr(m?.matchInfo?.seriesName) ||
    safeStr(m?.series?.name) ||
    "Series";

  const venue =
    safeStr(m?.venueInfo?.ground) ||
    safeStr(m?.matchInfo?.venueInfo?.ground) ||
    safeStr(m?.venue) ||
    "Venue";

  const startDate =
    safeStr(m?.matchInfo?.startDate) ||
    safeStr(m?.startDate) ||
    safeStr(m?.date) ||
    "";

  const status =
    safeStr(m?.matchInfo?.status) ||
    safeStr(m?.status) ||
    safeStr(m?.state) ||
    "";

  return {
    matchId,
    matchDesc,
    seriesName,
    venue,
    startDate,
    status,
  };
};

export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [pageTab, setPageTab] = useState("Squad"); // Squad | Stats | Schedule | Results
  const [roleTab, setRoleTab] = useState("All"); // All | Batters | Bowlers | All-Rounders

  const [team, setTeam] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const [playersRes, statsRes, scheduleRes, resultsRes] =
          await Promise.allSettled([
            axios.get(`/api/v1/cricket/team/${teamId}/players`),
            axios.get(`/api/v1/cricket/team/${teamId}/stats`),
            axios.get(`/api/v1/cricket/team/${teamId}/schedule`),
            axios.get(`/api/v1/cricket/team/${teamId}/results`),
          ]);

        // ---------------- Players ----------------
        const playersData =
          playersRes.status === "fulfilled" ? playersRes.value.data : null;

        const playersRaw =
          playersData?.player ||
          playersData?.players ||
          playersData?.list ||
          playersData ||
          [];

        const squad = Array.isArray(playersRaw)
          ? playersRaw.map(normalizePlayer)
          : [];

        // ---------------- Stats ----------------
        const stats =
          statsRes.status === "fulfilled" ? statsRes.value.data || {} : {};

        const name = safeStr(
          stats?.teamName || stats?.name || stats?.team?.name,
          `Team ${teamId}`
        );

        const code = safeStr(stats?.teamSName || stats?.code, "");
        const logo =
          safeStr(stats?.teamLogo || stats?.logo, "") || getAvatarLogo(name, code);

        const teamObj = {
          id: teamId,
          name,
          code,
          logo,

          location: safeStr(stats?.country || stats?.location, "N/A"),
          captain: safeStr(stats?.captain, "N/A"),
          coach: safeStr(stats?.coach, "N/A"),

          overview: safeStr(
            stats?.overview,
            "Team overview not available from the API."
          ),

          // we keep this but show only if exists
          rankings: {
            t20: stats?.rankings?.t20 || stats?.t20Rank || null,
          },

          trophyCabinet: Array.isArray(stats?.trophyCabinet)
            ? stats.trophyCabinet
            : [],

          squad,
        };

        // ---------------- Schedule ----------------
        const scheduleData =
          scheduleRes.status === "fulfilled" ? scheduleRes.value.data : null;

        const scheduleList = extractMatchList(scheduleData)
          .flatMap((x) => (Array.isArray(x) ? x : [x]))
          .map(normalizeMatchItem)
          .filter((x) => x.matchDesc || x.seriesName);

        // ---------------- Results ----------------
        const resultsData =
          resultsRes.status === "fulfilled" ? resultsRes.value.data : null;

        const resultsList = extractMatchList(resultsData)
          .flatMap((x) => (Array.isArray(x) ? x : [x]))
          .map(normalizeMatchItem)
          .filter((x) => x.matchDesc || x.seriesName);

        if (mounted) {
          setTeam(teamObj);
          setSchedule(scheduleList);
          setResults(resultsList);
        }
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

    list = list.filter((p) => roleMatchesTab(p.role, roleTab));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => String(p.name).toLowerCase().includes(q));
    }

    return list;
  }, [team, roleTab, searchQuery]);

  const totalTrophies =
    team?.trophyCabinet?.reduce((a, b) => a + (b?.count || 0), 0) || 0;

  const showTrophies = totalTrophies > 0;
  const showT20Rank = Boolean(team?.rankings?.t20);

  if (loading) {
    return (
      <div className="h-screen bg-white dark:bg-[#05070c] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="h-screen bg-white dark:bg-[#05070c] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest text-[11px]">
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-200">
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
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] p-5 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center overflow-hidden">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-full h-full object-contain p-2"
                />
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
                  {team.captain !== "N/A" && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                      <Users size={14} className="text-blue-500" />
                      Captain:{" "}
                      <b className="text-slate-800 dark:text-slate-200">
                        {team.captain}
                      </b>
                    </span>
                  )}

                  {team.coach !== "N/A" && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                      <Shield size={14} className="text-emerald-500" />
                      Coach:{" "}
                      <b className="text-slate-800 dark:text-slate-200">
                        {team.coach}
                      </b>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK STATS (ONLY IF REAL) */}
            {(showTrophies || showT20Rank) && (
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                {showTrophies && (
                  <StatCard icon={Trophy} label="Titles" value={totalTrophies} />
                )}
                {showT20Rank && (
                  <StatCard
                    icon={TrendingUp}
                    label="T20 Rank"
                    value={`#${team.rankings.t20}`}
                  />
                )}
              </div>
            )}
          </div>

          {/* OVERVIEW */}
          {team.overview && (
            <div className="mt-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4">
              <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {team.overview}
              </p>
            </div>
          )}
        </div>

        {/* PAGE TABS */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[
            { key: "Squad", icon: Users },
            { key: "Stats", icon: TrendingUp },
            { key: "Schedule", icon: Calendar },
            { key: "Results", icon: ListOrdered },
          ].map((t) => {
            const Icon = t.icon;
            const active = pageTab === t.key;

            return (
              <button
                key={t.key}
                onClick={() => setPageTab(t.key)}
                className={`px-5 py-2.5 rounded-2xl border transition-all flex items-center gap-2 ${
                  active
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                    : "bg-white dark:bg-[#080a0f] border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t.key}
                </span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          {/* SQUAD */}
          {pageTab === "Squad" && (
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] overflow-hidden">
              <div className="p-5 md:p-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight">Squad</h2>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                    Showing{" "}
                    <span className="font-black text-blue-600 dark:text-blue-500">
                      {filteredSquad.length}
                    </span>{" "}
                    players
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 p-1 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                    {["All", "Batters", "Bowlers", "All-Rounders"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setRoleTab(t)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-extrabold transition ${
                          roleTab === t
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

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

              <div className="p-5 md:p-6">
                {filteredSquad.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
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
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-extrabold text-blue-600 dark:text-blue-400 text-[12px] shrink-0">
                              {(p.name || "NA").substring(0, 2).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="text-[13px] font-extrabold text-slate-900 dark:text-white truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {p.role}
                              </p>
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
          )}

          {/* STATS */}
          {pageTab === "Stats" && (
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] p-6">
              <h2 className="text-lg font-black tracking-tight">Stats</h2>
              <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                Cricbuzz team stats are limited for some teams. We only show what
                the API provides.
              </p>
            </div>
          )}

          {/* SCHEDULE */}
          {pageTab === "Schedule" && (
            <MatchesPanel
              title="Schedule"
              subtitle="Upcoming fixtures for this team (cached in Firestore)."
              items={schedule}
              emptyText="No schedule data available."
            />
          )}

          {/* RESULTS */}
          {pageTab === "Results" && (
            <MatchesPanel
              title="Results"
              subtitle="Recent match results for this team (cached in Firestore)."
              items={results}
              emptyText="No results data available."
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */
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

const MatchesPanel = ({ title, subtitle, items, emptyText }) => {
  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-black/10 dark:border-white/10">
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="p-5 md:p-6">
        {!items || items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              {emptyText}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {items.map((m, idx) => (
                <motion.div
                  layout
                  key={`${m.matchId || "m"}-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 hover:border-blue-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold text-slate-900 dark:text-white truncate">
                        {m.matchDesc}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {m.seriesName}
                      </p>
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {m.venue}
                      </p>
                    </div>

                    {m.status ? (
                      <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                        {m.status}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
