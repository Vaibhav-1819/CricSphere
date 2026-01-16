import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  // Animation Variants for the Stagger Effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between each card's entry
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    { 
      title: "Live Scores", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      lineColor: "bg-blue-500",
      description: "Lightning-fast real-time updates on all international and domestic matches." 
    },
    { 
      title: "Match Schedules", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      lineColor: "bg-indigo-500",
      description: "Never miss a game with our complete calendar of upcoming series and tournaments." 
    },
    { 
      title: "Detailed Stats", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      lineColor: "bg-emerald-500",
      description: "Dive deep into detailed statistics, player profiles, and historical data analysis." 
    },
    { 
      title: "Breaking News", 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      lineColor: "bg-rose-500",
      description: "Get breaking headlines, exclusive interviews, and expert match analysis." 
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-[#0b1220] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase bg-blue-400/10 rounded-full border border-blue-400/20"
          >
            The Arena Advantage
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            Everything you need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              to own the game
            </span>
          </motion.h2>
        </div>

        {/* Staggered Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group relative p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/[0.07] transition-all duration-500"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-500`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>

              {/* Identity Line (Animated on Hover) */}
              <div className={`absolute bottom-6 left-10 w-8 h-1 rounded-full ${feature.lineColor} opacity-20 group-hover:w-20 group-hover:opacity-100 transition-all duration-500`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;