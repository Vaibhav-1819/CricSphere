import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, Clock, ChevronRight,
  LayoutGrid, List, Newspaper, Flame, Info, Loader2
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
      s.intro || s.description || "Intelligence briefing available in full report.",
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
    api.get("/api/v1/cricket/news")
      .then(res => {
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
      .filter(item => item.story) 
      .map(normalize)
      .filter(item => {
        const isSaved = bookmarks.includes(item.id);
        const matchTab = activeTab === "All" || (activeTab === "Saved" && isSaved);
        const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
      });
  }, [data, activeTab, search, bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper size={18} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Global Intel Feed</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              News <span className="text-blue-600">Hub.</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search headlines..."
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-400"}`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-400"}`}>
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Saved"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-blue-400"
              }`}
            >
              {tab === "Saved" ? `Saved Intel (${bookmarks.length})` : tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className={`lg:col-span-8 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-6'}`}>
            {loading ? (
              [...Array(4)].map((_, i) => <NewsSkeleton key={i} viewMode={viewMode} />)
            ) : (
              <AnimatePresence mode="popLayout">
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
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-8">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] mb-6 flex items-center gap-2 text-slate-900">
                <Flame size={16} className="text-orange-500" /> Trending Analysis
              </h3>
              <div className="space-y-4">
                {["Champions Trophy 2025", "WTC Standings", "IPL Retention Hub"].map(t => (
                  <div key={t} className="flex justify-between items-center group cursor-pointer p-3 hover:bg-slate-50 rounded-xl transition-all">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">#{t.replace(/\s/g, '')}</span>
                    <ChevronRight size={14} className="text-slate-300" />
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

const NewsItem = ({ data, viewMode, isBookmarked, onBookmark }) => {
  const isList = viewMode === "list";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-100 group ${isList ? "flex h-56" : "block"}`}
    >
      <div className={`overflow-hidden relative ${isList ? "w-64 h-full" : "w-full h-48"}`}>
        {/* ✅ Fix 2: Add fallback when image fails using onError */}
        <img 
          src={data.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt="" 
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/600x400?text=Cricsphere+News";
          }}
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{data.source}</span>
          <button onClick={() => onBookmark()} className={`transition-colors ${isBookmarked ? "text-blue-600" : "text-slate-300 hover:text-blue-400"}`}>
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        <h3 className="text-sm font-black text-slate-900 line-clamp-2 leading-tight mb-2 uppercase group-hover:text-blue-600 transition-colors">
          {data.title}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 font-medium mb-4">{data.description}</p>
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
            <Clock size={12} /> {new Date(data.publishedAt).toLocaleDateString()}
          </span>
          <a href={data.url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Read More</a>
        </div>
      </div>
    </motion.div>
  );
};

const NewsSkeleton = ({ viewMode }) => (
  <div className={`bg-white rounded-[2rem] border border-slate-100 animate-pulse ${viewMode === 'list' ? 'h-56 flex' : 'h-80'}`}>
    <div className={`${viewMode === 'list' ? 'w-64' : 'w-full h-40'} bg-slate-100`} />
    <div className="p-6 flex-1 space-y-4">
      <div className="w-20 h-2 bg-slate-100 rounded" />
      <div className="w-full h-8 bg-slate-100 rounded" />
      <div className="w-full h-12 bg-slate-100 rounded" />
    </div>
  </div>
);

const ErrorState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
    <Info className="text-slate-300 mb-4" size={48} />
    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Connection Interrupted</h2>
    <p className="text-slate-400 text-sm">The news uplink is currently unavailable.</p>
  </div>
);