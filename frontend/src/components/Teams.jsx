import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  BarChart2,
  X,
  Trophy,
  Check,
  ArrowUpDown,
  Shield,
  Users,
  ChevronRight
} from "lucide-react";
import axios from "../api/axios";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  /* ---------------- LOAD TEAMS ---------------- */

  useEffect(() => {
    axios.get("/api/v1/cricket/teams")
      .then(res => setTeams(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- SORT + FILTER ---------------- */

  const sortedTeams = useMemo(() => {
    let list = [...teams].filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "trophies") {
      list.sort((a, b) => b.trophies - a.trophies);
    }
    else if (sortBy === "rank") {
      list.sort((a, b) => a.avgRank - b.avgRank);
    }
    else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [teams, searchTerm, sortBy]);

  /* ---------------- COMPARE ---------------- */

  const toggleTeamSelection = (id) => {
    if (selectedTeams.includes(id)) {
      setSelectedTeams(selectedTeams.filter(t => t !== id));
    }
    else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, id]);
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-slate-400 font-bold">Loading Teams...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto">

        {/* ---------- HEADER ---------- */}
        <header className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">ICC Teams</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
              World <span className="text-blue-600">Teams</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search team..."
                className="pl-10 pr-4 py-2 rounded-xl border bg-white dark:bg-slate-800"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => { setCompareMode(!compareMode); setSelectedTeams([]); }}
              className={`px-6 py-2 rounded-xl font-bold ${compareMode ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 border"}`}
            >
              <BarChart2 className="inline w-4 h-4 mr-2" />
              Compare
            </button>
          </div>
        </header>

        {/* ---------- SORT ---------- */}
        <div className="flex gap-2 mb-8">
          {["rank", "trophies", "name"].map(type => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${sortBy === type ? "bg-slate-900 text-white" : "bg-white dark:bg-slate-800"}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* ---------- GRID ---------- */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {sortedTeams.map(team => (
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

        {/* ---------- COMPARE BAR ---------- */}
        {compareMode && selectedTeams.length > 0 && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center">
            <div className="bg-slate-900 text-white px-6 py-3 rounded-xl flex gap-4">
              <span>{selectedTeams.length} / 2 selected</span>
              <button
                disabled={selectedTeams.length !== 2}
                onClick={() => setShowCompareModal(true)}
                className="bg-white text-blue-600 px-4 py-1 rounded"
              >
                Compare
              </button>
            </div>
          </div>
        )}

        {showCompareModal && (
          <ComparisonModal
            team1={teams.find(t => t.id === selectedTeams[0])}
            team2={teams.find(t => t.id === selectedTeams[1])}
            onClose={() => setShowCompareModal(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- TEAM CARD ---------- */

const TeamCard = ({ team, compareMode, isSelected, onSelect }) => (
  <motion.div layout className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow hover:shadow-lg relative">
    {compareMode && (
      <div onClick={onSelect} className={`absolute top-4 right-4 w-5 h-5 rounded-full border ${isSelected ? "bg-blue-600" : ""}`} />
    )}

    <img src={team.logo} className="h-14 mb-4" />

    <h3 className="font-bold text-lg">{team.name}</h3>
    <p className="text-sm text-slate-400 flex items-center gap-1"><Users size={12} /> {team.captain}</p>

    <div className="flex justify-between mt-4">
      <span>🏆 {team.trophies}</span>
      {!compareMode && <Link to={`/teams/${team.id}`} className="text-blue-600">Profile →</Link>}
    </div>
  </motion.div>
);

/* ---------- COMPARISON MODAL ---------- */

const ComparisonModal = ({ team1, team2, onClose }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl max-w-3xl w-full">
      <h3 className="text-xl font-bold mb-6">Team Comparison</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <img src={team1.logo} className="h-20 mx-auto" />
          <p className="font-black">{team1.name}</p>
          <p>Rank Avg: {team1.avgRank}</p>
        </div>

        <div className="text-center">
          <img src={team2.logo} className="h-20 mx-auto" />
          <p className="font-black">{team2.name}</p>
          <p>Rank Avg: {team2.avgRank}</p>
        </div>
      </div>

      <button onClick={onClose} className="mt-8 bg-blue-600 text-white px-6 py-2 rounded">Close</button>
    </div>
  </div>
);
