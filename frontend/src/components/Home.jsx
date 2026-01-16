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
          <button onClick={() => scroll('left')} className="p-1 hover:bg-white/5 rounded"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll('right')} className="p-1 hover:bg-white/5 rounded"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex gap-3 overflow-x-auto no-scrollbar snap-x scroll-smooth pb-2"
      >
        {matches.map((m) => {
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
        })}
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
      setData({
        live: l.data || [],
        news: n.data.storyList || [],
        series: s.data || []
      });
    } catch (e) {
      console.error("Dashboard Sync Failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const ticker = setInterval(() => {
      getLiveMatches().then(r => setData(prev => ({ ...prev, live: r.data || [] })));
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
        
        {/* TOP ROW: LIVE HUB */}
        <LiveHub matches={data.live} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: SERIES NAV (Cricbuzz Style) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest">Featured Series</h3>
              </div>
              <div className="divide-y divide-white/5">
                {data.series.slice(0, 10).map((s) => (
                  <Link 
                    to={`/series/${s.id}`} 
                    key={s.id}
                    className="flex items-center justify-between p-4 hover:bg-blue-600/10 transition-colors group"
                  >
                    <span className="text-xs font-bold truncate pr-4 group-hover:text-blue-400">{s.name}</span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400" />
                  </Link>
                ))}
              </div>
              <Link to="/schedules" className="block p-3 text-center text-[10px] font-black uppercase text-blue-500 hover:bg-blue-600/5">
                View All Series
              </Link>
            </div>
          </aside>

          {/* CENTER COLUMN: NEWS FEED */}
          <main className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Flame size={16} className="text-orange-500" /> Leading Stories
              </h3>
            </div>

            {data.news.map((n) => (
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
                    <span className="text-[9px] text-slate-600">•</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm md:text-base font-black leading-tight line-clamp-2 group-hover:text-blue-400">
                    {n.story?.title}
                  </h4>
                </div>
              </Link>
            ))}
          </main>

          {/* RIGHT COLUMN: QUICK STATS & TOOLS */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#111827] rounded-2xl border border-white/5 p-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6">
                <BarChart3 size={16} className="text-blue-500" /> Quick Ranking
              </h3>
              <div className="space-y-4">
                {['India', 'Australia', 'England', 'South Africa'].map((team, i) => (
                  <div key={team} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-700">0{i+1}</span>
                      <span className="text-xs font-bold">{team}</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-500">12{8-i}</span>
                  </div>
                ))}
              </div>
              <Link to="/stats" className="block mt-6 pt-4 border-t border-white/5 text-[10px] font-black uppercase text-center text-slate-500 hover:text-white">
                Full ICC Rankings
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
              <h4 className="text-xs font-black uppercase mb-1">CricSphere Premium</h4>
              <p className="text-[10px] opacity-80 mb-4 font-medium leading-relaxed">
                Get ball-by-ball telemetry and advanced MIS player reports.
              </p>
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-[10px] font-black uppercase shadow-lg">
                Upgrade Now
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}