import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// --- FIXED: Added ChevronRight to the imports ---
import { 
  Trophy, Users, Calendar, MapPin, ChevronLeft, 
  ChevronRight, Activity, Star, Shield, Target, Zap, TrendingUp
} from 'lucide-react';
import { TEAMS_DATA } from '../data/teamsData';

const TeamDetails = () => {
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState('All');
  
  const team = TEAMS_DATA.find(t => t.id === teamId);

  const filteredSquad = useMemo(() => {
    if (!team) return [];
    if (activeTab === 'All') return team.squad;
    const filterMap = {
      'Batters': 'Bat',
      'Bowlers': 'Bowl',
      'All-Rounders': 'All',
      'Wicket Keepers': 'Keep'
    };
    return team.squad.filter(p => p.role.includes(filterMap[activeTab]));
  }, [team, activeTab]);

  if (!team) return <NotFound />;

  const totalTrophies = team.trophyCabinet?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* --- 1. HERO BANNER --- */}
      <div className="relative w-full h-[380px] md:h-[450px] flex flex-col justify-end overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent z-10" />
        <div className={`absolute inset-0 bg-gradient-to-br ${team.color.replace('bg-', 'from-')}/20 to-transparent z-0`} />
        
        {/* Background Visual Logo */}
        <div className="absolute top-10 right-0 w-[400px] md:w-[600px] h-full opacity-5 blur-3xl translate-x-1/4 pointer-events-none z-0">
             <img src={team.logo} alt="" className="w-full h-full object-contain" />
        </div>

        <div className="relative z-20 container mx-auto px-6 pb-12">
            <Link to="/teams" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all mb-8 group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Roster</span>
            </Link>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-white dark:bg-slate-800 p-6 shadow-2xl flex items-center justify-center border border-white/10"
                >
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain drop-shadow-2xl" />
                </motion.div>

                <div className="text-center md:text-left">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6 uppercase italic"
                    >
                        {team.name}
                    </motion.h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span className="flex items-center gap-2 border-r border-white/10 pr-6"><Users size={14} className="text-blue-500" /> Captain: {team.captain}</span>
                        <span className="flex items-center gap-2"><Activity size={14} className="text-emerald-500" /> Coach: {team.coach}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN: TEAM TELEMETRY (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <TelemetryTile icon={Trophy} val={totalTrophies} label="Titles" color="text-amber-500" />
                    <TelemetryTile icon={TrendingUp} val={`#${team.rankings?.t20 || '1'}`} label="T20 Rank" color="text-blue-400" />
                </div>

                <div className="bg-[#111118] rounded-[2rem] p-8 border border-white/5">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-slate-500">
                        <Shield size={14} /> Intelligence Overview
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {team.overview}
                    </p>
                </div>

                {totalTrophies > 0 && (
                    <div className="bg-gradient-to-br from-amber-600/5 to-transparent rounded-[2rem] p-8 border border-amber-500/10">
                        <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Star size={14} /> Trophy Cabinet
                        </h3>
                        <div className="space-y-4">
                            {team.trophyCabinet.map((t, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div>
                                        <div className="text-xs font-black text-slate-100 uppercase">{t.name}</div>
                                        <div className="text-[9px] text-amber-500/50 font-bold mt-0.5">{t.years.join(", ")}</div>
                                    </div>
                                    <div className="text-sm font-black text-amber-500">x{t.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* COLUMN: SQUAD DATA (8 cols) */}
            <div className="lg:col-span-8">
                <div className="bg-[#111118]/80 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                            Squad Roster
                        </h2>
                        
                        <div className="flex bg-black/40 p-1 rounded-xl">
                            {['All', 'Batters', 'Bowlers', 'All-Rounders'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                                        activeTab === tab 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <AnimatePresence mode='popLayout'>
                                {filteredSquad.map((player) => (
                                    <PlayerCard key={player.name} player={player} color={team.color} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: PLAYER CARD ---
const PlayerCard = ({ player, color }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group bg-white/5 hover:bg-white/[0.08] p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 flex items-center gap-4"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-white bg-gradient-to-br ${color} shadow-lg transition-transform group-hover:rotate-3`}>
            {player.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                {player.name}
            </h4>
            <div className="mt-1 flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{player.role}</span>
                {player.type?.includes('Captain') && <Zap size={10} className="text-amber-500 fill-amber-500" />}
            </div>
        </div>
        <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
    </motion.div>
);

// --- COMPONENT: TELEMETRY TILE ---
const TelemetryTile = ({ icon: Icon, val, label, color }) => (
    <div className="bg-[#111118] rounded-[2rem] p-6 border border-white/5 flex flex-col items-center group hover:border-white/10 transition-colors">
        <div className={`p-3 rounded-2xl bg-white/5 mb-3 group-hover:scale-110 transition-transform ${color}`}><Icon size={20} /></div>
        <span className="text-2xl font-black text-white tracking-tighter leading-none">{val}</span>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">{label}</span>
    </div>
);

const NotFound = () => <div className="h-screen bg-black flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest">Team Telemetry Lost</div>;

export default TeamDetails;