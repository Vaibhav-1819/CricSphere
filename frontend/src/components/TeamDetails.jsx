import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Users, ChevronLeft, Activity, 
  Shield, Zap, TrendingUp, Search
} from "lucide-react";
import axios from "../services/api";
export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/v1/cricket/team/${teamId}`)
      .then(res => setTeam(res.data))
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [teamId]);

  const filteredSquad = useMemo(() => {
    if (!team?.squad) return [];
    
    let list = team.squad;
    
    // Filter by Role
    if (activeTab !== "All") {
      const map = {
        "Batters": "Bat",
        "Bowlers": "Bowl",
        "All-Rounders": "All"
      };
      list = list.filter(p => p.role.includes(map[activeTab]));
    }

    // Filter by Search
    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return list;
  }, [team, activeTab, searchQuery]);

  if (loading) return (
    <div className="h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (!team) return (
    <div className="h-screen bg-[#050507] flex flex-col items-center justify-center gap-4">
      <p className="text-slate-500 font-black uppercase tracking-widest">Digital ID not found</p>
      <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white text-black text-xs font-black rounded-lg uppercase">Go Back</button>
    </div>
  );

  const totalTrophies = team.trophyCabinet?.reduce((a, b) => a + b.count, 0) || 0;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-20">

      {/* 🟢 HERO IDENTITY */}
      <div className="relative h-[480px] border-b border-white/5 flex items-end overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent z-10" />
        <div className="absolute right-[-5%] top-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Large Faded Logo */}
        <motion.img 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          src={team.logo} 
          className="absolute right-10 top-10 w-[450px] pointer-events-none z-0 grayscale"
        />

        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-16">
          <button onClick={() => navigate(-1)} className="group text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-12 transition-all">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Arena
          </button>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-48 h-48 bg-[#111118] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl flex items-center justify-center"
            >
              <img src={team.logo} alt={team.name} className="w-full h-full object-contain filter drop-shadow-2xl"/>
            </motion.div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Official Franchise</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><MapPin size={12}/> {team.location}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{team.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 mt-6">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5"><Users size={14} className="text-blue-500"/> Capt. {team.captain}</span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5"><Activity size={14} className="text-emerald-500"/> Coach {team.coach}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-30">

        {/* LEFT: INTEL & STATS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Trophy} label="Major Titles" value={totalTrophies} color="text-amber-500"/>
            <StatCard icon={TrendingUp} label="Current Rank" value={`#${team.rankings?.t20}`} color="text-blue-500"/>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#111118] p-8 rounded-[2rem] border border-white/5 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
               <Shield className="text-blue-500" size={20}/>
               <h3 className="text-xs font-black uppercase tracking-widest">Franchise Overview</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">{team.overview}</p>
          </motion.div>
        </div>

        {/* RIGHT: SQUAD ENGINE */}
        <div className="lg:col-span-8 bg-[#111118] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02]">
            <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
              <Zap size={20} className="text-blue-600 fill-blue-600"/> Current Squad
            </h2>
            
            <div className="flex flex-wrap bg-black/40 p-1.5 rounded-2xl border border-white/5">
              {["All","Batters","Bowlers","All-Rounders"].map(t => (
                <button key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab===t ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SQUAD SEARCH */}
          <div className="px-8 py-4 border-b border-white/5 relative">
            <Search size={14} className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-600"/>
            <input 
              type="text"
              placeholder="Filter by player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <AnimatePresence mode="popLayout">
              {filteredSquad.map((p, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  key={p.name} 
                  className="bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-blue-600/5 hover:border-blue-600/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-tight">{p.name}</div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{p.role}</div>
                    </div>
                  </div>
                  {p.isInternational && <Zap size={12} className="text-amber-500 fill-amber-500"/>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

const StatCard = ({ icon:Icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#111118] p-8 rounded-[2rem] border border-white/5 text-center shadow-xl group"
  >
    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
       <Icon className={color} size={22}/>
    </div>
    <div className="text-3xl font-black tracking-tighter mb-1">{value}</div>
    <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{label}</div>
  </motion.div>
);