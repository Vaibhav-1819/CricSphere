import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Users, ChevronLeft, ChevronRight,
  Activity, Star, Shield, Zap, TrendingUp
} from "lucide-react";
import axios from "../api/axios";

export default function TeamDetails() {
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState("All");
  const [team, setTeam] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios.get(`/api/v1/cricket/team/${teamId}`)
      .then(res => setTeam(res.data))
      .finally(() => setLoading(false));
  }, [teamId]);

  const filteredSquad = useMemo(() => {
    if (!team?.squad) return [];
    if (activeTab === "All") return team.squad;

    const map = {
      "Batters": "Bat",
      "Bowlers": "Bowl",
      "All-Rounders": "All"
    };
    return team.squad.filter(p => p.role.includes(map[activeTab]));
  }, [team, activeTab]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-slate-500">Loading team…</div>;
  if (!team) return <div className="h-screen bg-black flex items-center justify-center">Team not found</div>;

  const totalTrophies = team.trophyCabinet?.reduce((a, b) => a + b.count, 0) || 0;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200">

      {/* HERO */}
      <div className="relative h-[420px] border-b border-white/5 flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute right-0 top-0 w-[500px] opacity-5">
          <img src={team.logo} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
          <Link to="/teams" className="text-slate-500 flex items-center gap-2 text-xs uppercase mb-8">
            <ChevronLeft size={14}/> Back
          </Link>

          <div className="flex gap-8 items-end">
            <div className="w-44 h-44 bg-white/10 rounded-3xl p-6 border border-white/10">
              <img src={team.logo} className="w-full h-full object-contain"/>
            </div>

            <div>
              <h1 className="text-7xl font-black italic uppercase">{team.name}</h1>
              <div className="flex gap-6 text-xs text-slate-500 mt-4">
                <span><Users size={14}/> Captain {team.captain}</span>
                <span><Activity size={14}/> Coach {team.coach}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 grid grid-cols-12 gap-8">

        {/* LEFT */}
        <div className="col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Stat icon={Trophy} label="Titles" value={totalTrophies}/>
            <Stat icon={TrendingUp} label="T20 Rank" value={`#${team.rankings?.t20}`}/>
          </div>

          <div className="bg-[#111118] p-6 rounded-2xl border border-white/5">
            <Shield className="text-blue-500 mb-3"/>
            <p className="text-sm text-slate-400">{team.overview}</p>
          </div>
        </div>

        {/* SQUAD */}
        <div className="col-span-8 bg-[#111118] rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between">
            <h2 className="font-black uppercase">Squad</h2>
            <div className="flex bg-black/40 p-1 rounded-xl">
              {["All","Batters","Bowlers","All-Rounders"].map(t => (
                <button key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-xs font-black ${activeTab===t?"bg-blue-600":"text-slate-500"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-3">
            {filteredSquad.map(p => (
              <div key={p.name} className="bg-white/5 p-4 rounded-xl flex justify-between">
                <span className="font-bold">{p.name}</span>
                <span className="text-xs text-slate-500">{p.role}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const Stat = ({ icon:Icon, label, value }) => (
  <div className="bg-[#111118] p-6 rounded-2xl border border-white/5 text-center">
    <Icon className="text-blue-500 mb-2"/>
    <div className="text-2xl font-black">{value}</div>
    <div className="text-xs text-slate-500 uppercase">{label}</div>
  </div>
);
