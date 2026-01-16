import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, Trophy, Loader2, Flame, 
  BarChart3, ChevronLeft, Zap, Target, TrendingUp
} from "lucide-react";
import { getLiveMatches, getNews, getSeries } from "../services/api";

/* ==========================================================
   SHIMMER LOADING COMPONENT
   ========================================================== */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`} />
);

/* ==========================================================
   LIVE ACTION HUB (Glassmorphism Style)
   ========================================================== */
const LiveHub = ({ matches = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    const offset = dir === "left" ? -400 : 400;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="relative mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Zap size={18} className="text-red-500 fill-red-500" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Live Arena</h2>
            <p className="text-[10px] text-slate-500 font-bold">Real-time match telemetry</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-slate-900 border border-white/5 rounded-full hover:bg-slate-800 transition-colors"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-slate-900 border border-white/5 rounded-full hover:bg-slate-800 transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x scroll-smooth pb-4 px-2"
      >
        {matches.length > 0 ? matches.map((m) => (
          <div
            key={m.matchId}
            onClick={() => navigate(`/match/${m.matchId}`)}
            className="snap-start min-w-[320px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded uppercase border border-blue-500/20">{m.matchFormat}</span>
              <span className="text-[10px] font-bold text-slate-400">{m.seriesName?.split(' ').slice(0,3).join(' ')}</span>
            </div>

            <div className="space-y-4 mb-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/5 flex items-center justify-center font-black text-xs">{m.team1?.shortName?.[0]}</div>
                  <span className="text-sm font-black">{m.team1?.shortName || "T1"}</span>
                </div>
                <span className="text-sm font-mono font-black text-white">
                  {m.matchScore?.team1Score?.inngs1?.runs || 0}/{m.matchScore?.team1Score?.inngs1?.wickets || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/5 flex items-center justify-center font-black text-xs">{m.team2?.shortName?.[0]}</div>
                  <span className="text-sm font-black">{m.team2?.shortName || "T2"}</span>
                </div>
                <span className="text-sm font-mono font-black text-white">
                  {m.matchScore?.team2Score?.inngs1?.runs || 0}/{m.matchScore?.team2Score?.inngs1?.wickets || 0}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-emerald-400 truncate max-w-[180px]">{m.status}</p>
              <div className="flex -space-x-2">
                 <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-[#0f172a] animate-pulse" />
              </div>
            </div>
          </div>
        )) : (
          <div className="w-full h-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
             <Radio className="text-slate-700 mb-2" size={32} />
             <p className="text-xs font-bold text-slate-500">No live matches in this block</p>
          </div>
        )}
      </div>
    </section>
  );
};

/* ==========================================================
   DASHBOARD MAIN (Grid Layout)
   ========================================================== */
export default function Home() {
  const [data, setData] = useState({ live: [], news: [], series: [] });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [l, n, s] = await Promise.all([getLiveMatches(), getNews(), getSeries()]);
      
      // 🟢 Mapping logic based on your network screenshot
      setData({
        live: l.data?.type || l.data?.matches || (Array.isArray(l.data) ? l.data : []),
        news: n.data?.storyList || (Array.isArray(n.data) ? n.data : []),
        series: s.data?.seriesMap || s.data?.series || (Array.isArray(s.data) ? s.data : [])
      });
    } catch (e) {
      console.error("Dashboard Sync Failed", e);
      setData({ live: [], news: [], series: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(() => {
        getLiveMatches().then(r => {
            if(r.data) setData(prev => ({ ...prev, live: r.data?.type || r.data?.matches || prev.live }));
        });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f]">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <div className="absolute inset-0 blur-xl bg-blue-500/20" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Arena Syncing</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-200 selection:bg-blue-500/30">
      {/* BACKGROUND DECOR */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 py-10">
        
        {/* LIVE MODULE */}
        <LiveHub matches={data.live} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SERIES SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center gap-3">
                  <Trophy size={18} className="text-amber-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Featured Series</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {data.series.slice(0, 8).map((s) => (
                    <Link 
                      to={`/series/${s.id}`} 
                      key={s.id}
                      className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-all group"
                    >
                      <span className="text-xs font-black truncate pr-4 text-slate-400 group-hover:text-blue-400">{s.name}</span>
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1e293b] to-slate-900 rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                 <Target className="absolute -right-4 -bottom-4 text-white/5 scale-[3] group-hover:rotate-12 transition-transform duration-700" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">System Intel</h4>
                 <p className="text-xs font-bold leading-relaxed text-slate-300">Upgrade to Cricsphere Pro for ball-by-ball predictive analytics.</p>
                 <button className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-blue-600/20">Analyze Now</button>
              </div>
            </div>
          </aside>

          {/* MAIN NEWS FEED */}
          <main className="lg:col-span-6 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="h-px flex-1 bg-white/5" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                 <Flame size={16} className="text-orange-500" /> Leading Stories
               </h3>
               <div className="h-px flex-1 bg-white/5" />
            </div>

            {data.news.length > 0 ? data.news.map((n) => (
              <Link
                to={`/news/${n.story?.id}`}
                key={n.story?.id}
                className="group block bg-[#111827]/40 backdrop-blur-sm rounded-3xl border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-white/5 shadow-inner">
                    <img
                      src={n.story?.imageUrl || "/cricsphere-logo.png"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt="Story"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 uppercase">{n.story?.source}</span>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Live Updates</span>
                    </div>
                    <h4 className="text-lg font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                      {n.story?.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed italic">
                       {n.story?.intro || "Real-time coverage from the Cricsphere Intelligence Arena..."}
                    </p>
                  </div>
                </div>
              </Link>
            )) : [1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
          </main>

          {/* RANKING SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 size={18} className="text-indigo-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Global Rankings</h3>
              </div>
              <div className="space-y-6">
                {['India', 'Australia', 'England', 'South Africa'].map((team, i) => (
                  <div key={team} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-slate-700">0{i+1}</span>
                        <span className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">{team}</span>
                      </div>
                      <span className="text-[11px] font-black text-blue-500">12{9-i} pts</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000" style={{ width: `${95 - (i * 10)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/stats" className="block mt-10 pt-4 border-t border-white/5 text-[9px] font-black uppercase text-center text-slate-500 hover:text-blue-500 transition-colors tracking-[0.2em]">
                View World Standings
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}