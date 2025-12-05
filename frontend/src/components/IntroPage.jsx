import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const IntroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Animated Layered Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-pulse-slow"></div>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?cricket-stadium')" }}
        />
        {/* Floating particles for pro feel */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-60"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5 + Math.random() * 5, ease: 'easeInOut', delay: Math.random() * 5 }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 p-8 rounded-xl bg-black/60 backdrop-blur-md shadow-2xl max-w-xl"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-green-400 drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-500 animate-textGlow">
          CricSphere
        </h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl mb-6 font-semibold text-white/90"
        >
          Your Complete Cricket Destination
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-sm md:text-base text-gray-300"
        >
          Get real-time live scores, match schedules, player stats, and all the latest cricket news in one elegant application built with Spring Boot and React.
        </motion.p>
        <motion.button
          onClick={() => navigate('/home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-green-400 hover:bg-green-500 text-black font-bold rounded-lg shadow-lg transition-colors duration-300"
        >
          Skip Intro
        </motion.button>
      </motion.div>

      {/* Tailwind Custom Animation for Text Glow */}
      <style>
        {`
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px #34D399, 0 0 20px #10B981; }
            50% { text-shadow: 0 0 20px #34D399, 0 0 30px #10B981; }
          }
          .animate-textGlow {
            animation: textGlow 2s infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default IntroPage;
