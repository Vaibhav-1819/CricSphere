import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
// Added ChevronRight and other necessary icons to the import
import { 
  Search, ChevronDown, BarChart2, X, Trophy, 
  Check, ArrowUpDown, Shield, Users, ChevronRight 
} from 'lucide-react';
import { TEAMS_DATA } from '../data/teamsData';

const Teams = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('rank');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);
    
    const dropdownRef = useRef(null);

    // --- SORTING LOGIC ---
    const sortedTeams = useMemo(() => {
        let teams = [...TEAMS_DATA].filter(team => 
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.code.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === 'trophies') {
            teams.sort((a, b) => {
                const countA = a.trophyCabinet?.reduce((acc, c) => acc + c.count, 0) || 0;
                const countB = b.trophyCabinet?.reduce((acc, c) => acc + c.count, 0) || 0;
                return countB - countA;
            });
        } else if (sortBy === 'rank') {
            teams.sort((a, b) => (a.rankings.test + a.rankings.odi + a.rankings.t20) - (b.rankings.test + b.rankings.odi + b.rankings.t20));
        } else {
            teams.sort((a, b) => a.name.localeCompare(b.name));
        }
        return teams;
    }, [searchTerm, sortBy]);

    const toggleTeamSelection = (id) => {
        if (selectedTeams.includes(id)) {
            setSelectedTeams(selectedTeams.filter(t => t !== id));
        } else if (selectedTeams.length < 2) {
            setSelectedTeams([...selectedTeams, id]);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 md:p-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">ICC Member Nations</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            World <span className="text-blue-600">Teams</span>
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Quick find team..."
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => {setCompareMode(!compareMode); setSelectedTeams([]);}}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                compareMode 
                                ? "bg-blue-600 text-white shadow-lg" 
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500"
                            }`}
                        >
                            <BarChart2 className="w-4 h-4" />
                            {compareMode ? "Exit Compare" : "Compare Teams"}
                        </button>
                    </div>
                </header>

                {/* --- SORT BAR --- */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" /> Sort:
                    </span>
                    {['rank', 'trophies', 'name'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSortBy(type)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                sortBy === type 
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                                : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                            }`}
                        >
                            {type === 'rank' ? 'Best Ranking' : type}
                        </button>
                    ))}
                </div>

                {/* --- GRID --- */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            </div>

            {/* --- FLOATING COMPARE BAR --- */}
            <AnimatePresence>
                {compareMode && selectedTeams.length > 0 && (
                    <motion.div 
                        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                        className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4"
                    >
                        <div className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-6 shadow-2xl border border-white/10">
                            <span className="text-sm font-bold">{selectedTeams.length} / 2 Selected</span>
                            <button 
                                disabled={selectedTeams.length < 2}
                                onClick={() => setShowCompareModal(true)}
                                className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                    selectedTeams.length === 2 
                                    ? "bg-white text-blue-600 hover:scale-105 active:scale-95" 
                                    : "bg-white/20 text-white/40 cursor-not-allowed"
                                }`}
                            >
                                Run Analysis
                            </button>
                            <button onClick={() => {setCompareMode(false); setSelectedTeams([]);}} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- COMPARISON MODAL --- */}
            <AnimatePresence>
                {showCompareModal && (
                    <ComparisonModal 
                        team1={TEAMS_DATA.find(t => t.id === selectedTeams[0])}
                        team2={TEAMS_DATA.find(t => t.id === selectedTeams[1])}
                        onClose={() => setShowCompareModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- COMPACT TEAM CARD ---
const TeamCard = ({ team, compareMode, isSelected, onSelect }) => {
    const trophyCount = team.trophyCabinet?.reduce((acc, curr) => acc + curr.count, 0) || 0;

    return (
        <motion.div
            layout
            whileHover={{ y: -5 }}
            className="group cursor-pointer h-full"
            onClick={() => compareMode && onSelect()}
        >
            <div className={`h-full bg-white dark:bg-slate-800 border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col ${
                isSelected ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md"
            }`}>
                {compareMode && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                        }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        <img src={team.logo} alt={team.code} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-2xl font-black text-slate-100 dark:text-slate-700 uppercase leading-none select-none">
                        {team.code}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                    {team.name}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mb-6 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {team.captain.split('(')[0]}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <RankBadge label="TEST" rank={team.rankings.test} color="red" />
                    <RankBadge label="ODI" rank={team.rankings.odi} color="indigo" />
                    <RankBadge label="T20" rank={team.rankings.t20} color="sky" />
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>{trophyCount} Titles</span>
                    </div>
                    {!compareMode && (
                        <Link to={`/teams/${team.id}`} className="text-blue-600 text-[11px] font-bold uppercase tracking-wider flex items-center hover:gap-1 transition-all">
                            Profile <ChevronRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const RankBadge = ({ label, rank, color }) => {
    const styles = {
        sky: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
        red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
    };

    return (
        <div className={`flex flex-col items-center py-2 rounded-xl border ${styles[color]}`}>
            <span className="text-[9px] font-black uppercase opacity-60 mb-0.5">{label}</span>
            <span className="text-sm font-black italic">#{rank}</span>
        </div>
    );
};

// --- COMPARISON MODAL COMPONENT ---
const ComparisonModal = ({ team1, team2, onClose }) => {
    const getTotal = (t) => (t.rankings.test + t.rankings.odi + t.rankings.t20) / 3;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-xl font-black dark:text-white">Head-to-Head Comparison</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 dark:text-white" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                            <img src={team1.logo} className="h-16 mx-auto mb-2 object-contain" alt="" />
                            <p className="font-black text-blue-600">{team1.code}</p>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                            <img src={team2.logo} className="h-16 mx-auto mb-2 object-contain" alt="" />
                            <p className="font-black text-blue-600">{team2.code}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ComparisonRow label="Test Ranking" val1={team1.rankings.test} val2={team2.rankings.test} inverse />
                        <ComparisonRow label="ODI Ranking" val1={team1.rankings.odi} val2={team2.rankings.odi} inverse />
                        <ComparisonRow label="T20 Ranking" val1={team1.rankings.t20} val2={team2.rankings.t20} inverse />
                        <ComparisonRow label="Avg. Ranking" val1={getTotal(team1).toFixed(1)} val2={getTotal(team2).toFixed(1)} inverse />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ComparisonRow = ({ label, val1, val2, inverse }) => {
    const is1Better = inverse ? parseFloat(val1) < parseFloat(val2) : parseFloat(val1) > parseFloat(val2);
    const isTie = val1 === val2;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 px-1">
                <span className={is1Better ? "text-blue-600" : ""}>{val1}</span>
                <span>{label}</span>
                <span className={(!is1Better && !isTie) ? "text-blue-600" : ""}>{val2}</span>
            </div>
            <div className="flex h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${is1Better ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`} style={{ width: '50%' }} />
                <div className="w-1 bg-white dark:bg-slate-800" />
                <div className={`h-full transition-all duration-1000 ${(!is1Better && !isTie) ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`} style={{ width: '50%' }} />
            </div>
        </div>
    );
};

export default Teams;