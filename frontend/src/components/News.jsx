import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutGrid,
  List,
  Clock,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Hash,
  Share2,
  ExternalLink,
  Flame,
  Globe,
  Zap
} from 'lucide-react';

// --- DATA: REALISTIC IMAGES & HEADLINES (DEC 2025) ---
const LATEST_NEWS = [
  {
    id: 1,
    featured: true,
    title: "Champions Trophy 2025: India Lifts Title in Lahore Thriller",
    source: "ESPNcricinfo",
    author: "Sidharth Monga",
    publishedAt: "2025-12-01T14:30:00Z",
    readTime: "8 min read",
    url: "https://www.espncricinfo.com/",
    summary: "In a match for the ages, India defeated Australia by just 15 runs. Shubman Gill's masterclass 118 and Jasprit Bumrah's death-over yorkers ended the 12-year wait for the title.",
    tag: "Champions Trophy",
    // Real image of Team India Celebration (Wikimedia)
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Team_India_T20WC_Victory_Parade_2024.jpg/1280px-Team_India_T20WC_Victory_Parade_2024.jpg",
    sentiment: "positive"
  },
  {
    id: 2,
    title: "IPL 2026 Mega Auction: RTM Card Controversy Explained",
    source: "Cricbuzz",
    author: "Harsha Bhogle",
    publishedAt: "2025-11-30T09:15:00Z",
    readTime: "5 min read",
    url: "https://www.cricbuzz.com/",
    summary: "The BCCI's new retention rules have sparked debate. With the purse increased to ₹120 Crore, franchises are plotting aggressive strategies.",
    tag: "IPL 2026",
    // Generic Auction Gavel/Logo representation
    image: "https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&w=800&q=80",
    sentiment: "neutral"
  },
  {
    id: 3,
    title: "The 'Bazball' Fatigue: Has England's Aggression Hit a Wall?",
    source: "Wisden",
    author: "Ben Jones",
    publishedAt: "2025-11-28T11:00:00Z",
    readTime: "12 min read",
    url: "https://wisden.com/",
    summary: "After a 3-1 series loss to South Africa, questions are mounting over Ben Stokes' ultra-aggressive tactics in seaming conditions.",
    tag: "Analysis",
    // Real image of Ben Stokes (Wikimedia)
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ben_Stokes_2015.jpg/800px-Ben_Stokes_2015.jpg",
    sentiment: "critical"
  },
  {
    id: 4,
    title: "Breaking: Virat Kohli to Play County Cricket in 2026",
    source: "The Guardian",
    author: "Ali Martin",
    publishedAt: "2025-11-29T16:45:00Z",
    readTime: "3 min read",
    url: "https://www.theguardian.com/sport/cricket",
    summary: "In a bid to prepare for the England tour, the former Indian captain has signed a short-term deal with Surrey for the early summer swing.",
    tag: "Transfers",
    // Real image of Virat Kohli (Wikimedia)
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg/800px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg",
    sentiment: "positive"
  },
  {
    id: 5,
    title: "Tech Watch: ICC Trials 'Smart Ball' 2.0 in Big Bash League",
    source: "TechCrunch Sports",
    author: "Tech Desk",
    publishedAt: "2025-11-27T08:00:00Z",
    readTime: "4 min read",
    url: "#",
    summary: "The new Kookaburra chip promises instant data on spin RPM and swing degrees, revolutionizing broadcast graphics.",
    tag: "Technology",
    // High quality cricket ball image
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
    sentiment: "neutral"
  },
  {
    id: 6,
    title: "WTC Finals 2027: Lord's Confirmed as Venue",
    source: "ICC Media",
    publishedAt: "2025-11-20T10:00:00Z",
    readTime: "2 min read",
    url: "https://www.icc-cricket.com/",
    summary: "Moving away from The Oval, the Ultimate Test returns to the Home of Cricket for the 2025-27 cycle finale.",
    tag: "WTC",
    // Real image of Lord's Cricket Ground (Wikimedia)
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Lord%27s_Pavilion_2018.jpg/800px-Lord%27s_Pavilion_2018.jpg",
    sentiment: "neutral"
  },
];

const TRENDING_TOPICS = [
  { name: "IPL Auction", count: "125k" },
  { name: "Kohli Century", count: "89k" },
  { name: "WPL2025", count: "54k" },
  { name: "Bazball", count: "42k" },
  { name: "ViratKohli", count: "210k" },
];

export default function News() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800); // Simulate API load
    try {
      const saved = JSON.parse(localStorage.getItem('cs:bookmarks') || '[]');
      setBookmarks(saved);
    } catch {}
  }, []);

  const toggleBookmark = (id) => {
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('cs:bookmarks', JSON.stringify(newBookmarks));
  };

  const processedNews = useMemo(() => {
    return LATEST_NEWS.filter(item => {
      const matchTab = activeTab === 'All' || item.tag === activeTab || (activeTab === 'Saved' && bookmarks.includes(item.id));
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search, bookmarks]);

  const featuredStory = processedNews.find(n => n.featured);
  const regularStories = processedNews.filter(n => !n.featured);

  return (
    <div className="min-h-screen bg-[#0f1014] text-slate-200 font-sans flex flex-col lg:flex-row">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full lg:w-72 bg-[#13141a] border-b lg:border-b-0 lg:border-r border-white/5 sticky top-0 h-auto lg:h-screen z-30 flex-shrink-0">
        <div className="p-6 flex flex-col h-full">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              CS
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CricSphere<span className="text-indigo-500">.</span></span>
          </div>

          {/* Search */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0f1014] border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-indigo-500/50 transition-colors">
              <Search className="w-5 h-5 text-slate-500 mr-3" />
              <input 
                type="text" 
                placeholder="Search news..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-sm placeholder-slate-600 text-white"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-8">
            <NavItem icon={Flame} label="Latest News" isActive={activeTab === 'All'} onClick={() => setActiveTab('All')} />
            <NavItem icon={TrendingUp} label="Analysis" isActive={activeTab === 'Analysis'} onClick={() => setActiveTab('Analysis')} />
            <NavItem icon={Bookmark} label="Saved Stories" isActive={activeTab === 'Saved'} onClick={() => setActiveTab('Saved')} badge={bookmarks.length} />
          </nav>

          {/* Trending Section */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Trending Now
            </h3>
            <div className="space-y-3">
              {TRENDING_TOPICS.map((topic, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-indigo-500" />
                    <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{topic.name}</span>
                  </div>
                  <span className="text-xs text-slate-600 bg-black/20 px-2 py-0.5 rounded-full">{topic.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* --- MAIN FEED --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              {activeTab === 'Saved' ? 'Your Reading List' : 'Cricket News Feed'}
            </h1>
            <p className="text-slate-400 text-sm">Real-time updates from the world of cricket.</p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-[#13141a] p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#1e1f26] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#1e1f26] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* --- CONTENT --- */}
        <AnimatePresence mode="popLayout">
          {loading ? (
             <div className="flex items-center justify-center h-64 text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
                </div>
             </div>
          ) : (
            <div className="space-y-8">
              
              {/* Featured Story (Only on 'All' tab and if searching is empty) */}
              {featuredStory && activeTab === 'All' && !search && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="relative h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-900/20"
                >
                  <img src={featuredStory.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  
                  <div className="absolute top-6 right-6">
                      <span className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full" /> Live Updates
                      </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-none mb-4 group-hover:text-indigo-400 transition-colors drop-shadow-2xl">
                      {featuredStory.title}
                    </h2>
                    <p className="text-slate-300 text-lg line-clamp-2 mb-6 max-w-2xl font-medium drop-shadow-md">
                        {featuredStory.summary}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/80 font-bold tracking-wide">
                      <span className="text-indigo-400">{featuredStory.source}</span>
                      <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                      <span>{featuredStory.readTime}</span>
                      <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                      <a href={featuredStory.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors border-b border-transparent hover:border-white">
                        Read Story <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Grid/List Feed */}
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                {regularStories.map((item) => (
                  <NewsCard 
                    key={item.id} 
                    data={item} 
                    viewMode={viewMode} 
                    isBookmarked={bookmarks.includes(item.id)}
                    toggleBookmark={() => toggleBookmark(item.id)}
                  />
                ))}
              </div>

              {processedNews.length === 0 && (
                <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
                  <p className="text-slate-500 text-lg">No stories found matching your criteria.</p>
                  <button onClick={() => {setSearch(''); setActiveTab('All')}} className="mt-4 text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20">Clear Filters</button>
                </div>
              )}

            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const NavItem = ({ icon: Icon, label, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
      <span>{label}</span>
    </div>
    {badge > 0 && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const NewsCard = ({ data, viewMode, isBookmarked, toggleBookmark }) => {
  const isList = viewMode === 'list';

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`group bg-[#13141a] border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ${isList ? 'flex flex-row h-48' : 'flex flex-col h-full'}`}
    >
      {/* Image Section */}
      <div className={`relative overflow-hidden ${isList ? 'w-64 shrink-0' : 'h-48 w-full'}`}>
        <img 
          src={data.image} 
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white bg-black/60 backdrop-blur-md rounded border border-white/10">
            {data.tag}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 relative">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-bold">{data.source}</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>{new Date(data.publishedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
             <button onClick={toggleBookmark} className="hover:text-indigo-400 transition-colors">
               <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-400 text-indigo-400' : ''}`} />
             </button>
          </div>
        </div>

        <h3 className={`font-bold text-white mb-2 leading-snug group-hover:text-indigo-400 transition-colors ${isList ? 'text-lg' : 'text-xl'}`}>
          <a href={data.url} target="_blank" rel="noreferrer">{data.title}</a>
        </h3>

        {!isList && (
          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
            {data.summary}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
           <div className="flex items-center gap-1 text-xs text-slate-500">
             <Clock className="w-3 h-3" /> {data.readTime}
           </div>
           <a href={data.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
             Read Full Story <ExternalLink className="w-3 h-3" />
           </a>
        </div>
      </div>
    </motion.article>
  );
};