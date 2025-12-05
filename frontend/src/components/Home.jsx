import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Calendar, TrendingUp, Clock, 
  Loader2, Trophy, Crown, RefreshCw, Radio, 
  Flame, Hash, Filter, Zap, Shield, ArrowRight, Star,
  Lightbulb, Users, Mail
} from 'lucide-react';

// --- 1. DATA HOOK ---
const useFetch = (url, refreshInterval = 0) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(url); 
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();
      setData(result);
      if (loading) setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
    if (refreshInterval > 0) {
        const intervalId = setInterval(fetchData, refreshInterval);
        return () => clearInterval(intervalId);
    }
  }, [url, refreshInterval]);

  return { data, loading };
};

// --- 2. DATA HELPER ---
const processMatchData = (rawMatch) => {
    if (!rawMatch) return null;
    const names = rawMatch.name ? rawMatch.name.split(' vs ') : ['Team A', 'Team B'];
    const isLive = rawMatch.status === 'Live' || rawMatch.status === 'In Progress';
    
    return {
        id: rawMatch.id,
        t1: names[0]?.substring(0, 3).toUpperCase() || 'TBA',
        t1Name: names[0] || 'TBA',
        t2: names[1]?.substring(0, 3).toUpperCase() || 'TBA',
        t2Name: names[1] || 'TBA',
        s1: rawMatch.score ? rawMatch.score[0] : '-', 
        s2: rawMatch.score ? rawMatch.score[1] : '-',
        status: rawMatch.status || 'Scheduled',
        type: rawMatch.matchType || 'Match',
        live: isLive,
        winProbability: isLive ? Math.floor(Math.random() * (70 - 30 + 1) + 30) : 50
    };
};

// --- 3. UI COMPONENTS ---

const MatchSkeleton = () => (
    <div className="min-w-[280px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
            <div className="flex justify-between"><div className="h-4 bg-slate-200 w-12"></div><div className="h-4 bg-slate-200 w-8"></div></div>
            <div className="flex justify-between"><div className="h-4 bg-slate-200 w-12"></div><div className="h-4 bg-slate-200 w-8"></div></div>
        </div>
    </div>
);

const TrendingBar = () => {
    const topics = [
        { tag: "IPL2026", color: "text-blue-500" },
        { tag: "IndVsAus", color: "text-emerald-500" },
        { tag: "ViratKohli", color: "text-orange-500" },
        { tag: "WPLAuction", color: "text-pink-500" },
        { tag: "ChampionsTrophy", color: "text-purple-500" },
        { tag: "Bazball", color: "text-red-500" }
    ];
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 overflow-hidden">
            <div className="container mx-auto px-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">
                    <TrendingUp size={14} className="text-emerald-500" /> Trending:
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar mask-gradient-right">
                    {topics.map((t, i) => (
                        <Link key={i} to={`/search?q=${t.tag}`} className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 whitespace-nowrap px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <Hash size={10} className={t.color} /> {t.tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const QuickFilters = () => {
    const filters = [
        { label: "All", icon: <Filter size={14}/>, active: true },
        { label: "T20", icon: <Zap size={14}/>, active: false },
        { label: "ODI", icon: <Shield size={14}/>, active: false },
        { label: "Test", icon: <Clock size={14}/>, active: false },
    ];
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden">
            {filters.map((f, i) => (
                <button key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${f.active ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
                    {f.icon} {f.label}
                </button>
            ))}
        </div>
    );
}

const FantasyWidget = () => (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-sm flex items-center gap-2"><Users size={16}/> Fantasy Picks</h3>
                <span className="bg-white/20 text-[9px] px-2 py-0.5 rounded uppercase font-bold">IND vs AUS</span>
            </div>
            <div className="flex gap-3 items-center">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs mb-1 border border-white/30">VK</div>
                    <span className="text-[10px] opacity-80">Capt</span>
                </div>
                <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs mb-1 border border-white/30">SS</div>
                    <span className="text-[10px] opacity-80">VC</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-lg p-2 text-[10px] leading-tight opacity-90">
                    "Kohli averages 55.4 at this venue. Must have for today!"
                </div>
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 text-white/5"><Trophy size={80}/></div>
    </div>
);

// **UPDATED** TRIVIA WIDGET (Extended List + Auto Rotate)
const TriviaWidget = () => {
    const facts = [
        "The longest cricket match ever recorded was between England and South Africa in 1939. It lasted for 9 days!",
        "Shahid Afridi used Sachin Tendulkar's bat to hit the fastest ever ODI century.",
        "Chris Gayle is the only batsman to hit a six off the first ball of a Test match.",
        "Iftikhar Ali Khan Pataudi is the only cricketer to have played Test cricket for both India and England.",
        "The first-ever international cricket match was played between USA and Canada in 1844.",
        "Brian Lara is the only player to score 400 runs in a single Test innings.",
        "MS Dhoni has the most stumpings in international cricket history.",
        "Wasim Akram is the first bowler to take 500 wickets in ODI cricket.",
        "India is the only country to win the 60-Over, 50-Over, and 20-Over World Cups.",
        "AB de Villiers holds the record for the fastest ODI century, taking just 31 balls."
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % facts.length);
        }, 8000); // Change every 8 seconds for readability
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4 mt-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <h3 className="font-bold text-amber-700 dark:text-amber-500 text-xs uppercase flex items-center gap-2 mb-2 z-10 relative">
                <Lightbulb size={12}/> Did You Know?
            </h3>
            <div className="relative h-20 z-10">
                {facts.map((fact, i) => (
                    <p 
                        key={i} 
                        className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${i === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                    >
                        {fact}
                    </p>
                ))}
            </div>
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-amber-200 dark:bg-amber-800/30 w-full">
                <div key={index} className="h-full bg-amber-500 animate-[progress_8s_linear]" />
            </div>
            <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>
        </div>
    );
};

const UpcomingWidget = ({ matches }) => {
    let upcoming = matches.filter(m => m.status === 'Scheduled' || m.status.includes('Starts') || !m.live);
    if (upcoming.length === 0) upcoming = matches.slice(0, 3);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" /> Up Next
                </h3>
                <Link to="/schedules" className="text-[10px] font-bold text-indigo-500 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
                {upcoming.slice(0, 3).map((rawMatch, idx) => {
                    const m = processMatchData(rawMatch);
                    return (
                        <div key={m.id} className="pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{m.t1} vs {m.t2}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{m.status}</div>
                                </div>
                                {idx===0 && <Link to={`/match/${m.id}`} className="bg-indigo-50 text-indigo-600 p-1 rounded hover:bg-indigo-100"><ChevronRight size={12}/></Link>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SidebarContent = ({ matches }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                    <Filter size={16} className="text-emerald-500" /> Explore
                </h3>
                <ul className="space-y-1">
                    {['Champions Trophy', 'IPL 2026', 'The Ashes', 'Ranji Trophy'].map((item, i) => (
                        <li key={item}>
                            <Link to="/schedules" className={`block text-sm hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors flex justify-between items-center group ${i===0 ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300'}`}>
                                {item}
                                {i===0 && <Flame size={12} className="text-orange-500 fill-orange-500"/>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <UpcomingWidget matches={matches} />
            <TriviaWidget />
        </div>
    );
};

const PointsTableWidget = () => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><Trophy size={14} className="text-amber-500"/> Standings</h3>
            <span className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold">Group A</span>
        </div>
        <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium">
                <tr><th className="p-3">Team</th><th className="p-3 text-center">P</th><th className="p-3 text-center">Pts</th><th className="p-3 text-right">NRR</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[{t:'IND',p:4,pts:8,n:'+2.1'},{t:'AUS',p:4,pts:6,n:'+1.4'},{t:'ENG',p:4,pts:4,n:'-0.2'}].map((r, i) => (
                    <tr key={r.t} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"><td className="p-3 font-bold text-slate-700 dark:text-slate-200 flex gap-2"><span className="text-slate-400 font-normal">{i+1}</span>{r.t}</td><td className="p-3 text-center text-slate-500">{r.p}</td><td className="p-3 text-center font-bold text-emerald-600">{r.pts}</td><td className="p-3 text-right font-mono text-slate-500">{r.n}</td></tr>
                ))}
            </tbody>
        </table>
    </div>
);

// **UPDATED** LIVE STRIP (Perfectly Matched Arrows)
const LiveStrip = ({ matches, isSystemInitializing }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    if (isSystemInitializing) return <div className="py-6"><div className="container mx-auto px-4 flex gap-4"><MatchSkeleton/><MatchSkeleton/><MatchSkeleton/></div></div>;
    if (!matches || matches.length === 0) return null;

    return (
        <div className="w-full bg-slate-50/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 pt-4 pb-4 sticky top-0 z-30 backdrop-blur-md group/strip">
            <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                        <Radio size={14} className="text-red-500 animate-pulse"/> Live Action
                    </h3>
                    <Link to="/live-scores" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">View All <ArrowRight size={10}/></Link>
                </div>

                {/* SCROLL BUTTONS - Matches the background and border of the strip */}
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute left-0 top-[60%] -translate-y-1/2 z-40 -ml-3 lg:ml-0 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover/strip:opacity-100 transition-all hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-md"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={() => scroll('right')} 
                    className="absolute right-0 top-[60%] -translate-y-1/2 z-40 -mr-3 lg:mr-0 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover/strip:opacity-100 transition-all hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-md"
                >
                    <ChevronRight size={20} />
                </button>

                <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x scroll-smooth px-1">
                    {matches.map((rawMatch) => {
                        const m = processMatchData(rawMatch);
                        return (
                            <Link key={m.id} to={`/match/${m.id}`} className="snap-start min-w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group relative overflow-hidden">
                                {m.live && <div className="absolute top-0 right-0 w-12 h-12 bg-red-500 blur-2xl opacity-10 rounded-full -mr-4 -mt-4"></div>}
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.live ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400' : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>{m.type}</span>
                                    {m.live && <span className="text-[9px] font-bold text-red-500 animate-pulse">● LIVE</span>}
                                </div>
                                <div className="space-y-2 mb-3 relative z-10">
                                    <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">{m.t1[0]}</div><span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[120px]">{m.t1Name}</span></div><span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{m.s1}</span></div>
                                    <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">{m.t2[0]}</div><span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[120px]">{m.t2Name}</span></div><span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{m.s2}</span></div>
                                </div>
                                {m.live ? (
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10">
                                        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider"><span>Win Prob</span></div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex"><div style={{ width: `${m.winProbability}%` }} className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full" /><div style={{ width: `${100 - m.winProbability}%` }} className="bg-slate-200 dark:bg-slate-700 h-full" /></div>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate border-t border-slate-100 dark:border-slate-800 pt-2 relative z-10">{m.status}</p>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- 4. MAIN PAGE ---
const Home = () => {
    const { data: matchesData, loading: matchesLoading } = useFetch('http://localhost:8081/api/v1/cricket/current-matches', 30000);
    const { data: playersData } = useFetch('http://localhost:8081/api/v1/cricket/players', 300000);

    const newsData = [
        { id: 1, title: "WPL 2025: Official Schedule Announced", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800", cat: "Breaking", time: "1h ago" },
        { id: 2, title: "Exclusive: Team India's strategy for the upcoming ODI's", img: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=800", cat: "Interview", time: "3h ago" },
        { id: 3, title: "Analysis: Why spinners will dominate this season", img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800", cat: "Analysis", time: "5h ago" }
    ];

    const matches = matchesData?.data || [];
    const topPlayers = playersData?.data?.slice(0, 5) || [];
    const isSystemInitializing = !matchesLoading && (!matchesData || !matchesData.data);

    if (matchesLoading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-4"><Loader2 className="animate-spin text-emerald-500" size={40} /><p className="text-sm font-medium animate-pulse">Syncing with CricSphere Cloud...</p></div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-12 transition-colors duration-300">
            <TrendingBar />
            <LiveStrip matches={matches} isSystemInitializing={isSystemInitializing} />

            <div className="container mx-auto px-4 mt-6">
                
                <QuickFilters />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                    
                    {/* --- LEFT SIDEBAR (20%) --- */}
                    <div className="lg:col-span-3 hidden lg:block">
                        <div className="sticky top-24">
                            <SidebarContent matches={matches} />
                        </div>
                    </div>

                    {/* --- MAIN FEED (55%) --- */}
                    <div className="lg:col-span-6 space-y-8">
                        {/* Hero News */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer hover:shadow-lg transition-all">
                            <div className="relative h-72 w-full overflow-hidden">
                                <img src={newsData[0].img} alt="News" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">{newsData[0].cat}</span>
                                        <span className="text-slate-300 text-[10px] flex items-center gap-1 bg-black/30 px-2 py-1 rounded backdrop-blur-sm"><Clock size={10} /> {newsData[0].time}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white leading-tight mb-2 drop-shadow-md">{newsData[0].title}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Points Table */}
                        <PointsTableWidget />

                        {/* News Feed */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Latest Stories</h3>
                            </div>
                            {newsData.slice(1).map((story) => (
                                <div key={story.id} className="flex gap-4 items-start py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-lg transition-colors">
                                    <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0"><img src={story.img} className="w-full h-full object-cover" alt="" /></div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 leading-snug">{story.title}</h4>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500"><span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium text-slate-600 dark:text-slate-400">{story.cat}</span><span className="flex items-center gap-1"><Clock size={10} /> {story.time}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT SIDEBAR (25%) --- */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Stats Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> Top Performers</h3><Link to="/stats" className="text-xs text-slate-400 hover:text-emerald-500">More</Link></div>
                            {topPlayers.length > 0 ? (
                                <div className="space-y-3">
                                    {topPlayers.map((p, i) => (
                                        <div key={p.id || i} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3"><span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{i+1}</span><div><div className="font-bold text-slate-700 dark:text-slate-200 text-xs">{p.name}</div><div className="text-[10px] text-slate-400">{p.team}</div></div></div><div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">98.5</div>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="text-center py-6 text-slate-400 text-xs">No data</div>}
                        </div>
                        
                        {/* Newsletter Widget */}
                        <div className="bg-indigo-600 rounded-xl p-5 text-white text-center shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <Mail className="mx-auto mb-3 text-indigo-200" size={24} />
                                <h4 className="font-bold text-sm mb-1">Cricket in your Inbox</h4>
                                <p className="text-[10px] text-indigo-100 mb-3 opacity-90">Get match summaries & stats daily.</p>
                                <div className="flex gap-2"><input type="email" placeholder="Email" className="w-full rounded px-2 py-1.5 text-xs text-slate-900 focus:outline-none" /><button className="bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded text-xs font-bold transition-colors">→</button></div>
                            </div>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black opacity-10 rounded-full -ml-8 -mb-8"></div>
                        </div>

                        {/* Poll Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm flex items-center gap-2"><TrendingUp className="text-blue-500" size={16}/> Fan Poll</h3>
                            <p className="text-xs text-slate-500 mb-4">Who wins the 2025 Champions Trophy?</p>
                            <div className="space-y-2">
                                {['India', 'Australia', 'Pakistan', 'England'].map((opt) => (
                                    <button key={opt} className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg transition-colors flex justify-between group"><span>{opt}</span><span className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity">Vote</span></button>
                                ))}
                            </div>
                        </div>

                         {/* Premium Ad */}
                         <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex flex-col items-center justify-center text-center p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg">
                            <div className="relative z-10">
                                <div className="flex items-center justify-center gap-1 mb-1 opacity-90"><Crown size={12} className="fill-white" /><span className="text-xs font-bold uppercase tracking-widest">CricSphere Elite</span></div>
                                <h4 className="font-bold text-lg leading-tight mb-3">For Elite in You</h4>
                                <Link to="/premium" className="inline-block bg-white text-indigo-600 text-[10px] font-bold px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-md">Upgrade Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;