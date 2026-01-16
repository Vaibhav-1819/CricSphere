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
      <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Syncing Team Database
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#080a0f] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 🟢 HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                <Shield size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                ICC Global Directory
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              World <span className="text-blue-500">Teams</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Filter nations..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/5 bg-[#111827] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedTeams([]);
              }}
              className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                compareMode
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                  : "bg-white/5 border border-white/5 text-slate-400"
              }`}
            >
              <BarChart2 className="inline w-4 h-4 mr-2" />
              {compareMode ? "Cancel Mode" : "Compare Mode"}
            </button>
          </div>
        </header>

        {/* 🔵 SORT BAR */}
        <div className="flex bg-[#111827] p-1.5 rounded-2xl border border-white/5 w-fit mb-10">
          {["rank", "trophies", "name"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                sortBy === type
                  ? "bg-white text-black"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 🟠 TEAM GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-10 left-0 right-0 z-50 flex justify-center px-4"
            >
              <div className="bg-[#111827] border border-blue-500/30 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 backdrop-blur-xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-blue-500">
                    Battle Selection
                  </span>
                  <span className="text-sm font-bold">
                    {selectedTeams.length} / 2 Selected
                  </span>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <button
                  disabled={selectedTeams.length !== 2}
                  onClick={() => setShowCompareModal(true)}
                  className={`px-8 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    selectedTeams.length === 2
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  Start Analysis
                </button>

                <button
                  onClick={() => {
                    setCompareMode(false);
                    setSelectedTeams([]);
                  }}
                  className="text-slate-500 hover:text-red-500 transition-colors"
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
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={
      !compareMode ? { y: -8, borderColor: "rgba(59, 130, 246, 0.4)" } : {}
    }
    onClick={compareMode ? onSelect : undefined}
    className={`relative bg-[#111a2e] p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
      isSelected
        ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10"
        : "border-white/5"
    }`}
  >
    {compareMode && (
      <div
        className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected ? "bg-blue-600 border-blue-600" : "border-slate-700"
        }`}
      >
        {isSelected && <Check size={14} className="text-white" />}
      </div>
    )}

    <img
      src={team.logo}
      alt={team.name}
      className="h-16 mb-8 filter drop-shadow-lg grayscale group-hover:grayscale-0 transition-all"
    />

    <h3 className="font-black text-2xl tracking-tighter uppercase italic mb-1">
      {team.name}
    </h3>

    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-6">
      <Users size={12} className="text-blue-500" /> {team.captain || "TBA"}
    </p>

    <div className="flex justify-between items-center pt-6 border-t border-white/5">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-600 uppercase">
          Titles
        </span>
        <span className="font-black text-amber-500">🏆 {team.trophies || 0}</span>
      </div>

      {!compareMode && (
        <Link
          to={`/teams/${team.id}`}
          className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 transition-colors group"
        >
          <ChevronRight size={18} className="group-hover:text-white" />
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
      className="fixed inset-0 bg-[#080a0f]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#111a2e] border border-white/5 p-10 rounded-[3rem] max-w-4xl w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-12 text-center">
          Head-to-Head <span className="text-blue-500">Analysis</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          <div className="text-center order-2 md:order-1">
            <img src={team1.logo} alt={team1.name} className="h-28 mx-auto mb-4" />
            <p className="text-xl font-black uppercase italic">{team1.name}</p>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <StatCompare label="Average Rank" val1={team1.avgRank} val2={team2.avgRank} inverse />
            <StatCompare label="Total Titles" val1={team1.trophies} val2={team2.trophies} />
            <StatCompare label="Win Rate" val1={team1.winRate} val2={team2.winRate} suffix="%" />
          </div>

          <div className="text-center order-3">
            <img src={team2.logo} alt={team2.name} className="h-28 mx-auto mb-4" />
            <p className="text-xl font-black uppercase italic">{team2.name}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="px-12 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
          >
            Dismiss Analysis
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
      <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">
        {label}
      </p>

      <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
        <span className={`font-black ${win1 ? "text-blue-500 text-lg" : "text-slate-500"}`}>
          {val1}
          {suffix}
        </span>

        <div className="h-1 flex-1 mx-4 bg-white/5 rounded-full overflow-hidden flex">
          <div className={`h-full transition-all duration-700 ${win1 ? "bg-blue-500 w-full" : "bg-slate-700 w-1/3"}`} />
        </div>

        <span className={`font-black ${win2 ? "text-blue-500 text-lg" : "text-slate-500"}`}>
          {val2}
          {suffix}
        </span>
      </div>
    </div>
  );
};
