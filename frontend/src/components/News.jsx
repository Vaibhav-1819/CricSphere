import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bookmark,
  Clock,
  ChevronRight,
  LayoutGrid,
  List,
  Newspaper,
  Flame,
  Info,
} from "lucide-react";
import api from "../services/api";

/* ---------------- 🧠 NORMALIZATION ENGINE ---------------- */
/**
 * ✅ Fix 1 & 3: Cricbuzz official image pattern (NO .jpg) and safe imageId check
 */
const normalize = (n) => {
  const s = n.story || n;

  // Safe check for imageId
  const imageId = s.imageId || null;

  // Construct URL without .jpg as per best practices for Cricbuzz v1 API
  const imageUrl = imageId
    ? `https://www.cricbuzz.com/a/img/v1/600x400/i1/${imageId}`
    : "https://via.placeholder.com/600x400?text=Cricsphere+News";

  return {
    id: s.id || s.storyId,
    title: s.hline || s.title,
    description:
      s.intro ||
      s.description ||
      "Intelligence briefing available in full report.",
    imageUrl,
    source: s.source || "International Feed",
    publishedAt: s.pubTime || Date.now(),
    url: s.id ? `https://www.cricbuzz.com/cricket-news/${s.id}` : "#",
  };
};

export default function News() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("news_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/v1/cricket/news")
      .then((res) => {
        setData(res.data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("news_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const processedNews = useMemo(() => {
    const list = data?.storyList || [];
    return list
      .filter((item) => item.story)
      .map(normalize)
      .filter((item) => {
        const isSaved = bookmarks.includes(item.id);
        const matchTab =
          activeTab === "All" || (activeTab === "Saved" && isSaved);
        const matchSearch = item.title
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return matchTab && matchSearch;
      });
  }, [data, activeTab, search, bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-600/10 dark:border-blue-500/20">
                <Newspaper size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Global News Feed
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              News <span className="text-blue-600 dark:text-blue-500">Hub</span>
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Latest cricket headlines, saved stories, and quick reads — all in
              one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                placeholder="Search headlines..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#080a0f] focus:ring-2 focus:ring-blue-500/40 outline-none transition-all text-sm shadow-sm"
              />
            </div>

            <div className="flex bg-white dark:bg-[#080a0f] p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm w-fit">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* TABS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-white dark:bg-[#080a0f] text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:border-blue-500/40"
              }`}
            >
              {tab === "Saved" ? `Saved (${bookmarks.length})` : tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* FEED */}
          <div
            className={`lg:col-span-8 ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-5"
            }`}
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <NewsSkeleton key={i} viewMode={viewMode} />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {processedNews.map((item) => (
                  <NewsItem
                    key={item.id}
                    data={item}
                    viewMode={viewMode}
                    isBookmarked={bookmarks.includes(item.id)}
                    onBookmark={() => toggleBookmark(item.id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="bg-white dark:bg-[#080a0f] rounded-3xl p-7 border border-black/10 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/40 sticky top-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.18em] mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <Flame size={16} className="text-orange-500" /> Trending
              </h3>

              <div className="space-y-2">
                {[
                  "Champions Trophy 2025",
                  "WTC Standings",
                  "IPL Retention Hub",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex justify-between items-center group cursor-pointer p-3 rounded-2xl transition-all hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                      #{t.replace(/\s/g, "")}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-7 pt-6 border-t border-black/10 dark:border-white/10">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tip: Use <span className="font-bold">Saved</span> tab to track
                  your bookmarked headlines.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const NewsItem = ({ data, viewMode, isBookmarked, onBookmark }) => {
  const isList = viewMode === "list";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`group bg-white dark:bg-[#080a0f] rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:border-blue-500/40 shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 ${
        isList ? "flex h-56" : "block"
      }`}
    >
      <div
        className={`overflow-hidden relative ${
          isList ? "w-64 h-full" : "w-full h-48"
        }`}
      >
        {/* ✅ Fix 2: Add fallback when image fails using onError */}
        <img
          src={data.imageUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt=""
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/600x400?text=Cricsphere+News";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-70" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest">
            {data.source}
          </span>

          <button
            onClick={() => onBookmark()}
            className={`transition-colors p-2 rounded-xl border ${
              isBookmarked
                ? "text-blue-600 dark:text-blue-500 border-blue-600/20 bg-blue-600/10"
                : "text-slate-400 dark:text-slate-500 border-black/10 dark:border-white/10 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors uppercase tracking-tight">
          {data.title}
        </h3>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 font-medium mb-4">
          {data.description}
        </p>

        <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock size={12} /> {new Date(data.publishedAt).toLocaleDateString()}
          </span>

          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest hover:underline"
          >
            Read More
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const NewsSkeleton = ({ viewMode }) => (
  <div
    className={`bg-white dark:bg-[#080a0f] rounded-3xl border border-black/10 dark:border-white/10 animate-pulse overflow-hidden shadow-sm ${
      viewMode === "list" ? "h-56 flex" : "h-80"
    }`}
  >
    <div
      className={`${
        viewMode === "list" ? "w-64 h-full" : "w-full h-44"
      } bg-slate-100 dark:bg-white/5`}
    />
    <div className="p-6 flex-1 space-y-4">
      <div className="w-24 h-2.5 bg-slate-100 dark:bg-white/10 rounded" />
      <div className="w-full h-8 bg-slate-100 dark:bg-white/10 rounded" />
      <div className="w-full h-12 bg-slate-100 dark:bg-white/10 rounded" />
      <div className="w-28 h-2.5 bg-slate-100 dark:bg-white/10 rounded" />
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#05070c] px-6 text-center">
    <Info className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
      Unable to Load News
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md">
      The news feed is currently unavailable. Please try again in a moment.
    </p>
  </div>
);
