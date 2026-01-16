import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, Radio, Trophy, Loader2, 
  Flame, Calendar, BarChart3, ChevronLeft
} from "lucide-react";
import { getLiveMatches, getNews, getSeries } from "../services/api";

/* =========================
   LIVE TICKER HUB (Compact)
========================= */
const LiveHub = ({ matches, loading }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    const offset = dir === "left" ? -300 : 300;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (loading) return <div className="h-28 bg-slate-900/50 animate-pulse rounded-xl mb-6" />;
  
  // 🟢 Safety check to prevent .map error
  const matchItems = Array.isArray(matches) ? matches : [];

  return (
    <div className="relative group mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live Action Hub
        </h2>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="p-1 hover:bg-white/5 rounded text-slate-400"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll('right')} className="p-1 hover:bg-white/5 rounded text-slate-400"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex gap-3 overflow-x-auto no-scrollbar snap-x scroll-smooth pb-2"
      >
        {matchItems.length > 0 ? matchItems.map((m) => {
          const s1 = m.matchScore?.team1Score?.inngs1;
          const s2 = m.matchScore?.team2Score?.inngs1;
          
          return (
            <div
              key={m.matchId}
              onClick={() => navigate(`/match/${m.matchId}`)}
              className="snap-start min-w-[240px] max-w-[240px] bg-[#111827] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-all shadow-lg"
            >
              <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase mb-3">
                <span>{m.matchFormat}</span>
                <span className="text-blue-500">{m.matchDesc?.split(',')[0]}</span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold truncate pr-2">{m.team1?.shortName || m.team1?.teamName}</span>
                  <span className="text-xs font-mono font-black">{s1?.runs || 0}/{s1?.wickets || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold truncate pr-2">{m.team2?.shortName || m.team2?.teamName}</span>
                  <span className="text-xs font-mono font-black">{s2?.runs || 0}/{s2?.wickets || 0}</span>
                </div>
              </div>

              <p className="text-[9px] font-medium text-emerald-500 truncate border-t border-white/5 pt-2">
                {m.status}
              </p>
            </div>
          );
        }) : (
          <div className="text-[10px] text-slate-600 italic p-4">No live matches available.</div>
        )}
      </div>
    </div>
  );
};

/* =========================
   DASHBOARD MAIN
========================= */
export default function Home() {
  const [data, setData] = useState({ live: [], news: [], series: [] });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [l, n, s] = await Promise.all([getLiveMatches(), getNews(), getSeries()]);
      
      // 🟢 Force results to be arrays to prevent .slice() crashes
      setData({
        live: Array.isArray(l.data) ? l.data : [],
        news: Array.isArray(n.data?.storyList) ? n.data.storyList : [],
        series: Array.isArray(s.data) ? s.data : []
      });
    } catch (e) {
      console.error("Dashboard Sync Failed", e);
      // Ensure we don't have nulls
      setData({ live: [], news: [], series: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const ticker = setInterval(() => {
      getLiveMatches().then(r => {
        if(r.data) setData(prev => ({ ...prev, live: Array.isArray(r.data) ? r.data : [] }));
      });
    }, 60000);
    return () => clearInterval(ticker);
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f]">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Initializing Arena</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        
        <LiveHub matches={data.live} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest">Featured Series</h3>
              </div>
              <div className="divide-y divide-white/5">
                {data.series.length > 0 ? data.series.slice(0, 10).map((s) => (
                  <Link 
                    to={`/series/${s.id}`} 
                    key={s.id}
                    className="flex items-center justify-between p-4 hover:bg-blue-600/10 transition-colors group"
                  >
                    <span className="text-xs font-bold truncate pr-4 group-hover:text-blue-400">{s.name}</span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400" />
                  </Link>
                )) : (
                  <div className="p-4 text-[10px] text-slate-600">No series data found.</div>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-6 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4">
              <Flame size={16} className="text-orange-500" /> Leading Stories
            </h3>

            {data.news.length > 0 ? data.news.map((n) => (
              <Link
                to={`/news/${n.story?.id}`}
                key={n.story?.id}
                className="group flex gap-5 bg-[#111827] p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all"
              >
                <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={n.story?.imageUrl || "https://via.placeholder.com/150"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="News"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-blue-500 uppercase">{n.story?.source}</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">• LIVE</span>
                  </div>
                  <h4 className="text-sm md:text-base font-black leading-tight line-clamp-2 group-hover:text-blue-400">
                    {n.story?.title}
                  </h4>
                </div>
              </Link>
            )) : (
              <div className="text-center py-10 text-slate-600 text-xs font-bold">Waiting for News Feed...</div>
            )}
          </main>

          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#111827] rounded-2xl border border-white/5 p-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6">
                <BarChart3 size={16} className="text-blue-500" /> Rankings
              </h3>
              <div className="space-y-4">
                {['India', 'Australia', 'England', 'New Zealand'].map((team, i) => (
                  <div key={team} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-700">0{i+1}</span>
                      <span className="text-xs font-bold">{team}</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-500">12{9-i}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}