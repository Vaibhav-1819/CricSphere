import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const IntroPage = () => {
  const navigate = useNavigate();

  // Auto-redirect logic after the progress bar completes
  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#0b1220]">
      
      {/* 1. Animated Layered Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#111a2e] to-black"></div>
        
        {/* Cinematic Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </motion.div>

      {/* 2. Main Glassmorphism Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-2xl shadow-2xl max-w-2xl mx-4"
      >
        {/* Pulsing Logo Icon */}
        <div className="flex justify-center mb-6">
           <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              boxShadow: [
                "0px 0px 0px rgba(37, 99, 235, 0)", 
                "0px 0px 30px rgba(37, 99, 235, 0.4)", 
                "0px 0px 0px rgba(37, 99, 235, 0)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="p-5 bg-blue-600 rounded-3xl"
           >
             <Zap className="text-white fill-white" size={40} />
           </motion.div>
        </div>

        {/* Brand Typography */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter italic uppercase text-white">
          Cric<span className="text-blue-500">Sphere</span>
        </h1>

        {/* Subtitle with decorative lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-500/50" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Intelligent Analytics Engine
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500/50" />
        </motion.div>

        <p className="text-slate-400 text-sm md:text-base mb-10 leading-relaxed font-medium">
          Experience the next generation of cricket telemetry. Real-time scores, 
          advanced MIS analytics, and deep-dive player insights synced via Spring Boot.
        </p>

        {/* Manual Entry Action */}
        <motion.button
          onClick={() => navigate('/home')}
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb", color: "#fff" }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all duration-300"
        >
          Enter Arena
        </motion.button>
      </motion.div>

      {/* 3. Global Synchronized Loading Bar */}
      <div className="absolute bottom-16 flex flex-col items-center gap-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 animate-pulse">
          Initializing Stream
        </span>
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export default IntroPage;