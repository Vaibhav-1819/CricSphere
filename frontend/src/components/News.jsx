import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, Clock, ChevronRight,
  LayoutGrid, List, Newspaper, ExternalLink, Flame, Info
} from "lucide-react";
import useFetch from "../hooks/useFetch";

/* ---------------- 🧠 NORMALIZATION ENGINE ---------------- */
// Ensures that data from various providers (Cricbuzz, custom, etc.) follows one schema
const normalize = (n) => {
  const s = n.story || n;
  
  // Cricbuzz often uses milliseconds for timestamps, ensure we handle both
  const rawTime = s.publishedAt || s.pubTime || Date.now();
  const timeStamp = String(rawTime).length === 10 ? rawTime * 1000 : rawTime;

  return {
    id: s.id || s.storyId,
    title: s.title || s.hline,
    description: s.description || s.intro || "No description available for this briefing.",
    imageUrl: s.imageUrl || (s.imageId ? `https://www.cricbuzz.com/a/img/v1/600x400/i1/${s.imageId}.jpg` : "/placeholder-news.jpg"),
    source: s.source || "Global Intel",
    publishedAt: timeStamp,
    url: s.url || `https://www.cricbuzz.com/cricket-news/${s.id}`
  };
};

/* ---------------- 🏛️ MAIN COMPONENT ---------------- */

export default function News() {
  const { data, loading, error } = useFetch("/api/v1/cricket/news");

  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("news_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("news_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const articles = useMemo(() => {
    const list = data?.data || data?.stories || [];
    return list.map(normalize);
  }, [data]);

  const processedNews = useMemo(() => {
    return articles.filter(item => {
      const isSaved = bookmarks.includes(item.id);
      const matchTab = activeTab === "All" || (activeTab === "Saved" && isSaved);
      const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || 
                          item.description?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [articles, activeTab, search, bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080a0f]">
      <div className="text-center p-12 bg-red-500/5 border border-red-500/20 rounded-[3rem]">
        <Info className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-black uppercase italic text-white">Intel Uplink Failed</h2>
        <p className="text-slate-500 text-sm mt-2">The news server is currently unreachable.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080a0f] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* 🟢 HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                <Newspaper size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Global Briefing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Cricket <span className="text-blue-500">Feed</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Search intel..."
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/5 bg-[#111827] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex bg-[#111827] p-1 rounded-2xl border border-white/5">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"}`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"}`}>
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* 🔵 TABS */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Saved"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-white text-black" : "bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10"
              }`}
            >
              {tab === "Saved" ? `Bookmarks (${bookmarks.length})` : tab}
            </button>
          ))}
        </div>

        {/* 🟠 MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className={`lg:col-span-8 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
            <AnimatePresence mode="popLayout">
              {loading ? (
                [...Array(6)].map((_, i) => <NewsSkeleton key={i} viewMode={viewMode} />)
              ) : (
                processedNews.map(item => (
                  <NewsItem
                    key={item.id}
                    data={item}
                    viewMode={viewMode}
                    isBookmarked={bookmarks.includes(item.id)}
                    onBookmark={() => toggleBookmark(item.id)}
                  />
                ))
              )}
            </AnimatePresence>
            {!loading && processedNews.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center">
                <div className="inline-flex p-6 rounded-full bg-white/5 mb-4 text-slate-700">
                  <Bookmark size={48} strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-black uppercase text-slate-700">Zero Intel Matches</h2>
                <p className="text-slate-600 text-sm mt-2">Try adjusting your filters or search keywords.</p>
              </motion.div>
            )}
          </div>

          {/* 🟣 SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="bg-[#111a2e] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl sticky top-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-slate-400">
                <Flame size={18} className="text-orange-500" /> Trending Topics
              </h3>
              <div className="space-y-5">
                {["#IPL2026", "#KohliStats", "#WTCFinal", "#BGT2026", "#ChampionsTrophy"].map(t => (
                  <div key={t} className="flex justify-between items-center group cursor-pointer">
                    <span className="text-sm font-bold text-slate-500 group-hover:text-blue-500 transition-colors">{t}</span>
                    <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-blue-600 transition-all">
                      <ChevronRight size={14} className="group-hover:text-white" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10">
                 <h4 className="text-[10px] font-black uppercase text-blue-500 mb-2">Editor's Note</h4>
                 <p className="text-xs text-slate-400 leading-relaxed italic">"The transition to the 2026 season marks a massive shift in player telemetry tracking..."</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 🃏 ITEM CARD ---------------- */

const NewsItem = ({ data, viewMode, isBookmarked, onBookmark }) => {
  const isList = viewMode === "list";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className={`bg-[#111827] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-blue-500/30 group ${isList ? "flex flex-col md:flex-row h-auto md:h-64" : "block h-full"}`}
    >
      <div className={`overflow-hidden relative ${isList ? "w-full md:w-80 flex-shrink-0" : "w-full h-52"}`}>
        <img 
          src={data.imageUrl} 
          alt={data.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-60 md:hidden" />
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10">
            {data.source}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); onBookmark(); }} 
            className={`transition-all duration-300 ${isBookmarked ? "text-blue-500 scale-125" : "text-slate-600 hover:text-blue-400"}`}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors line-clamp-2 uppercase tracking-tighter leading-tight mb-3">
          {data.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed mb-4">
          {data.description}
        </p>

        <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            <Clock size={12} className="text-blue-500/50"/> {new Date(data.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <a 
            href={data.url} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition-all"
          >
            Read <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const NewsSkeleton = ({ viewMode }) => (
  <div className={`bg-white/5 rounded-[2rem] animate-pulse border border-white/5 ${viewMode === 'list' ? 'h-64 flex' : 'h-96 block'}`}>
    <div className={`${viewMode === 'list' ? 'w-80 h-full' : 'w-full h-52'} bg-white/10`} />
    <div className="p-8 flex-1 space-y-4">
      <div className="w-20 h-3 bg-white/10 rounded-full" />
      <div className="w-full h-10 bg-white/10 rounded-lg" />
      <div className="w-2/3 h-4 bg-white/10 rounded-lg" />
      <div className="mt-auto w-full h-10 bg-white/5 rounded-xl" />
    </div>
  </div>
);