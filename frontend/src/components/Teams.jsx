import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  BarChart2,
  X,
  Check,
  Shield,
  Users,
  ChevronRight,
  Globe,
  Trophy,
  Hash,
} from "lucide-react";
import axios from "../services/api";

/* ---------------- 🧠 HELPERS ---------------- */
const extractList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.list)) return data.list;
  if (Array.isArray(data.teams)) return data.teams;
  return [];
};

const normalizeTeam = (t) => {
  const id = t.teamId || t.id || t.teamID;
  const name = t.teamName || t.name || "Unknown Team";
  const code = t.teamSName || t.shortName || t.code || "";

  const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    code || name
  )}&background=0f172a&color=ffffff&size=256&bold=true`;

  return {
    id: String(id || name),
    name,
    code,
    logo,
  };
};

export default function Teams() {
  const [loading, setLoading] = useState(true);

  const [teamsData, setTeamsData] = useState({
    international: [],
    league: [],
    domestic: [],
    women: [],
  });

  const [activeCategory, setActiveCategory] = useState("international");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [compareMode, setCompareMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const categoryTabs = useMemo(
    () => [
      { key: "international", label: "International", icon: Globe },
      { key: "league", label: "League", icon: Trophy },
      { key: "domestic", label: "Domestic", icon: Hash },
      { key: "women", label: "Women", icon: Users },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);

    axios
      .get("/api/v1/cricket/teams/all")
      .then((res) => {
        const data = res.data || {};

        const international = extractList(data.international).map(normalizeTeam);
        const league = extractList(data.league).map(normalizeTeam);
        const domestic = extractList(data.domestic).map(normalizeTeam);
        const women = extractList(data.women).map(normalizeTeam);

        setTeamsData({
          international,
          league,
          domestic,
          women,
        });

        const firstNonEmpty =
          (international.length > 0 && "international") ||
          (league.length > 0 && "league") ||
          (domestic.length > 0 && "domestic") ||
          (women.length > 0 && "women") ||
          "international";

        setActiveCategory(firstNonEmpty);
      })
      .catch((err) => {
        console.error("Error fetching teams", err);
        setTeamsData({
          international: [],
          league: [],
          domestic: [],
          women: [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelectedTeams([]);
    setShowCompareModal(false);
  }, [activeCategory]);

  const categoryTeams = useMemo(() => {
    return teamsData?.[activeCategory] || [];
  }, [teamsData, activeCategory]);

  const filteredTeams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let list = [...categoryTeams].filter((team) => {
      const n = (team.name || "").toLowerCase();
      const c = (team.code || "").toLowerCase();
      return !q || n.includes(q) || c.includes(q);
    });

    if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "code") {
      list.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
    }

    return list;
  }, [categoryTeams, searchTerm, sortBy]);

  const toggleTeamSelection = (id) => {
    if (selectedTeams.includes(id)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== id));
      return;
    }
    if (selectedTeams.length >= 2) return;
    setSelectedTeams([...selectedTeams, id]);
  };

  const activeLabel =
    categoryTabs.find((t) => t.key === activeCategory)?.label || "Teams";

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#05070c] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Loading Teams
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 🟢 HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-600/10 dark:border-blue-500/20">
                <Shield size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Team Directory
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              {activeLabel}{" "}
              <span className="text-blue-600 dark:text-blue-500">Teams</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Browse teams by category, search instantly, and compare two teams
              side-by-side.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 dark:text-slate-500 dark:group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                placeholder={`Search ${activeLabel.toLowerCase()} teams...`}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] focus:ring-2 focus:ring-blue-500/40 outline-none transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedTeams([]);
                setShowCompareModal(false);
              }}
              className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${
                compareMode
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              {compareMode ? "Cancel Compare" : "Compare"}
            </button>
          </div>
        </header>

        {/* 🔵 CATEGORY TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const count = teamsData?.[tab.key]?.length || 0;
            const active = activeCategory === tab.key;

            if (count === 0) return null;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-5 py-2.5 rounded-2xl border transition-all flex items-center gap-2 ${
                  active
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                    : "bg-white dark:bg-[#080a0f] border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {tab.label}
                </span>
                <span
                  className={`ml-1 text-[10px] font-black px-2 py-1 rounded-xl ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 🔵 SORT BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white dark:bg-[#080a0f] p-1.5 rounded-2xl border border-black/10 dark:border-white/10 w-fit shadow-sm">
            {[
              { key: "name", label: "Name" },
              { key: "code", label: "Code" },
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setSortBy(type.key)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  sortBy === type.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {filteredTeams.length}
            </span>{" "}
            teams
          </div>
        </div>

        {/* 🟠 TEAM GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                compareMode={compareMode}
                isSelected={selectedTeams.includes(team.id)}
                onSelect={() => toggleTeamSelection(team.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 🟣 EMPTY STATE */}
        {filteredTeams.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No teams found for{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                “{searchTerm}”
              </span>
              .
            </p>
          </div>
        )}

        {/* 🟣 COMPARISON FLOATING BAR */}
        <AnimatePresence>
          {compareMode && selectedTeams.length > 0 && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
            >
              <div className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 text-slate-900 dark:text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 backdrop-blur-xl w-full max-w-xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-500 tracking-widest">
                    Compare Teams
                  </span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {selectedTeams.length} / 2 Selected
                  </span>
                </div>

                <div className="h-9 w-px bg-black/10 dark:bg-white/10" />

                <button
                  disabled={selectedTeams.length !== 2}
                  onClick={() => setShowCompareModal(true)}
                  className={`px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    selectedTeams.length === 2
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  }`}
                >
                  Start
                </button>

                <button
                  onClick={() => {
                    setCompareMode(false);
                    setSelectedTeams([]);
                    setShowCompareModal(false);
                  }}
                  className="ml-auto p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🟣 COMPARE MODAL */}
        <AnimatePresence>
          {showCompareModal && (
            <ComparisonModal
              team1={categoryTeams.find((t) => t.id === selectedTeams[0])}
              team2={categoryTeams.find((t) => t.id === selectedTeams[1])}
              onClose={() => setShowCompareModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TeamCard = ({ team, compareMode, isSelected, onSelect }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={
      !compareMode
        ? {
            y: -6,
            boxShadow: "0px 18px 50px rgba(0,0,0,0.12)",
          }
        : {}
    }
    onClick={compareMode ? onSelect : undefined}
    className={`relative p-7 rounded-3xl border transition-all cursor-pointer bg-white dark:bg-[#080a0f] ${
      isSelected
        ? "border-blue-500 ring-4 ring-blue-500/10"
        : "border-black/10 dark:border-white/10 hover:border-blue-500/40"
    }`}
  >
    {compareMode && (
      <div
        className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? "bg-blue-600 border-blue-600"
            : "border-slate-300 dark:border-slate-700"
        }`}
      >
        {isSelected && <Check size={14} className="text-white" />}
      </div>
    )}

    <div className="flex items-center gap-4 mb-6">
      <img
        src={team.logo}
        alt={team.name}
        className="h-14 w-14 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111827] p-2 shadow-sm"
      />

      <div className="min-w-0">
        <h3 className="font-black text-xl tracking-tight leading-tight truncate">
          {team.name}
        </h3>

        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
          <Users size={12} className="text-blue-600 dark:text-blue-500" />
          {team.code ? team.code : "TEAM"}
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center pt-5 border-t border-black/10 dark:border-white/10">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Team ID
        </span>
        <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
          {team.id}
        </span>
      </div>

      {!compareMode && (
        <Link
          to={`/teams/${team.id}`}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-colors border border-black/5 dark:border-white/10"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </div>
  </motion.div>
);

const ComparisonModal = ({ team1, team2, onClose }) => {
  if (!team1 || !team2) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 dark:bg-[#05070c]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] max-w-3xl w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-10 text-center">
          Team{" "}
          <span className="text-blue-600 dark:text-blue-500">Comparison</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompareCard team={team1} />
          <CompareCard team={team2} />
        </div>

        <div className="mt-10 pt-7 border-t border-black/10 dark:border-white/10 text-center">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/20"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CompareCard = ({ team }) => {
  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-6 text-center">
      <img
        src={team.logo}
        alt={team.name}
        className="h-20 w-20 mx-auto mb-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111827] p-3 shadow-sm"
      />
      <p className="text-lg font-black">{team.name}</p>
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
        {team.code || "TEAM"}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-2 text-left">
        <MiniStat label="Team ID" value={team.id} />
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] px-4 py-3">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <span className="text-[12px] font-extrabold text-slate-900 dark:text-white">
      {value || "-"}
    </span>
  </div>
);
