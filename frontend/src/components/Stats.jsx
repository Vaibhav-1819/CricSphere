import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// -----------------------------
// HELPER COMPONENTS
// -----------------------------

// Trend Indicator (Arrow)
const TrendArrow = ({ trend }) => {
  if (trend > 0) return <span className="text-emerald-400 text-xs font-bold flex items-center">▲ {trend}</span>;
  if (trend < 0) return <span className="text-rose-400 text-xs font-bold flex items-center">▼ {Math.abs(trend)}</span>;
  return <span className="text-slate-500 text-xs font-bold">-</span>;
};

// Mini Sparkline
const Sparkline = ({ data }) => {
  const height = 20;
  const width = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-70">
      <polyline 
        fill="none" 
        stroke={data[data.length-1] >= data[0] ? "#34d399" : "#f43f5e"} 
        strokeWidth="2" 
        points={points} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

// -----------------------------
// MOCK DATA - UPDATED DEC 1 2025
// -----------------------------

// We need enough data to demonstrate the "Top 10" limit
const TEAM_DATA = [
  // TEST TEAMS
  { id: 'tt1', format: 'TEST', rank: 1, team: 'India', matches: 34, points: 4100, rating: 121 },
  { id: 'tt2', format: 'TEST', rank: 2, team: 'Australia', matches: 30, points: 3540, rating: 118 },
  { id: 'tt3', format: 'TEST', rank: 3, team: 'England', matches: 38, points: 4180, rating: 110 },
  { id: 'tt4', format: 'TEST', rank: 4, team: 'South Africa', matches: 28, points: 2800, rating: 100 },
  { id: 'tt5', format: 'TEST', rank: 5, team: 'New Zealand', matches: 26, points: 2548, rating: 98 },
  { id: 'tt6', format: 'TEST', rank: 6, team: 'Pakistan', matches: 24, points: 2160, rating: 90 },
  { id: 'tt7', format: 'TEST', rank: 7, team: 'Sri Lanka', matches: 22, points: 1870, rating: 85 },
  { id: 'tt8', format: 'TEST', rank: 8, team: 'West Indies', matches: 20, points: 1600, rating: 80 },
  { id: 'tt9', format: 'TEST', rank: 9, team: 'Bangladesh', matches: 18, points: 1260, rating: 70 },
  { id: 'tt10', format: 'TEST', rank: 10, team: 'Ireland', matches: 12, points: 600, rating: 50 },
  { id: 'tt11', format: 'TEST', rank: 11, team: 'Zimbabwe', matches: 10, points: 450, rating: 45 }, // Should be filtered out

  // ODI TEAMS
  { id: 'to1', format: 'ODI', rank: 1, team: 'India', matches: 45, points: 5400, rating: 120 },
  { id: 'to2', format: 'ODI', rank: 2, team: 'Australia', matches: 40, points: 4600, rating: 115 },
  { id: 'to3', format: 'ODI', rank: 3, team: 'South Africa', matches: 38, points: 4180, rating: 110 },
  { id: 'to4', format: 'ODI', rank: 4, team: 'Pakistan', matches: 36, points: 3888, rating: 108 },
  { id: 'to5', format: 'ODI', rank: 5, team: 'New Zealand', matches: 35, points: 3675, rating: 105 },
  { id: 'to6', format: 'ODI', rank: 6, team: 'England', matches: 34, points: 3400, rating: 100 },
  { id: 'to7', format: 'ODI', rank: 7, team: 'Sri Lanka', matches: 32, points: 3040, rating: 95 },
  { id: 'to8', format: 'ODI', rank: 8, team: 'Afghanistan', matches: 30, points: 2700, rating: 90 },
  { id: 'to9', format: 'ODI', rank: 9, team: 'Bangladesh', matches: 28, points: 2380, rating: 85 },
  { id: 'to10', format: 'ODI', rank: 10, team: 'West Indies', matches: 25, points: 2000, rating: 80 },

  // T20 TEAMS
  { id: 'tt201', format: 'T20', rank: 1, team: 'India', matches: 55, points: 14575, rating: 265 },
  { id: 'tt202', format: 'T20', rank: 2, team: 'England', matches: 48, points: 12480, rating: 260 },
  { id: 'tt203', format: 'T20', rank: 3, team: 'West Indies', matches: 50, points: 12750, rating: 255 },
  { id: 'tt204', format: 'T20', rank: 4, team: 'Australia', matches: 45, points: 11250, rating: 250 },
  { id: 'tt205', format: 'T20', rank: 5, team: 'New Zealand', matches: 42, points: 10290, rating: 245 },
  { id: 'tt206', format: 'T20', rank: 6, team: 'Pakistan', matches: 52, points: 12480, rating: 240 },
  { id: 'tt207', format: 'T20', rank: 7, team: 'South Africa', matches: 40, points: 9400, rating: 235 },
  { id: 'tt208', format: 'T20', rank: 8, team: 'Sri Lanka', matches: 44, points: 10120, rating: 230 },
  { id: 'tt209', format: 'T20', rank: 9, team: 'Afghanistan', matches: 38, points: 8550, rating: 225 },
  { id: 'tt210', format: 'T20', rank: 10, team: 'Bangladesh', matches: 36, points: 7920, rating: 220 },
];

const PLAYER_DATA = [
  // TEST PLAYERS
  { id: 'tp1', format: 'TEST', rank: 1, name: 'Joe Root', country: 'ENG', rating: 925, role: 'Batter', trend: 0, form: [80, 85, 90, 88, 92] },
  { id: 'tp2', format: 'TEST', rank: 2, name: 'Kane Williamson', country: 'NZ', rating: 890, role: 'Batter', trend: 1, form: [70, 75, 80, 85, 88] },
  { id: 'tp3', format: 'TEST', rank: 3, name: 'Yashasvi Jaiswal', country: 'IND', rating: 885, role: 'Batter', trend: 2, form: [60, 90, 120, 45, 100] },
  { id: 'tp4', format: 'TEST', rank: 4, name: 'Steve Smith', country: 'AUS', rating: 860, role: 'Batter', trend: -2, form: [80, 70, 60, 65, 70] },
  { id: 'tp5', format: 'TEST', rank: 5, name: 'Ravi Jadeja', country: 'IND', rating: 850, role: 'All Rounder', trend: 0, form: [70, 72, 75, 74, 76] },
  { id: 'tp6', format: 'TEST', rank: 6, name: 'Pat Cummins', country: 'AUS', rating: 840, role: 'Bowler', trend: 0, form: [80, 82, 85, 80, 81] },
  { id: 'tp7', format: 'TEST', rank: 7, name: 'Ravi Ashwin', country: 'IND', rating: 830, role: 'Bowler', trend: 1, form: [75, 78, 80, 82, 85] },
  { id: 'tp8', format: 'TEST', rank: 8, name: 'Kagiso Rabada', country: 'SA', rating: 820, role: 'Bowler', trend: -1, form: [85, 80, 78, 76, 75] },
  { id: 'tp9', format: 'TEST', rank: 9, name: 'Jasprit Bumrah', country: 'IND', rating: 815, role: 'Bowler', trend: 2, form: [80, 85, 90, 92, 95] },
  { id: 'tp10', format: 'TEST', rank: 10, name: 'Babar Azam', country: 'PAK', rating: 800, role: 'Batter', trend: -1, form: [70, 65, 60, 68, 70] },
  
  // ODI PLAYERS
  { id: 'op1', format: 'ODI', rank: 1, name: 'Shubman Gill', country: 'IND', rating: 850, role: 'Batter', trend: 0, form: [80, 85, 82, 88, 90] },
  { id: 'op2', format: 'ODI', rank: 2, name: 'Babar Azam', country: 'PAK', rating: 840, role: 'Batter', trend: 0, form: [82, 80, 85, 81, 83] },
  { id: 'op3', format: 'ODI', rank: 3, name: 'Virat Kohli', country: 'IND', rating: 810, role: 'Batter', trend: 1, form: [75, 78, 80, 85, 88] },
  { id: 'op4', format: 'ODI', rank: 4, name: 'Rohit Sharma', country: 'IND', rating: 790, role: 'Batter', trend: -1, form: [85, 80, 75, 70, 72] },
  { id: 'op5', format: 'ODI', rank: 5, name: 'Daryl Mitchell', country: 'NZ', rating: 780, role: 'All Rounder', trend: 2, form: [70, 75, 80, 85, 90] },
  { id: 'op6', format: 'ODI', rank: 6, name: 'David Warner', country: 'AUS', rating: 770, role: 'Batter', trend: -2, form: [80, 75, 70, 65, 60] },
  { id: 'op7', format: 'ODI', rank: 7, name: 'Harry Tector', country: 'IRE', rating: 760, role: 'Batter', trend: 1, form: [70, 72, 74, 76, 78] },
  { id: 'op8', format: 'ODI', rank: 8, name: 'Dawid Malan', country: 'ENG', rating: 750, role: 'Batter', trend: 0, form: [75, 75, 75, 75, 75] },
  { id: 'op9', format: 'ODI', rank: 9, name: 'Rassie v.d. Dussen', country: 'SA', rating: 740, role: 'Batter', trend: -1, form: [78, 76, 74, 72, 70] },
  { id: 'op10', format: 'ODI', rank: 10, name: 'Heinrich Klaasen', country: 'SA', rating: 735, role: 'Batter', trend: 2, form: [60, 70, 80, 90, 100] },

  // T20 PLAYERS
  { id: 'tp201', format: 'T20', rank: 1, name: 'Suryakumar Yadav', country: 'IND', rating: 910, role: 'Batter', trend: 0, form: [90, 95, 88, 92, 94] },
  { id: 'tp202', format: 'T20', rank: 2, name: 'Phil Salt', country: 'ENG', rating: 850, role: 'Batter', trend: 1, form: [80, 82, 85, 88, 90] },
  { id: 'tp203', format: 'T20', rank: 3, name: 'Mohammad Rizwan', country: 'PAK', rating: 830, role: 'Batter', trend: -1, form: [85, 82, 80, 78, 76] },
  { id: 'tp204', format: 'T20', rank: 4, name: 'Babar Azam', country: 'PAK', rating: 800, role: 'Batter', trend: 0, form: [80, 80, 80, 80, 80] },
  { id: 'tp205', format: 'T20', rank: 5, name: 'Aiden Markram', country: 'SA', rating: 780, role: 'Batter', trend: 2, form: [70, 75, 80, 85, 88] },
  { id: 'tp206', format: 'T20', rank: 6, name: 'Yashasvi Jaiswal', country: 'IND', rating: 770, role: 'Batter', trend: 3, form: [60, 70, 80, 90, 100] },
  { id: 'tp207', format: 'T20', rank: 7, name: 'Riley Meredith', country: 'AUS', rating: 760, role: 'Bowler', trend: 1, form: [72, 74, 76, 78, 80] },
  { id: 'tp208', format: 'T20', rank: 8, name: 'Rashid Khan', country: 'AFG', rating: 750, role: 'Bowler', trend: -2, form: [80, 78, 76, 74, 72] },
  { id: 'tp209', format: 'T20', rank: 9, name: 'Jos Buttler', country: 'ENG', rating: 740, role: 'Batter', trend: -1, form: [78, 76, 74, 72, 70] },
  { id: 'tp210', format: 'T20', rank: 10, name: 'Wanindu Hasaranga', country: 'SL', rating: 730, role: 'All Rounder', trend: 0, form: [73, 73, 73, 73, 73] },
];

// -----------------------------
// MAIN COMPONENT
// -----------------------------
const Stats = () => {
  const [selectedFormat, setSelectedFormat] = useState('T20');
  
  // Filter & Limit Logic (The "Core" Requirement)
  const filteredTeams = useMemo(() => {
    return TEAM_DATA
      .filter(t => t.format === selectedFormat)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10); // Limit to Top 10
  }, [selectedFormat]);

  const filteredPlayers = useMemo(() => {
    return PLAYER_DATA
      .filter(p => p.format === selectedFormat)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10); // Limit to Top 10
  }, [selectedFormat]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0b0c15] text-white p-4 md:p-8 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Header & Date Badge */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            ICC Rankings
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-slate-400 text-sm font-mono">
              Live Updated: <span className="text-emerald-400 font-bold">01 DEC 2025</span>
            </p>
          </div>
        </div>

        {/* FORMAT SWITCHER - The Core Filter */}
        <div className="flex bg-slate-800/50 p-1.5 rounded-xl mt-4 md:mt-0 backdrop-blur-md border border-white/10">
          {['TEST', 'ODI', 'T20'].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFormat(f)}
              className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all relative ${
                selectedFormat === f 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {selectedFormat === f && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-600 rounded-lg -z-10"
                />
              )}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Teams vs Players */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- LEFT COLUMN: TOP 10 TEAMS --- */}
        <motion.div 
          key={`team-${selectedFormat}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md"
        >
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className="text-indigo-400">#</span> Top 10 Teams
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              {selectedFormat}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4 text-center">Matches</th>
                  <th className="px-6 py-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTeams.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                        t.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                        t.rank <= 3 ? 'bg-slate-700 text-white' : 'text-slate-500'
                      }`}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">{t.team}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400 font-mono">
                      {t.matches}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-xl text-white">{t.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: TOP 10 PLAYERS --- */}
        <motion.div 
          key={`player-${selectedFormat}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md"
        >
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className="text-emerald-400">★</span> Top 10 Players
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              {selectedFormat}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Form</th>
                  <th className="px-6 py-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPlayers.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center w-8">
                        <span className={`text-sm font-bold ${p.rank <= 3 ? 'text-white' : 'text-slate-500'}`}>
                          {p.rank}
                        </span>
                        <div className="mt-1">
                          <TrendArrow trend={p.trend} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{p.name}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                        {p.country} • <span className="text-indigo-400">{p.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Sparkline data={p.form} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-white">{p.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Stats;