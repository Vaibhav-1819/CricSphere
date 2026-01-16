import React, { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import axios from "../services/api";

/* ---------------- 🧠 NORMALIZER ---------------- */
const normalizeTeam = (t) => {
  const id = t.teamId || t.id;
  const name = t.teamName || t.name || "Unknown Team";
  const code = t.teamSName || t.code || "";

  // Cricbuzz doesn’t give official logo URLs directly in most cases
  // so we fallback to a generated badge placeholder.
  const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    code || name
  )}&background=0f172a&color=ffffff&size=256&bold=true`;

  return {
    id: String(id),
    name,
    code,
    logo,

    // Not provided by Cricbuzz teams list → safe defaults
    captain: "TBA",
    trophies: 0,
    avgRank: 99,
    winRate: 0,
  };
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");

  const [compareMode, setCompareMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/api/v1/cricket/teams/international")
      .then((res) => {
        // Cricbuzz structure usually contains "list"
        const rawList = res.data?.list || res.data?.teams || res.data || [];

        const normalized = Array.isArray(rawList)
          ? rawList.map(normalizeTeam)
          : [];

        setTeams(normalized);
      })
      .catch((err) => {
        console.error("Error fetching teams", err);
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedTeams = useMemo(() => {
    if (!Array.isArray(teams)) return [];

    let list = [...teams].filter((team) => {
      const n = team.name?.toLowerCase() || "";
      const c = team.code?.toLowerCase() || "";
      const q = searchTerm.toLowerCase();
      return n.includes(q) || c.includes(q);
    });

    if (sortBy === "trophies") {
      list.sort((a, b) => (b.trophies || 0) - (a.trophies || 0));
    } else if (sortBy === "rank") {
      list.sort((a, b) => (a.avgRank || 99) - (b.avgRank || 99));
    } else {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [teams, searchTerm, sortBy]);

  const toggleTeamSelection = (id) => {
    if (selectedTeams.includes(id)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== id));
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, id]);
    }
  };

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
                ICC Global Directory
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              World <span className="text-blue-600 dark:text-blue-500">Teams</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Browse international teams, filter quickly, and compare side-by-side.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 dark:text-slate-500 dark:group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search teams..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] focus:ring-2 focus:ring-blue-500/40 outline-none transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedTeams([]);
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

        {/* 🔵 SORT BAR */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#080a0f] p-1.5 rounded-2xl border border-black/10 dark:border-white/10 w-fit mb-8 shadow-sm">
          {["rank", "trophies", "name"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                sortBy === type
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 🟠 TEAM GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {sortedTeams.map((team) => (
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
                  }}
                  className="ml-auto p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCompareModal && (
            <ComparisonModal
              team1={teams.find((t) => t.id === selectedTeams[0])}
              team2={teams.find((t) => t.id === selectedTeams[1])}
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
          {team.captain || "TBA"}
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center pt-5 border-t border-black/10 dark:border-white/10">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Titles
        </span>
        <span className="font-black text-amber-500">🏆 {team.trophies || 0}</span>
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
        className="bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] max-w-4xl w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-10 text-center">
          Head-to-Head <span className="text-blue-600 dark:text-blue-500">Analysis</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          <div className="text-center order-2 md:order-1">
            <img
              src={team1.logo}
              alt={team1.name}
              className="h-24 w-24 mx-auto mb-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111827] p-3 shadow-sm"
            />
            <p className="text-lg font-black">{team1.name}</p>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <StatCompare
              label="Average Rank"
              val1={team1.avgRank}
              val2={team2.avgRank}
              inverse
            />
            <StatCompare
              label="Total Titles"
              val1={team1.trophies}
              val2={team2.trophies}
            />
            <StatCompare
              label="Win Rate"
              val1={team1.winRate}
              val2={team2.winRate}
              suffix="%"
            />
          </div>

          <div className="text-center order-3">
            <img
              src={team2.logo}
              alt={team2.name}
              className="h-24 w-24 mx-auto mb-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111827] p-3 shadow-sm"
            />
            <p className="text-lg font-black">{team2.name}</p>
          </div>
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

const StatCompare = ({ label, val1, val2, inverse = false, suffix = "" }) => {
  const v1 = parseFloat(val1) || 0;
  const v2 = parseFloat(val2) || 0;

  const win1 = inverse ? v1 < v2 : v1 > v2;
  const win2 = inverse ? v2 < v1 : v2 > v1;

  return (
    <div className="text-center">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-widest">
        {label}
      </p>

      <div className="flex justify-between items-center bg-slate-50 dark:bg-black/20 p-3 rounded-2xl border border-black/10 dark:border-white/10">
        <span
          className={`font-black ${
            win1
              ? "text-blue-600 dark:text-blue-500 text-lg"
              : "text-slate-500 dark:text-slate-500"
          }`}
        >
          {val1}
          {suffix}
        </span>

        <div className="h-1 flex-1 mx-4 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-700 ${
              win1 ? "bg-blue-600 dark:bg-blue-500 w-full" : "bg-slate-300 dark:bg-slate-700 w-1/3"
            }`}
          />
        </div>

        <span
          className={`font-black ${
            win2
              ? "text-blue-600 dark:text-blue-500 text-lg"
              : "text-slate-500 dark:text-slate-500"
          }`}
        >
          {val2}
          {suffix}
        </span>
      </div>
    </div>
  );
};
