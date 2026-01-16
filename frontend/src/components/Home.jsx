import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  Loader2,
  Flame,
  BarChart3,
  Zap,
  Target,
  Radio,
  Newspaper,
  CalendarDays,
} from "lucide-react";
import { getLiveMatches, getNews, getSeries } from "../services/api";

/* ==========================================================
   UI: Skeleton
========================================================== */
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-slate-800/50 rounded-2xl border border-white/5 ${className}`}
  />
);

/* ==========================================================
   DATA NORMALIZERS (Safe + Defensive)
========================================================== */

// LIVE MATCHES (RapidAPI Cricbuzz: /matches/v1/live)
const normalizeLiveMatches = (raw) => {
  // Some wrappers you might get depending on your service layer
  const typeMatches = raw?.typeMatches || raw?.data?.typeMatches || null;

  // If already array of matches (your custom backend maybe)
  if (Array.isArray(raw)) return raw;

  // Cricbuzz structure
  const matches =
    typeMatches?.flatMap((tm) =>
      tm?.seriesMatches?.flatMap((sm) => sm?.seriesAdWrapper?.matches || [])
    ) || [];

  return Array.isArray(matches) ? matches : [];
};

// NEWS (RapidAPI Cricbuzz: /news/v1/index)
const normalizeNews = (raw) => {
  const list = raw?.storyList || raw?.data?.storyList || [];
  if (!Array.isArray(list)) return [];

  // Filter only story blocks (ignore ads)
  return list.filter((x) => x?.story?.id);
};

// SERIES (CricAPI cached daily: /series)
const normalizeSeries = (raw) => {
  // CricAPI: res.data.data = []
  const list = raw?.data || raw?.data?.data || raw?.series || raw?.seriesMap || raw;

  if (Array.isArray(list)) return list;

  // Sometimes seriesMap can be object => convert to array
  if (list && typeof list === "object") {
    return Object.values(list).flat();
  }

  return [];
};

/* ==========================================================
   LIVE HUB (Accessible Horizontal Carousel)
========================================================== */
const LiveHub = ({ matches = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const canScroll = matches.length > 0;

  const scrollBy = (dir) => {
    const offset = dir === "left" ? -420 : 420;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const onCardKeyDown = (e, matchId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/match/${matchId}`);
    }
  };

  return (
    <section
      aria-label="Live matches"
      className="relative mb-12"
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <Zap size={18} className="text-red-500 fill-red-500" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
              Live Arena
            </h2>
            <p className="text-[10px] text-slate-500 font-bold">
              Real-time match telemetry
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScroll}
            aria-label="Scroll live matches left"
            className={`p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
              canScroll
                ? "bg-slate-900 border-white/5 hover:bg-slate-800"
                : "bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScroll}
            aria-label="Scroll live matches right"
            className={`p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
              canScroll
                ? "bg-slate-900 border-white/5 hover:bg-slate-800"
                : "bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        role="list"
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x scroll-smooth pb-4 px-1"
      >
        {matches.length > 0 ? (
          matches.map((m, idx) => {
            const info = m?.matchInfo || m;
            const matchId = info?.matchId || m?.matchId || idx;

            const team1 = info?.team1?.shortName || info?.team1?.teamName || "Team 1";
            const team2 = info?.team2?.shortName || info?.team2?.teamName || "Team 2";

            const t1Runs = m?.matchScore?.team1Score?.inngs1?.runs ?? 0;
            const t1Wkts = m?.matchScore?.team1Score?.inngs1?.wickets ?? 0;

            const t2Runs = m?.matchScore?.team2Score?.inngs1?.runs ?? 0;
            const t2Wkts = m?.matchScore?.team2Score?.inngs1?.wickets ?? 0;

            return (
              <div
                key={matchId}
                role="listitem"
                tabIndex={0}
                onClick={() => navigate(`/match/${matchId}`)}
                onKeyDown={(e) => onCardKeyDown(e, matchId)}
                className="snap-start min-w-[320px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                aria-label={`Live match ${team1} vs ${team2}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded uppercase border border-blue-500/20">
                    {info?.matchFormat || "LIVE"}
                  </span>

                  <span className="text-[10px] font-bold text-slate-400 text-right line-clamp-1">
                    {info?.seriesName || "International Fixture"}
                  </span>
                </div>

                <div className="space-y-4 mb-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/5 flex items-center justify-center font-black text-xs">
                        {String(team1).slice(0, 1)}
                      </div>
                      <span className="text-sm font-black text-white">{team1}</span>
                    </div>

                    <span className="text-sm font-mono font-black text-white">
                      {t1Runs}/{t1Wkts}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/5 flex items-center justify-center font-black text-xs">
                        {String(team2).slice(0, 1)}
                      </div>
                      <span className="text-sm font-black text-white">{team2}</span>
                    </div>

                    <span className="text-sm font-mono font-black text-white">
                      {t2Runs}/{t2Wkts}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold text-emerald-400 truncate">
                    {info?.status || "Live match in progress"}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
                      <Radio size={12} /> Live
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full h-44 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] px-4 text-center">
            <Radio className="text-slate-700 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-400">
              No live matches right now
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              Check back soon — the feed updates automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

/* ==========================================================
   HOME PAGE (Best Accessible Layout)
========================================================== */
export default function Home() {
  const [data, setData] = useState({ live: [], news: [], series: [] });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [l, n, s] = await Promise.all([
        getLiveMatches(),
        getNews(),
        getSeries(),
      ]);

      const live = normalizeLiveMatches(l?.data ?? l);
      const news = normalizeNews(n?.data ?? n);
      const series = normalizeSeries(s?.data ?? s);

      setData({ live, news, series });
    } catch (e) {
      console.error("Dashboard Sync Failed", e);
      setData({ live: [], news: [], series: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Live refresh (backend TTL protects quota)
    const interval = setInterval(async () => {
      try {
        const r = await getLiveMatches();
        const live = normalizeLiveMatches(r?.data ?? r);

        setData((prev) => ({
          ...prev,
          live: live.length ? live : prev.live,
        }));
      } catch (e) {
        // silently ignore refresh failures
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const topSeries = useMemo(() => data.series.slice(0, 8), [data.series]);
  const topNews = useMemo(() => data.news.slice(0, 8), [data.news]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f]">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
          <div className="absolute inset-0 blur-xl bg-blue-500/20" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">
          Arena Syncing
        </span>
      </div>
    );
  }

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
          {/* LEFT SIDEBAR: SERIES */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center gap-3">
                  <Trophy size={18} className="text-amber-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
                    Featured Series
                  </h3>
                </div>

                <div className="divide-y divide-white/5">
                  {topSeries.length > 0 ? (
                    topSeries.map((s, idx) => (
                      <Link
                        to={`/series/${s.id || s?.seriesId || idx}`}
                        key={s.id || idx}
                        className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                      >
                        <span className="text-xs font-black truncate pr-4 text-slate-400 group-hover:text-blue-400">
                          {s.name || "Series"}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-slate-700 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    ))
                  ) : (
                    <div className="p-5">
                      <p className="text-[11px] text-slate-500 font-bold">
                        No series available right now.
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  to="/schedules"
                  className="block p-4 border-t border-white/5 text-[10px] font-black uppercase text-center text-slate-500 hover:text-blue-500 transition-colors tracking-[0.2em]"
                >
                  View Full Schedules
                </Link>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-[#1e293b] to-slate-900 rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                <Target className="absolute -right-4 -bottom-4 text-white/5 scale-[3] group-hover:rotate-12 transition-transform duration-700" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
                  System Intel
                </h4>
                <p className="text-xs font-bold leading-relaxed text-slate-300">
                  Unlock advanced analytics like player form, match predictions,
                  and momentum tracking.
                </p>

                <Link to="/stats">
                  <button className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500/60">
                    Analyze Now
                  </button>
                </Link>
              </div>
            </div>
          </aside>

          {/* MAIN: NEWS FEED */}
          <main className="lg:col-span-6 space-y-8" aria-label="News feed">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px flex-1 bg-white/5" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                Leading Stories
              </h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {topNews.length > 0 ? (
              topNews.map((n) => {
                const story = n?.story;
                const id = story?.id;

                return (
                  <Link
                    to={id ? `/news/${id}` : "/news"}
                    key={id || Math.random()}
                    className="group block bg-[#111827]/40 backdrop-blur-sm rounded-3xl border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-white/5 shadow-inner bg-black/20">
                        <img
                          src={story?.imageUrl || "/cricsphere-logo.png"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt={story?.title || "News story"}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[9px] font-black px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 uppercase">
                            {story?.source || "CricSphere"}
                          </span>

                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Newspaper size={12} className="opacity-70" />
                            Live Updates
                          </span>
                        </div>

                        <h4 className="text-lg font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                          {story?.title || "Latest cricket update"}
                        </h4>

                        <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed italic">
                          {story?.intro ||
                            "Real-time coverage from the CricSphere Intelligence Arena..."}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </>
            )}

            <Link
              to="/news"
              className="block text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-500 transition-colors pt-4"
            >
              View More Stories
            </Link>
          </main>

          {/* RIGHT SIDEBAR: RANKINGS QUICK ACCESS */}
          <aside className="lg:col-span-3">
            <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} className="text-indigo-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
                    Global Rankings
                  </h3>
                </div>

                <span className="text-[9px] font-black uppercase text-slate-500 bg-white/5 border border-white/10 px-2 py-1 rounded-full flex items-center gap-2">
                  <CalendarDays size={12} />
                  Weekly
                </span>
              </div>

              {/* This is still placeholder data, but now it’s clearly a shortcut */}
              <div className="space-y-6">
                {["India", "Australia", "England", "South Africa"].map((team, i) => (
                  <div
                    key={team}
                    className="group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Ranking preview ${team}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-slate-700">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">
                          {team}
                        </span>
                      </div>

                      <span className="text-[11px] font-black text-blue-500">
                        12{9 - i} pts
                      </span>
                    </div>

                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000"
                        style={{ width: `${95 - i * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/stats"
                className="block mt-10 pt-4 border-t border-white/5 text-[9px] font-black uppercase text-center text-slate-500 hover:text-blue-500 transition-colors tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              >
                View World Standings
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
