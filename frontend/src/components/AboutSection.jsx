import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  // Animation variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 50 } 
    }
  };

  const features = [
    {
      title: "Real-Time Precision",
      desc: "Lightning-fast score updates and ball-by-ball commentary that keeps you ahead of the broadcast.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10"
    },
    {
      title: "Deep Analytics",
      desc: "Comprehensive player stats, team rankings, and historical data visualization for the true enthusiast.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      title: "Global Coverage",
      desc: "From the IPL to The Ashes, we cover every tournament, league, and international series worldwide.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    }
  ];

  return (
    <section id="about" className="relative py-24 bg-slate-950 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.span variants={itemVariants} className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-400/10 rounded-full border border-emerald-400/20">
              Our Mission
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Redefining the way you <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Experience Cricket
              </span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              CricSphere isn't just a scoreboard. It's a complete ecosystem designed for the modern fan, 
              combining cutting-edge technology with a passion for the gentleman's game.
            </motion.p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all duration-300 shadow-xl"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Stats / Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
             <div>
                <div className="text-3xl font-black text-white">50+</div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">Leagues Covered</div>
             </div>
             <div>
                <div className="text-3xl font-black text-white">24/7</div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">Live Updates</div>
             </div>
             <div>
                <div className="text-3xl font-black text-white">100%</div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">Real-time Data</div>
             </div>
             <div>
                <div className="text-3xl font-black text-white">10k+</div>
                <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">Active Users</div>
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;