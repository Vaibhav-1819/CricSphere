import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  // FIXED: Defined full Tailwind class strings instead of using dynamic variables
  const features = [
    { 
      title: "Live Scores & Updates", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      // Explicit classes ensure they are not purged by Tailwind
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      lineColor: "bg-blue-500",
      description: "Lightning-fast real-time updates on all international and domestic matches." 
    },
    { 
      title: "Match Schedules", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      lineColor: "bg-purple-500",
      description: "Never miss a game with our complete calendar of upcoming series and tournaments." 
    },
    { 
      title: "Team & Player Stats", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      lineColor: "bg-orange-500",
      description: "Dive deep into detailed statistics, player profiles, and historical data analysis." 
    },
    { 
      title: "Latest Cricket News", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      lineColor: "bg-red-500",
      description: "Get breaking headlines, exclusive interviews, and expert match analysis." 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } },
  };

  return (
    <section id="features" className="relative py-24 bg-slate-950 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-400/10 rounded-full border border-indigo-400/20"
          >
            Why CricSphere?
          </motion.span>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            Everything you need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              to follow the game
            </span>
          </motion.h2>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group relative p-8 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-sm hover:bg-slate-800/50 hover:border-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Icon Container with Explicit Colors */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Line with Explicit Color */}
              <div className={`absolute bottom-0 left-0 w-full h-1 ${feature.lineColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;