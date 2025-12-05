import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Calendar, MapPin, ChevronLeft, 
  Activity, Star, Shield, Target, Zap 
} from 'lucide-react';
import { TEAMS_DATA } from '../data/teamsData';

// --- Utility Components ---

const StatBadge = ({ label, value, icon: Icon, color = "text-white" }) => (
  <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
    <Icon className={`w-6 h-6 mb-2 ${color}`} />
    <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
  </div>
);

const RoleBadge = ({ role }) => {
  let color = "bg-slate-500";
  let Icon = Users;

  if (role.includes('Bat')) { color = "bg-blue-500"; Icon = Target; }
  else if (role.includes('Bowl')) { color = "bg-red-500"; Icon = Zap; }
  else if (role.includes('All')) { color = "bg-purple-500"; Icon = Activity; }
  else if (role.includes('Keep')) { color = "bg-yellow-500"; Icon = Shield; }

  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md text-white/90 ${color}/20 border ${color}/30 border-opacity-50 text-${color}-300`}>
      <Icon size={10} /> {role}
    </span>
  );
};

// --- Main Component ---

const TeamDetails = () => {
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState('All');
  
  const team = TEAMS_DATA.find(t => t.id === teamId);

  // Filter Logic for Squad
  const filteredSquad = useMemo(() => {
    if (!team) return [];
    if (activeTab === 'All') return team.squad;
    return team.squad.filter(p => {
      if (activeTab === 'Batters') return p.role.includes('Bat');
      if (activeTab === 'Bowlers') return p.role.includes('Bowl');
      if (activeTab === 'All-Rounders') return p.role.includes('All');
      if (activeTab === 'Wicket Keepers') return p.role.includes('Keep');
      return false;
    });
  }, [team, activeTab]);

  if (!team) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Team not found</div>;

  const totalTrophies = team.trophyCabinet ? team.trophyCabinet.reduce((acc, curr) => acc + curr.count, 0) : 0;
  
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* --- 1. IMMERSIVE HERO SECTION --- */}
      <div className="relative w-full min-h-[500px] flex flex-col justify-end overflow-hidden">
        {/* Dynamic Background Mesh */}
        <div className={`absolute inset-0 bg-gradient-to-b ${team.color.replace('bg-', 'from-')}/40 via-[#050507]/90 to-[#050507] z-0`} />
        
        {/* Giant Blurred Logo Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none">
             
             <img src={team.logo} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 pb-12">
            <Link to="/teams" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-medium">Back to Roster</span>
            </Link>

            <div className="flex flex-col md:flex-row items-end gap-8">
                {/* Logo Card */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-2xl shadow-black/50"
                >
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain drop-shadow-lg" />
                </motion.div>

                {/* Text Info */}
                <div className="flex-1 mb-2">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-4"
                    >
                        {team.name}
                    </motion.h1>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base font-medium text-slate-400"
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-indigo-400" />
                            <span>Captain: <span className="text-white">{team.captain}</span></span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-600 self-center" />
                        <div className="flex items-center gap-2">
                            <Activity size={18} className="text-emerald-400" />
                            <span>Coach: <span className="text-white">{team.coach}</span></span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
      </div>

      {/* --- 2. STATS & INFO GRID --- */}
      <div className="container mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Stats & Info (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 gap-4">
                    <StatBadge icon={Trophy} value={totalTrophies} label="Titles" color="text-amber-400" />
                    <StatBadge icon={Star} value={`#${team.rankings?.t20 || '-'}`} label="Ranking" color="text-indigo-400" />
                </div>

                {/* About Card */}
                <div className="bg-[#12121a] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-slate-400" /> 
                        Team Profile
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        {team.overview}
                    </p>
                </div>

                {/* Trophy Cabinet (Redesigned) */}
                {totalTrophies > 0 && (
                     <div className="bg-gradient-to-br from-amber-900/20 to-[#12121a] rounded-3xl p-1 border border-amber-500/20 overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            

[Image of Golden Trophy Icon]

                            <Trophy size={120} />
                         </div>
                         <div className="p-7 relative z-10">
                            <h3 className="text-lg font-bold text-amber-100 mb-6 flex items-center gap-2">
                                <Trophy size={18} className="text-amber-400" /> Trophy Cabinet
                            </h3>
                            <div className="space-y-4">
                                {team.trophyCabinet.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div>
                                            <div className="text-white font-bold">{t.name}</div>
                                            <div className="text-xs text-amber-500/80 font-mono mt-1">
                                                {t.years.join(", ")}
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                            {t.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                     </div>
                )}
            </div>

            {/* Right Column: Squad (8 cols) */}
            <div className="lg:col-span-8">
                <div className="bg-[#12121a] rounded-3xl border border-white/5 overflow-hidden min-h-[600px]">
                    
                    {/* Header & Tabs */}
                    <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Active Squad <span className="bg-white/10 text-xs px-2 py-1 rounded-md text-slate-300">{team.squad ? team.squad.length : 0}</span>
                        </h2>
                        
                        {/* Tab Switcher */}
                        <div className="flex gap-1 p-1 bg-black/40 rounded-xl overflow-x-auto max-w-full">
                            {['All', 'Batters', 'Bowlers', 'All-Rounders'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                        activeTab === tab 
                                        ? 'bg-white/10 text-white shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Squad Grid */}
                    <div className="p-6">
                        <motion.div 
                            variants={containerVars}
                            initial="hidden"
                            animate="visible"
                            key={activeTab} // Force re-render on tab change for animation
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredSquad.map((player, idx) => (
                                    <motion.div
                                        key={player.name || idx}
                                        variants={itemVars}
                                        layout
                                        className="group relative bg-[#1a1b24] hover:bg-[#22232e] p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex items-center gap-4"
                                    >
                                        {/* Player Avatar Placeholder */}
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-inner bg-gradient-to-br ${team.color}`}>
                                            {player.name.charAt(0)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                                    {player.name}
                                                </h4>
                                                {player.type.includes('Captain') && (
                                                    <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">C</span>
                                                )}
                                            </div>
                                            
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <RoleBadge role={player.role} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {filteredSquad.length === 0 && (
                                <div className="col-span-full py-10 text-center text-slate-500">
                                    No players found for this category.
                                </div>
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
      </div>
      
      {/* Decorative Footer Spacer */}
      <div className="h-20" />
    </div>
  );
};

export default TeamDetails;