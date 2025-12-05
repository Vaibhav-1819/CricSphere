import React from 'react';
import useFetch from '../hooks/useFetch';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Schedules = () => {
    const { data, loading, error } = useFetch('http://localhost:8081/api/v1/cricket/series');

    // -------------------------------------------
    // Animation Variants
    // -------------------------------------------
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        hover: { y: -5, transition: { duration: 0.2 } }
    };

    // -------------------------------------------
    // Helper: Format Badge Component
    // -------------------------------------------
    const FormatBadge = ({ type, count }) => {
        if (!count || count === 0) return null;
        
        let colors = "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
        if (type === "T20") colors = "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700";
        if (type === "ODI") colors = "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700";
        if (type === "Test") colors = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";

        return (
            <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border ${colors} min-w-[60px]`}>
                <span className="text-lg font-bold leading-none">{count}</span>
                <span className="text-[10px] uppercase font-semibold opacity-80">{type}</span>
            </div>
        );
    };

    // -------------------------------------------
    // State: Loading (Skeleton)
    // -------------------------------------------
    if (loading) return (
        <div className="p-6 max-w-7xl mx-auto min-h-[60vh]">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    // -------------------------------------------
    // State: Error
    // -------------------------------------------
    if (error) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
            <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Failed to load series</h3>
            <p className="text-gray-500 mt-2">We couldn't fetch the tournament schedule at this time.</p>
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 max-w-7xl mx-auto min-h-[60vh]"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Tournament <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Schedules</span>
                    </h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Explore upcoming international tours, leagues, and championships.
                    </p>
                </div>
                
                {/* Visual Decorative Pill */}
                <div className="hidden md:block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-700">
                   {data?.data?.length || 0} Active Series
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((series) => (
                    <Link key={series.id} to={`/schedules/${series.id}`} className="block h-full">
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            className="group relative h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                        >
                            {/* Hover Gradient Border Effect */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors transform -rotate-45 group-hover:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {series.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{series.startDate} — {series.endDate}</span>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-4" />

                                {/* Format Stats Badges */}
                                <div className="mt-auto flex flex-wrap gap-2">
                                    <FormatBadge type="T20" count={series.t20} />
                                    <FormatBadge type="ODI" count={series.odi} />
                                    <FormatBadge type="Test" count={series.test} />
                                    
                                    {(series.t20 === 0 && series.odi === 0 && series.test === 0) && (
                                        <span className="text-xs text-gray-400 italic py-2">Matches TBA</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
            
            {(!data?.data || data.data.length === 0) && !loading && (
                 <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No active cricket series found.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Schedules;