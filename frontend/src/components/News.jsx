import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bookmark, Clock, ChevronRight, TrendingUp, 
  Hash, ExternalLink, Flame, LayoutGrid, List, Newspaper 
} from 'lucide-react';

// --- MOCK DATA REMAINS THE SAME (LATEST_NEWS, TRENDING_TOPICS) ---
const LATEST_NEWS = [
  {
    id: 1,
    featured: true,
    title: "Champions Trophy 2025: India Lifts Title in Lahore Thriller",
    source: "ESPNcricinfo",
    publishedAt: "2025-12-01T14:30:00Z",
    readTime: "8 min read",
    url: "#",
    summary: "In a match for the ages, India defeated Australia by just 15 runs. Shubman Gill's masterclass 118 ended the 12-year wait.",
    tag: "Champions Trophy",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "IPL 2026 Mega Auction: RTM Card Controversy Explained",
    source: "Cricbuzz",
    publishedAt: "2025-11-30T09:15:00Z",
    readTime: "5 min read",
    url: "#",
    summary: "The BCCI's new retention rules have sparked debate across franchises.",
    tag: "IPL 2026",
    image: "https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&w=800&q=80",
  },
  // Add other items from your previous data here...
];

export default function News() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  // Filter Logic
  const processedNews = useMemo(() => {
    return LATEST_NEWS.filter(item => {
      const matchTab = activeTab === 'All' || item.tag === activeTab || (activeTab === 'Saved' && bookmarks.includes(item.id));
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search, bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">World Cricket News</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Latest <span className="text-blue-600">Feed</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             {/* Search Bar */}
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search headlines..." 
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
                    onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             {/* View Toggle */}
             <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'text-slate-400'}`}><List size={18}/></button>
             </div>
          </div>
        </header>

        {/* --- CATEGORY TABS --- */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Analysis', 'IPL 2026', 'Saved'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        activeTab === tab 
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                        : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                    }`}
                >
                    {tab === 'Saved' ? `Bookmarks (${bookmarks.length})` : tab}
                </button>
            ))}
        </div>

        {/* --- NEWS CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main News Feed (Left/Middle) */}
            <div className="lg:col-span-2 space-y-6">
                <AnimatePresence mode="popLayout">
                    {processedNews.map((news, i) => (
                        <NewsItem 
                            key={news.id} 
                            data={news} 
                            viewMode={viewMode} 
                            isBookmarked={bookmarks.includes(news.id)}
                            onBookmark={() => toggleBookmark(news.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Trending Sidebar (Right) */}
            <aside className="hidden lg:block space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-600" /> Trending Topics
                    </h3>
                    <div className="space-y-4">
                        {['#IPL2026Auction', '#KohliRetires', '#BazballControversy', '#WTCFinals'].map((tag, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-xl transition-colors">
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600">{tag}</span>
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
    const isList = viewMode === 'list';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${
                isList ? "flex flex-col sm:flex-row h-auto sm:h-52" : "flex flex-col"
            }`}
        >
            <div className={`relative overflow-hidden ${isList ? "sm:w-72" : "h-52"}`}>
                <img src={data.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-[10px] font-black text-white uppercase rounded-lg">
                        {data.tag}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                        <span>{data.source}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-slate-400 font-medium">{data.readTime}</span>
                    </div>
                    <button onClick={onBookmark} className={`${isBookmarked ? "text-blue-600" : "text-slate-300"} hover:scale-110 transition-transform`}>
                        <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {data.title}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {data.summary}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {new Date(data.publishedAt).toLocaleDateString()}
                    </span>
                    <a href={data.url} className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Read Story <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};