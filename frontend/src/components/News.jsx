import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, Clock, ChevronRight, TrendingUp,
  LayoutGrid, List, Newspaper, ExternalLink
} from "lucide-react";
import useFetch from "../hooks/useFetch";

/* ===================== */

const normalize = (n) => {
  // Works with both backend-normalized & raw Cricbuzz
  const s = n.story || n;

  return {
    id: s.id,
    title: s.title || s.hline,
    description: s.description || s.intro,
    imageUrl: s.imageUrl || (s.imageId ? `https://www.cricbuzz.com/a/img/v1/600x400/i1/${s.imageId}.jpg` : null),
    source: s.source || "Cricbuzz",
    publishedAt: s.publishedAt || s.pubTime,
    url: s.url || `https://www.cricbuzz.com/cricket-news/${s.id}`
  };
};

export default function News() {
  const { data, loading } = useFetch("/api/v1/cricket/news");

  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  const articles = (data?.data || []).map(normalize);

  const processedNews = useMemo(() => {
    return articles.filter(item => {
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Saved" && bookmarks.includes(item.id));

      const matchSearch =
        item.title?.toLowerCase().includes(search.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [articles, activeTab, search, bookmarks]);

  const toggleBookmark = id => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                World Cricket News
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
              Latest <span className="text-blue-600">Feed</span>
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                placeholder="Search headlines..."
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm"
              />
            </div>

            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border">
              <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode==="grid" && "bg-blue-600 text-white"} rounded-lg`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode==="list" && "bg-blue-600 text-white"} rounded-lg`}>
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {["All", "Saved"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-xs font-bold ${
                activeTab === tab ? "bg-slate-900 text-white" : "bg-white"
              }`}
            >
              {tab === "Saved" ? `Bookmarks (${bookmarks.length})` : tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {loading && <p className="text-slate-400">Loading news...</p>}
            <AnimatePresence>
              {processedNews.map(item => (
                <NewsItem
                  key={item.id}
                  data={item}
                  viewMode={viewMode}
                  isBookmarked={bookmarks.includes(item.id)}
                  onBookmark={() => toggleBookmark(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          <aside className="hidden lg:block">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-black mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" /> Trending
              </h3>
              {["#IPL2026", "#Kohli", "#WTCFinal"].map(t => (
                <div key={t} className="flex justify-between py-2 cursor-pointer hover:text-blue-600">
                  {t} <ChevronRight size={14} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ===================== */

const NewsItem = ({ data, viewMode, isBookmarked, onBookmark }) => {
  const isList = viewMode === "list";

  return (
    <motion.div layout className={`bg-white dark:bg-slate-800 rounded-3xl border overflow-hidden ${isList ? "flex" : "block"}`}>
      {data.imageUrl && (
        <img src={data.imageUrl} className={`object-cover ${isList ? "w-72 h-full" : "w-full h-52"}`} />
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between">
          <div className="text-xs font-bold text-blue-600">{data.source}</div>
          <button onClick={onBookmark}>
            <Bookmark fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
          {data.title}
        </h3>

        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {data.description}
        </p>

        <div className="mt-auto flex justify-between pt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={12}/> {new Date(Number(data.publishedAt)).toLocaleDateString()}
          </span>
          <a href={data.url} target="_blank" className="text-blue-600 flex gap-1">
            Read <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
