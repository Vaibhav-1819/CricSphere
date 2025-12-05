import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, BarChart2, X, Trophy, Minus, Check } from 'lucide-react';
import { TEAMS_DATA } from '../data/teamsData';

// --- UTILITY: Get Trophy Count ---
const getTrophyCount = (team) => {
  if (team.trophyCabinet) {
    return team.trophyCabinet.reduce((acc, curr) => acc + curr.count, 0);
  }
  return 0;
};

const Teams = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]); 
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  const dropdownRef = useRef(null);

  // --- CLICK OUTSIDE HANDLER ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FILTERING & SORTING LOGIC ---
  const processedTeams = useMemo(() => {
    let teams = [...TEAMS_DATA].filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'trophies') {
      teams.sort((a, b) => getTrophyCount(b) - getTrophyCount(a));
    } else if (sortBy === 'rank') {
      teams.sort((a, b) => {
        const avgA = (a.rankings.test + a.rankings.odi + a.rankings.t20) / 3;
        const avgB = (b.rankings.test + b.rankings.odi + b.rankings.t20) / 3;
        return avgA - avgB;
      });
    } else if (sortBy === 'name') {
      teams.sort((a, b) => a.name.localeCompare(b.name));
    }
    return teams;
  }, [searchTerm, sortBy]);

  // --- HANDLERS ---
  const toggleTeamSelection = (id) => {
    if (selectedTeams.includes(id)) {
      setSelectedTeams(selectedTeams.filter(t => t !== id));
    } else {
      if (selectedTeams.length < 2) setSelectedTeams([...selectedTeams, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-indigo-500/30 pb-32">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        
        {/* --- HERO HEADER --- */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4"
          >
            World Teams
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl"
          >
            Access detailed telemetry, historical archives, and performance metrics for all ICC member nations.
          </motion.p>
        </div>

        {/* --- COMMAND BAR (Glassmorphic) --- */}
        <div className="sticky top-6 z-40 mb-12">
          <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl shadow-black/50">
            
            {/* Search */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by team name or code..."
                className="block w-full pl-11 pr-4 py-3 bg-transparent border border-transparent rounded-xl text-white placeholder-slate-500 focus:bg-white/5 focus:border-white/10 focus:outline-none transition-all"
              />
            </div>

            <div className="h-px md:h-12 md:w-px bg-white/10 mx-2" />

            {/* Sort Dropdown */}
            <div className="relative min-w-[200px]" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex flex-col items-start text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Sort Order</span>
                  <span className="text-white font-medium text-sm">
                    {sortBy === 'rank' ? 'Ranking' : sortBy === 'trophies' ? 'Trophy Cabinet' : 'Alphabetical'}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-full bg-[#1a1b23] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {[
                      { label: 'Best Ranking', value: 'rank' },
                      { label: 'Most Trophies', value: 'trophies' },
                      { label: 'Alphabetical', value: 'name' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 flex items-center justify-between ${sortBy === opt.value ? 'text-indigo-400 bg-white/5' : 'text-slate-300'}`}
                      >
                        {opt.label}
                        {sortBy === opt.value && <Check size={14} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Compare Toggle */}
            <button
              onClick={() => { setCompareMode(!compareMode); setSelectedTeams([]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${
                compareMode 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart2 size={18} />
              <span className="hidden md:inline">{compareMode ? 'Exit Compare' : 'Compare'}</span>
            </button>

          </div>
        </div>

        {/* --- TEAMS GRID --- */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {processedTeams.map((team, index) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                index={index}
                compareMode={compareMode}
                isSelected={selectedTeams.includes(team.id)}
                isDimmed={compareMode && selectedTeams.length >= 2 && !selectedTeams.includes(team.id)}
                onSelect={() => toggleTeamSelection(team.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- FLOATING ACTION BAR (Compare Mode) --- */}
        <AnimatePresence>
          {compareMode && selectedTeams.length > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4"
            >
              <div className="bg-[#0f1014]/90 backdrop-blur-xl border border-white/20 p-2 pl-6 rounded-full flex items-center gap-6 shadow-2xl">
                <div className="text-sm font-medium text-slate-300">
                  <span className="text-white font-bold">{selectedTeams.length}</span> / 2 Selected
                </div>
                
                <div className="h-6 w-px bg-white/10" />

                <button 
                  disabled={selectedTeams.length !== 2}
                  onClick={() => setShowCompareModal(true)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                    selectedTeams.length === 2 
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Run Comparison
                </button>
                
                <button 
                  onClick={() => { setCompareMode(false); setSelectedTeams([]); }}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- COMPARISON MODAL --- */}
        <AnimatePresence>
          {showCompareModal && selectedTeams.length === 2 && (
            <ComparisonModal 
              team1={TEAMS_DATA.find(t => t.id === selectedTeams[0])}
              team2={TEAMS_DATA.find(t => t.id === selectedTeams[1])}
              onClose={() => setShowCompareModal(false)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// --- SUB-COMPONENT: TEAM CARD ---
const TeamCard = ({ team, index, compareMode, isSelected, isDimmed, onSelect }) => {
  const trophyCount = getTrophyCount(team);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        scale: isSelected ? 0.98 : 1,
        filter: isDimmed ? 'grayscale(100%)' : 'grayscale(0%)'
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => compareMode && !isDimmed && onSelect()}
      className={`relative group h-full rounded-3xl overflow-hidden border transition-all duration-300 ${
        isSelected 
        ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-[#16171f]' 
        : 'border-white/5 bg-[#12121a] hover:border-white/10 hover:shadow-2xl hover:shadow-black/50'
      } ${compareMode && !isDimmed ? 'cursor-pointer' : ''}`}
    >
      {/* Dynamic Glow Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${team.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Content Wrapper */}
      <Wrapper link={!compareMode ? `/teams/${team.id}` : null}>
        <div className="p-6 relative z-10 flex flex-col h-full">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center">
              <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white/10 group-hover:text-white/20 transition-colors">{team.code}</div>
              {compareMode && (
                <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">{team.name}</h3>
            <p className="text-sm text-slate-500 font-medium">C: {team.captain.split('(')[0]}</p>
          </div>

          {/* Rankings Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {['TEST', 'ODI', 'T20'].map(fmt => (
              <div key={fmt} className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                <div className="text-[10px] text-slate-500 font-bold mb-1">{fmt}</div>
                <div className={`text-lg font-bold ${team.rankings[fmt.toLowerCase()] === 1 ? 'text-emerald-400' : 'text-white'}`}>
                  {team.rankings[fmt.toLowerCase()]}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Trophy size={16} className="text-amber-500" />
              <span>{trophyCount} Titles</span>
            </div>
            {!compareMode && (
              <div className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                View Profile →
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
};

// --- SUB-COMPONENT: COMPARISON MODAL ---
const ComparisonModal = ({ team1, team2, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative z-10 w-full max-w-4xl bg-[#13141a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header: Face Off */}
        <div className="relative h-40 bg-[#0f1014] flex items-center justify-between px-8 md:px-16 border-b border-white/5">
           {/* Background Flares */}
           <div className={`absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r ${team1.color} opacity-10 blur-3xl`} />
           <div className={`absolute top-0 bottom-0 right-0 w-1/3 bg-gradient-to-l ${team2.color} opacity-10 blur-3xl`} />
           
           <TeamHeader team={team1} align="left" />
           
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-12 h-12 bg-[#1a1b23] rounded-full border border-white/10 flex items-center justify-center text-slate-500 font-black italic shadow-xl z-20">VS</div>
             <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent z-10" />
           </div>

           <TeamHeader team={team2} align="right" />
           
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Body: Tale of the Tape */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
            
            {/* 1. Rankings Comparison (Diverging Bars) */}
            <Section title="ICC Rankings (Lower is Better)">
                <StatRow label="Test Rank" val1={team1.rankings.test} val2={team2.rankings.test} inverse />
                <StatRow label="ODI Rank" val1={team1.rankings.odi} val2={team2.rankings.odi} inverse />
                <StatRow label="T20 Rank" val1={team1.rankings.t20} val2={team2.rankings.t20} inverse />
            </Section>

            {/* 2. Trophy Comparison */}
            <Section title="Trophy Cabinet">
                <StatRow label="Total Titles" val1={getTrophyCount(team1)} val2={getTrophyCount(team2)} />
            </Section>

            {/* 3. Metadata */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Captain</div>
                    <div className="text-white font-medium">{team1.captain.split('(')[0]}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Captain</div>
                    <div className="text-white font-medium">{team2.captain.split('(')[0]}</div>
                </div>
            </div>

        </div>
      </motion.div>
    </div>
  );
};

// Helper components for Modal
const TeamHeader = ({ team, align }) => (
    <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} relative z-10`}>
        <div className="w-16 h-16 bg-white p-2 rounded-xl shadow-lg mb-3">
            <img src={team.logo} className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-black text-white leading-none">{team.code}</h2>
        <p className="text-sm text-slate-500 font-medium truncate max-w-[120px]">{team.name}</p>
    </div>
);

const Section = ({ title, children }) => (
    <div className="bg-[#16171f] rounded-2xl p-6 border border-white/5">
        <h3 className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{title}</h3>
        <div className="space-y-5">{children}</div>
    </div>
);

const StatRow = ({ label, val1, val2, inverse = false }) => {
    // Logic: If inverse (rank), lower is better. Otherwise higher is better.
    const is1Better = inverse ? val1 < val2 : val1 > val2;
    const isTie = val1 === val2;

    // Calculate width percentages for visuals (simple relative math)
    const max = Math.max(val1, val2) || 1; // avoid div by 0
    // For ranks, we want smaller bars to represent better ranks visually, or simple comparison?
    // Let's stick to highlighting the number and using a fixed visual indicator.
    
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* Left Side (Team 1) */}
            <div className={`flex items-center justify-end gap-3 ${is1Better ? 'text-emerald-400' : isTie ? 'text-slate-200' : 'text-slate-500'}`}>
                {is1Better && <Check size={14} />}
                <span className="text-xl font-black">{val1}</span>
            </div>

            {/* Center Label */}
            <div className="w-32 text-center text-xs font-bold text-slate-600 uppercase bg-[#0f1014] py-1 rounded-full border border-white/5">
                {label}
            </div>

            {/* Right Side (Team 2) */}
            <div className={`flex items-center justify-start gap-3 ${!is1Better && !isTie ? 'text-emerald-400' : isTie ? 'text-slate-200' : 'text-slate-500'}`}>
                <span className="text-xl font-black">{val2}</span>
                {(!is1Better && !isTie) && <Check size={14} />}
            </div>
        </div>
    );
};

const Wrapper = ({ link, children }) => link ? <Link to={link} className="block h-full">{children}</Link> : <div className="h-full">{children}</div>;

export default Teams;