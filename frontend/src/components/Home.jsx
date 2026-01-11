import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, TrendingUp, Clock, 
  Loader2, Trophy, Radio, Hash, Filter, Zap, Lightbulb, Mail,
  Crown, CheckCircle2, ShieldCheck, Activity
} from 'lucide-react';
import { getCurrentMatches } from "../api/cricketApi";



/* --- 1. ACCURACY ENGINES --- */
const isMatchDone = (status = "") => {
  const s = status.toLowerCase();
  return ["won", "draw", "tie", "abandon", "no result", "result"].some(k => s.includes(k));
};

const getTeamScore = (match, teamName) => {
    if (!match?.score || !Array.isArray(match.score)) return null;
    return match.score.find(s => s.inning?.toLowerCase().includes(teamName.toLowerCase()));
};

/* --- 2. LIVE HUB COMPONENT --- */
const LiveStrip = ({ rawMatches, loading }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const processedMatches = useMemo(() => {
        if (!rawMatches) return [];
        return [...rawMatches].sort((a, b) => {
            const aDone = isMatchDone(a.status);
            const bDone = isMatchDone(b.status);
            if (aDone !== bDone) return aDone ? 1 : -1;
            return b.dateTimeGMT.localeCompare(a.dateTimeGMT);
        });
    }, [rawMatches]);

    const scroll = (dir) => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });
    };

    if (loading && !rawMatches) return <div className="h-32 bg-slate-100 dark:bg-slate-900 animate-pulse m-4 rounded-2xl" />;

    return (
        <div className="w-full bg-white/80 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 pt-6 pb-6 sticky top-0 z-30 backdrop-blur-xl group/strip">
            <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        Live Action Hub
                    </h3>
                    <Link to="/live-scores" className="group flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 hover:text-blue-600 transition-all">
                        Match Center <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative">
                    <button onClick={() => scroll('left')} className="absolute -left-2 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 p-2 rounded-full shadow-xl opacity-0 group-hover/strip:opacity-100 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar snap-x px-1">
                        {processedMatches.map((match) => {
                            const [t1, t2] = match.teams;
                            const s1 = getTeamScore(match, t1);
                            const s2 = getTeamScore(match, t2);
                            const done = isMatchDone(match.status);
                            return (
                                <div key={match.id} onClick={() => navigate(`/match/${match.id}`, { state: { matchData: match } })} className="snap-start min-w-[300px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 cursor-pointer transition-all group">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{match.matchType}</span>
                                        {!done && <span className="text-[9px] font-black text-red-500 flex items-center gap-1 animate-pulse"><Radio size={12} /> LIVE</span>}
                                    </div>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={`font-bold truncate max-w-[140px] ${!done ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{t1}</span>
                                            <span className="font-mono font-black">{s1 ? `${s1.r}/${s1.w}` : '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={`font-bold truncate max-w-[140px] ${!done ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{t2}</span>
                                            <span className="font-mono font-black">{s2 ? `${s2.r}/${s2.w}` : '-'}</span>
                                        </div>
                                    </div>
                                    <p className={`text-[10px] font-bold truncate border-t border-slate-50 dark:border-slate-800 pt-3 ${!done ? 'text-blue-500' : 'text-emerald-500'}`}>{match.status}</p>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={() => scroll('right')} className="absolute -right-2 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 p-2 rounded-full shadow-xl opacity-0 group-hover/strip:opacity-100 transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- 3. MAIN PAGE --- */
const Home = () => {
    const [matchesData, setMatchesData] = useState(null);
const [matchesLoading, setMatchesLoading] = useState(true);

useEffect(() => {
  getCurrentMatches()
    .then(res => {
      // res.data = { status, data: [...] }
      setMatchesData(res.data.data);
    })
    .catch(err => console.error("Match API error:", err))
    .finally(() => setMatchesLoading(false));
}, []);


    const newsData = [
        { id: 1, title: "IPL 2026: Trade Window Opens with Record Transfers", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800", cat: "IPL News", time: "1h ago" },
        { id: 2, title: "Wicket-Keeping Evolution: Analysis of Modern Glovesman", img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800", cat: "Feature", time: "5h ago" }
    ];

    if (matchesLoading && !matchesData) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#080a0f]">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Syncing Arena Telemetry...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080a0f] transition-colors duration-500 pb-20">
            <TrendingBar />
            <LiveStrip rawMatches={matchesData} loading={matchesLoading} />

            <div className="container mx-auto px-4 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT RAIL */}
                    <div className="lg:col-span-3 space-y-8 hidden lg:block">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Quick Links</h3>
                            <div className="space-y-2">
                                {['T20 World Cup', 'WTC Standings', 'Match Archives'].map(link => (
                                    <Link key={link} to="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {link} <ChevronRight size={14} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <TriviaWidget />
                    </div>

                    {/* CENTER FEED */}
                    <div className="lg:col-span-6 space-y-10">
                        <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
                            <img src={newsData[0].img} className="w-full h-[450px] object-cover" alt="Hero" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-10">
                                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded mb-4 inline-block tracking-widest">{newsData[0].cat}</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter mb-4 uppercase italic">{newsData[0].title}</h2>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Breaking Headlines</h3>
                            {newsData.slice(1).map(story => (
                                <div key={story.id} className="flex gap-6 group cursor-pointer border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div className="w-32 h-20 rounded-2xl overflow-hidden shrink-0">
                                        <img src={story.img} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[9px] font-black uppercase text-blue-500 mb-1">{story.cat}</span>
                                        <h4 className="text-lg font-black dark:text-white leading-tight group-hover:text-blue-500 transition-colors uppercase">{story.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT RAIL: PRO PLAN INTEGRATION */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* 💎 NEW ARENA PRO WIDGET */}
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20">
                            <Crown className="absolute -top-4 -right-4 text-white/10 group-hover:scale-125 transition-transform duration-700" size={120} />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 uppercase italic leading-none">Arena Pro</h3>
                                <p className="text-[11px] text-blue-100 font-bold mb-8 uppercase tracking-widest opacity-80">Unlock the Stats Lab</p>
                                
                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                                        <CheckCircle2 size={16} className="text-blue-300" /> AI Predictions
                                    </li>
                                    <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                                        <ShieldCheck size={16} className="text-blue-300" /> Ad-Free Analytics
                                    </li>
                                </ul>

                                <Link to="/premium">
                                    <button className="w-full bg-white text-blue-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2">
                                        Upgrade Now <Zap size={14} fill="currentColor" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <PointsTableWidget />
                    </div>

                </div>
            </div>
        </div>
    );
};

/* --- SUPPORTING COMPONENTS --- */
const TrendingBar = () => (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 whitespace-nowrap tracking-widest">
                <TrendingUp size={14} /> Global Threads
            </span>
            <div className="flex gap-6 overflow-x-auto no-scrollbar py-1">
                {['#BGT2026', '#IPL_Retention', '#KohliStatus', '#WTC_Final'].map(tag => (
                    <span key={tag} className="text-[11px] font-bold text-slate-500 hover:text-blue-500 cursor-pointer whitespace-nowrap transition-colors">{tag}</span>
                ))}
            </div>
        </div>
    </div>
);

const TriviaWidget = () => (
    <div className="bg-amber-400/10 border border-amber-400/20 rounded-[2rem] p-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2 mb-4">
            <Lightbulb size={14} /> Fact Room
        </h4>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "India is the only country to win 60-Over, 50-Over, and 20-Over World Cups."
        </p>
    </div>
);

const PointsTableWidget = () => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest dark:text-white flex items-center gap-2">
                <Trophy size={14} className="text-amber-500" /> WTC Rank
            </h3>
        </div>
        <table className="w-full text-[11px]">
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {[{t:'IND',p:'68.5'},{t:'AUS',p:'62.4'},{t:'SA',p:'54.2'}].map((r, i) => (
                    <tr key={r.t} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                        <td className="p-4 font-black text-slate-400">{i+1}</td>
                        <td className="p-4 font-black dark:text-white">{r.t}</td>
                        <td className="p-4 text-right font-black text-blue-500">{r.p}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Home;