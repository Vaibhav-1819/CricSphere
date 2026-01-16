import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  Loader2,
  Flame,
  BarChart3,
  Radio,
  Newspaper,
  CalendarDays,
  Target,
} from "lucide-react";
import { getLiveMatches, getNews, getSeries } from "../services/api";

/* ==========================================================
   UI: Skeleton
========================================================== */
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/10 ${className}`}
  />
);

/* ==========================================================
   DATA NORMALIZERS (Safe + Defensive)
========================================================== */
const normalizeLiveMatches = (raw) => {
  const typeMatches = raw?.typeMatches || raw?.data?.typeMatches || null;
  if (Array.isArray(raw)) return raw;

  const matches =
    typeMatches?.flatMap((tm) =>
      tm?.seriesMatches?.flatMap((sm) => sm?.seriesAdWrapper?.matches || [])
    ) || [];

  return Array.isArray(matches) ? matches : [];
};

const normalizeNews = (raw) => {
  const list = raw?.storyList || raw?.data?.storyList || [];
  if (!Array.isArray(list)) return [];
  return list.filter((x) => x?.story?.id);
};

const normalizeSeries = (raw) => {
  const list = raw?.data || raw?.data?.data || raw?.series || raw?.seriesMap || raw;
  if (Array.isArray(list)) return list;

  if (list && typeof list === "object") {
    return Object.values(list).flat();
  }

  return [];
};

/* ==========================================================
   LIVE MATCH HELPERS
========================================================== */
const getMatchStatusRank = (match) => {
  const info = match?.matchInfo || match;
  const status = String(info?.status || "").toLowerCase();

  // ongoing first
  if (
    status.includes("live") ||
    status.includes("in progress") ||
    status.includes("stumps") ||
    status.includes("innings") ||
    status.includes("day")
  )
    return 0;

  // scheduled/preview next
  if (status.includes("starts") || status.includes("toss") || status.includes("scheduled"))
    return 1;

  // completed last (go right)
  if (
    status.includes("won") ||
    status.includes("match ended") ||
    status.includes("completed") ||
    status.includes("result")
  )
    return 2;

  return 1;
};

const sortLiveMatchesSmart = (matches = []) => {
  return [...matches].sort((a, b) => {
    const ra = getMatchStatusRank(a);
    const rb = getMatchStatusRank(b);
    if (ra !== rb) return ra - rb;

    // Secondary sort: newer first if possible
    const aId = (a?.matchInfo?.matchId || a?.matchId || 0) * 1;
    const bId = (b?.matchInfo?.matchId || b?.matchId || 0) * 1;
    return bId - aId;
  });
};

/* ==========================================================
   LIVE HUB (Compact Cricbuzz-like Strip)
========================================================== */
const LiveHub = ({ matches = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const sorted = useMemo(() => sortLiveMatchesSmart(matches), [matches]);
  const canScroll = sorted.length > 0;

  const scrollBy = (dir) => {
    const offset = dir === "left" ? -320 : 320;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const onCardKeyDown = (e, matchId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/match/${matchId}`);
    }
  };

  return (
    <section aria-label="Live matches" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Radio size={16} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Live Now
            </h2>
            <p className="text-[11px] font-medium text-slate-500">
              Ongoing matches shown first
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScroll}
            aria-label="Scroll left"
            className={`p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              canScroll
                ? "bg-white dark:bg-[#0b0f16] border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScroll}
            aria-label="Scroll right"
            className={`p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              canScroll
                ? "bg-white dark:bg-[#0b0f16] border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        role="list"
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {sorted.length > 0 ? (
          sorted.map((m, idx) => {
            const info = m?.matchInfo || m;
            const matchId = info?.matchId || m?.matchId || idx;

            const team1 =
              info?.team1?.shortName || info?.team1?.teamName || "Team 1";
            const team2 =
              info?.team2?.shortName || info?.team2?.teamName || "Team 2";

            const t1Runs = m?.matchScore?.team1Score?.inngs1?.runs ?? "-";
            const t1Wkts = m?.matchScore?.team1Score?.inngs1?.wickets ?? "-";

            const t2Runs = m?.matchScore?.team2Score?.inngs1?.runs ?? "-";
            const t2Wkts = m?.matchScore?.team2Score?.inngs1?.wickets ?? "-";

            const status = info?.status || "Match update unavailable";
            const rank = getMatchStatusRank(m);

            const pill =
              rank === 0
                ? "LIVE"
                : rank === 2
                ? "RESULT"
                : "UPCOMING";

            return (
              <div
                key={matchId}
                role="listitem"
                tabIndex={0}
                onClick={() => navigate(`/match/${matchId}`)}
                onKeyDown={(e) => onCardKeyDown(e, matchId)}
                className="min-w-[260px] max-w-[260px] bg-white dark:bg-[#0b0f16] border border-black/10 dark:border-white/10 rounded-2xl p-4 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={`Match ${team1} vs ${team2}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                    {info?.seriesName || "Series"}
                  </span>

                  <span
                    className={`text-[9px] font-extrabold px-2 py-1 rounded-full border uppercase tracking-wide ${
                      pill === "LIVE"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : pill === "RESULT"
                        ? "bg-slate-500/10 text-slate-600 border-slate-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    {pill}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {team1}
                    </span>
                    <span className="text-sm font-mono font-extrabold text-slate-900 dark:text-white">
                      {t1Runs}/{t1Wkts}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {team2}
                    </span>
                    <span className="text-sm font-mono font-extrabold text-slate-900 dark:text-white">
                      {t2Runs}/{t2Wkts}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                  {status}
                </p>
              </div>
            );
          })
        ) : (
          <div className="w-full h-28 flex items-center justify-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-slate-500">
              No live matches right now
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

/* ==========================================================
   HOME PAGE (Cricbuzz-style)
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

    const interval = setInterval(async () => {
      try {
        const r = await getLiveMatches();
        const live = normalizeLiveMatches(r?.data ?? r);

        setData((prev) => ({
          ...prev,
          live: live.length ? live : prev.live,
        }));
      } catch (e) {}
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const topSeries = useMemo(() => data.series.slice(0, 8), [data.series]);
  const topNews = useMemo(() => data.news.slice(0, 8), [data.news]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#05070c]">
        <Loader2 className="animate-spin text-blue-500 mb-3" size={44} />
        <span className="text-[11px] font-bold text-slate-500">
          Syncing CricSphere...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-200">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-8">
        {/* LIVE */}
        <LiveHub matches={data.live} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: SERIES */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white dark:bg-[#0b0f16] rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
                  <Trophy size={18} className="text-amber-500" />
                  <h3 className="text-[12px] font-extrabold tracking-wide">
                    Featured Series
                  </h3>
                </div>

                <div className="divide-y divide-black/10 dark:divide-white/10">
                  {topSeries.length > 0 ? (
                    topSeries.map((s, idx) => (
                      <Link
                        to={`/series/${s.id || s?.seriesId || idx}`}
                        key={s.id || idx}
                        className="flex items-center justify-between p-4 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all"
                      >
                        <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 truncate pr-3">
                          {s.name || "Series"}
                        </span>
                        <ChevronRight size={16} className="text-slate-400" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-[12px] text-slate-500">
                      No series available.
                    </div>
                  )}
                </div>

                <Link
                  to="/schedules"
                  className="block p-4 border-t border-black/10 dark:border-white/10 text-[11px] font-extrabold uppercase text-center text-slate-500 hover:text-blue-500"
                >
                  View Full Schedules
                </Link>
              </div>

              {/* PREMIUM CTA */}
              <div className="bg-white dark:bg-[#0b0f16] rounded-3xl border border-black/10 dark:border-white/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Target size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-extrabold">
                      Premium Analytics
                    </h4>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                      Player form, match momentum, smart insights and predictions.
                    </p>
                  </div>
                </div>

                <Link to="/premium">
                  <button className="mt-4 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-wide transition-all">
                    Analyze Now
                  </button>
                </Link>
              </div>
            </div>
          </aside>

          {/* CENTER: NEWS */}
          <main className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Flame size={18} className="text-orange-500" />
                Latest News
              </h3>

              <Link
                to="/news"
                className="text-[12px] font-semibold text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>

            {topNews.length > 0 ? (
              topNews.map((n) => {
                const story = n?.story;
                const id = story?.id;

                return (
                  <Link
                    to={id ? `/news/${id}` : "/news"}
                    key={id || Math.random()}
                    className="block bg-white dark:bg-[#0b0f16] rounded-3xl border border-black/10 dark:border-white/10 hover:border-blue-500/40 transition-all overflow-hidden"
                  >
                    <div className="flex gap-4 p-5">
                      <div className="w-24 h-20 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex-shrink-0">
                        <img
                          src={story?.imageUrl || "/cricsphere-logo.png"}
                          className="w-full h-full object-cover"
                          alt={story?.title || "News story"}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            {story?.source || "CricSphere"}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <Newspaper size={12} />
                            Updates
                          </span>
                        </div>

                        <h4 className="text-[15px] font-extrabold leading-snug">
                          {story?.title || "Latest cricket update"}
                        </h4>

                        <p className="text-[12px] text-slate-500 mt-1 line-clamp-2">
                          {story?.intro || "Tap to read full story..."}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </>
            )}
          </main>

          {/* RIGHT: RANKINGS */}
          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-[#0b0f16] rounded-3xl border border-black/10 dark:border-white/10 p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-500" />
                  <h3 className="text-sm font-extrabold">Rankings</h3>
                </div>

                <span className="text-[10px] font-bold text-slate-500 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-full flex items-center gap-2">
                  <CalendarDays size={12} />
                  Weekly
                </span>
              </div>

              <div className="space-y-4">
                {["India", "Australia", "England", "South Africa"].map((team, i) => (
                  <div key={team} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-extrabold text-slate-400">
                        {i + 1}
                      </span>
                      <span className="text-[13px] font-semibold">{team}</span>
                    </div>

                    <span className="text-[12px] font-extrabold text-blue-600">
                      12{9 - i} pts
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/stats"
                className="block mt-6 pt-4 border-t border-black/10 dark:border-white/10 text-[11px] font-extrabold uppercase text-center text-slate-500 hover:text-blue-500"
              >
                View Full Rankings
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
