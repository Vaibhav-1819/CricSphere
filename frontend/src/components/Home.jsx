import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Radio,
  Trophy,
  TrendingUp,
  Loader2,
  Flame,
  Calendar
} from "lucide-react";
import {
  getLiveMatches,
  getNews,
  getSeries
} from "../services/api";

/* =========================
   Match State
========================= */
const isLive = (status = "") => {
  const s = status.toLowerCase();
  return (
    s.includes("need") ||
    s.includes("trail") ||
    s.includes("lead") ||
    s.includes("opt") ||
    s.includes("chose") ||
    s.includes("live")
  );
};

/* =========================
   LIVE TICKER STRIP
========================= */
const LiveTicker = ({ matches, loading }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" });
  };

  if (loading)
    return <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse m-4 rounded-2xl" />;

  return (
    <div className="bg-white dark:bg-[#0b1220] border-b border-slate-200 dark:border-white/5 py-6 sticky top-0 z-30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between mb-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
            <Radio className="text-red-500 animate-pulse" size={14} />
            Live Now
          </h3>
          <Link to="/live" className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-1">
            Match Center <ChevronRight size={14} />
          </Link>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar snap-x">
          {matches.map((m) => {
            const t1 = m.team1?.teamName;
            const t2 = m.team2?.teamName;
            const s1 = m.matchScore?.team1Score?.inngs1;
            const s2 = m.matchScore?.team2Score?.inngs1;

            return (
              <div
                key={m.matchId}
                onClick={() => navigate(`/match/${m.matchId}`)}
                className="snap-start min-w-[300px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-5 cursor-pointer hover:shadow-xl hover:border-blue-500/30 transition-all"
              >
                <div className="flex justify-between mb-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>{m.matchFormat}</span>
                  {isLive(m.status) && (
                    <span className="text-red-500 flex items-center gap-1 animate-pulse">
                      <Radio size={10} /> LIVE
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold">{t1}</span>
                    <span className="font-mono font-black">
                      {s1 ? `${s1.runs}/${s1.wickets}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{t2}</span>
                    <span className="font-mono font-black">
                      {s2 ? `${s2.runs}/${s2.wickets}` : "-"}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] mt-3 font-bold text-blue-500 truncate">
                  {m.status}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================
   HOME
========================= */
export default function Home() {
  const [live, setLive] = useState([]);
  const [news, setNews] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [l, n, s] = await Promise.all([
          getLiveMatches(),
          getNews(),
          getSeries()
        ]);

        setLive(l.data || []);
        setNews(n.data.storyList || []);
        setSeries(s.data || []);
      } catch (e) {
        console.error("Home load failed", e);
      } finally {
        setLoading(false);
      }
    };

    load();

    const timer = setInterval(() => {
      getLiveMatches().then((r) => setLive(r.data || []));
    }, 120000);

    return () => clearInterval(timer);
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#080a0f]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080a0f] pb-20">

      <LiveTicker matches={live} loading={loading} />

      <div className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* 🔥 FEATURED NEWS */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Top Stories
            </h3>
          </div>

          {news.slice(0, 6).map((n) => (
            <Link
              to={`/news/${n.story?.id}`}
              key={n.story?.id}
              className="group flex gap-6 bg-white dark:bg-[#111827] p-5 rounded-[1.5rem] border border-slate-200 dark:border-white/5 hover:shadow-xl transition"
            >
              <img
                src={n.story?.imageUrl}
                className="w-40 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform"
              />
              <div>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
                  {n.story?.source}
                </p>
                <h4 className="text-lg font-black dark:text-white group-hover:text-blue-500 transition">
                  {n.story?.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>

        {/* 🏆 SERIES SPOTLIGHT */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
              <Trophy size={14} className="text-amber-500" />
              Ongoing Series
            </h3>

            <div className="space-y-4">
              {series.slice(0, 8).map((s) => (
                <Link
                  to={`/series/${s.id}`}
                  key={s.id}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  <span className="font-bold dark:text-white">{s.name}</span>
                  <span className="text-xs font-black text-blue-500">
                    {s.matches || (s.t20 + s.odi + s.test)} Matches
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
