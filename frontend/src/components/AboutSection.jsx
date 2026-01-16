import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  // Enhanced staggered animation for a professional reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  const aboutCards = [
    {
      title: "Real-Time Precision",
      desc: "Experience lightning-fast telemetry and ball-by-ball updates directly from the global arena.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      lineColor: "bg-blue-500"
    },
    {
      title: "Global Coverage",
      desc: "From local franchise leagues to ICC World Cups, we provide a unified dashboard for every series.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      lineColor: "bg-indigo-500"
    },
    {
      title: "Historical Depth",
      desc: "Access a comprehensive vault of player profiles, team rankings, and historical match archives.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      lineColor: "bg-emerald-500"
    }
  ];

  return (
    <section id="about" className="relative pt-24 pb-16 bg-[#080a0f] overflow-hidden">
      
      {/* Dynamic Background decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- Key Metrics Display --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-24"
        >
          <StatBox value="50+" label="Global Leagues" />
          <StatBox value="24/7" label="Live Telemetry" isLive />
          <StatBox value="100%" label="Data Sync" />
          <StatBox value="10k+" label="Pro Analysts" />
        </motion.div>

        {/* --- Section Header --- */}
        <div className="text-center mb-20"> 
          <motion.span 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase bg-blue-500/10 rounded-full border border-blue-500/20"
          >
            THE ARENA ADVANTAGE
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]"
          >
            Everything you need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              to own the game
            </span>
          </motion.h2>
        </div>

        {/* --- Features Grid --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {aboutCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative p-12 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 ${card.iconBg} ${card.iconColor} group-hover:scale-110 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] transition-all duration-500`}>
                {card.icon}
              </div>

              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight italic">
                {card.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {card.desc}
              </p>

              {/* Animated Accent Line */}
              <div className={`absolute bottom-8 left-12 h-1 rounded-full ${card.lineColor} w-8 opacity-20 group-hover:w-24 group-hover:opacity-100 transition-all duration-500`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const StatBox = ({ value, label, isLive }) => (
  <div className="group relative">
    <div className="flex items-center justify-center gap-2 mb-3">
      <span className="text-4xl font-black text-white tracking-tighter group-hover:text-blue-500 transition-colors duration-300 tabular-nums">
        {value}
      </span>
      {isLive && (
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_15px_#ef4444]"></span>
        </div>
      )}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors">
      {label}
    </span>
  </div>
);

export default AboutSection;