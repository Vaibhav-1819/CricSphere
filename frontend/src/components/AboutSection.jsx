import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  // Logic-driven animation variants to match FeaturesSection stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
    // Reduced vertical padding (pt-20 pb-10) to eliminate excessive gaps
    <section id="about" className="relative pt-20 pb-10 bg-[#0b1220] overflow-hidden">
      
      {/* Background Decor synced with FeaturesSection */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- Metrics Row (Reduced Margin Bottom) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center mb-16"
        >
          <StatBox value="50+" label="Global Leagues" />
          <StatBox value="24/7" label="Live Telemetry" isLive />
          <StatBox value="100%" label="Data Sync" />
          <StatBox value="10k+" label="Pro Analysts" />
        </motion.div>

        {/* --- Aligned Header (Tightened Spacing) --- */}
        <div className="text-center mb-12"> 
          <motion.span 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase bg-blue-400/10 rounded-full border border-blue-400/20"
          >
            THE ARENA ADVANTAGE
          </motion.span>
          
          <motion.h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
            Everything you need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              to own the game
            </span>
          </motion.h2>
        </div>

        {/* Aligned Card Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {aboutCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/[0.07] transition-all duration-500"
            >
              {/* Icon Container with Purge-Safe Classes */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                {card.icon}
              </div>

              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">
                {card.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {card.desc}
              </p>

              {/* Identity Line */}
              <div className={`absolute bottom-6 left-10 w-8 h-1 rounded-full ${card.lineColor} opacity-20 group-hover:w-20 group-hover:opacity-100 transition-all duration-500`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const StatBox = ({ value, label, isLive }) => (
  <div className="group">
    <div className="flex items-center justify-center gap-1.5 mb-2">
      <span className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{value}</span>
      {isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</span>
  </div>
);

export default AboutSection;