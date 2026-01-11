import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Calendar, ChevronRight, Info, Filter, ArrowUpDown, Hash } from 'lucide-react';
import useFetch from '../hooks/useFetch';

const Schedules = () => {
    const { data, loading, error } = useFetch('http://localhost:8081/api/v1/cricket/series');
    const [searchQuery, setSearchQuery] = useState("");
    const [formatFilter, setFormatFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

    // -------------------------------------------
    // Logic: Filtering & Sorting
    // -------------------------------------------
    const processedSeries = useMemo(() => {
        if (!data?.data) return [];
        
        let filtered = [...data.data].filter(s => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Format Filtering
        if (formatFilter !== "All") {
            filtered = filtered.filter(s => s[formatFilter.toLowerCase()] > 0);
        }

        // Sorting by Date
        filtered.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [data, searchQuery, formatFilter, sortOrder]);

    if (loading) return <LoadingGrid />;
    if (error) return <ErrorState />;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-[#0f172a]">
            {/* --- HEADER --- */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Tournament <span className="text-blue-600">Schedules</span>
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Browse and filter international cricket tours.
                        </p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search series..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- FILTER & SORT BAR --- */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                        <Filter className="w-4 h-4 text-slate-400 mr-2 hidden sm:block" />
                        {["All", "T20", "ODI", "Test"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFormatFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                    formatFilter === f 
                                    ? "bg-blue-600 text-white shadow-md" 
                                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-300"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider hidden sm:block">Sort By Date:</span>
                        <button 
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            {sortOrder === "asc" ? "Earliest First" : "Latest First"}
                        </button>
                    </div>
                </div>
            </header>

            {/* --- COMPACT GRID --- */}
            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {processedSeries.map((series) => (
                        <SeriesCard key={series.id} series={series} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {processedSeries.length === 0 && <EmptyState />}
        </div>
    );
};

// -------------------------------------------
// Sub-Component: Compact Card
// -------------------------------------------
const SeriesCard = ({ series }) => {
    const totalMatches = (series.t20 || 0) + (series.odi || 0) + (series.test || 0);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <Link to={`/schedules/${series.id}`} className="block h-full">
                <div className="h-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 flex flex-col">
                    
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-1">
                            <MiniBadge type="T20" count={series.t20} color="sky" />
                            <MiniBadge type="ODI" count={series.odi} color="indigo" />
                            <MiniBadge type="Test" count={series.test} color="red" />
                        </div>
                        {totalMatches > 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                                <Hash className="w-2.5 h-2.5" /> {totalMatches}
                            </div>
                        )}
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {series.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400 mb-6 mt-auto">
                        <Calendar className="w-3.5 h-3.5 text-blue-500/70" />
                        <span className="font-medium">{series.startDate}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between text-blue-600 dark:text-blue-400">
                        <span className="text-[11px] font-black uppercase tracking-widest">Full Schedule</span>
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const MiniBadge = ({ type, count, color }) => {
    if (!count || count === 0) return null;
    const styles = {
        sky: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
        red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
    };
    return (
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${styles[color]}`}>
            {count} {type}
        </span>
    );
};

// -------------------------------------------
// Helpers
// -------------------------------------------
const LoadingGrid = () => (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
    </div>
);

const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full mb-4">
            <Info className="w-8 h-8 text-red-500" />
        </div>
        <p className="font-bold text-slate-900 dark:text-white">API Offline</p>
        <p className="text-sm text-slate-500">Unable to fetch tournament data.</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
        <p className="text-slate-400 font-medium">No matches found for this filter.</p>
    </div>
);

export default Schedules;