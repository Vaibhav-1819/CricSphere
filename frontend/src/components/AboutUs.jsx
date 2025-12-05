import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, Database, Code, Globe, Cpu, Server, 
  Layers, ArrowRight, Activity, Shield, 
  Terminal, Smartphone, Wifi, Linkedin, Github, ExternalLink
} from 'lucide-react';

// --- Background Grid Component ---
const RetroGrid = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-30 pointer-events-none">
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};

// --- Section Divider with "Data Line" ---
const DataLine = () => (
  <div className="flex justify-center items-center py-10 relative">
    <div className="h-24 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-50" />
    <div className="absolute w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
  </div>
);

// --- Feature Card Component ---
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
      <Icon size={100} />
    </div>
    
    <div className="relative z-10">
      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  </motion.div>
);

// --- Tech Pill Component ---
const TechPill = ({ name, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition-colors"
  >
    <div className={`p-1.5 rounded-lg ${color} bg-opacity-20`}>
      <Icon size={18} className={color.replace('bg-', 'text-')} />
    </div>
    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{name}</span>
  </motion.div>
);

const AboutUs = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-emerald-500/30">
      
      <RetroGrid />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              System v2.0 Live
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6"
          >
            The Physics of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              Modern Cricket.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            We don't just display scores. We analyze trajectories, predict outcomes, and deliver data 
            faster than the broadcast signal reaches your TV.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95">
              Explore Analytics
            </button>
            <button className="px-8 py-3 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Read Our Story
            </button>
          </motion.div>
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
      </section>

      <DataLine />

      {/* The Story / Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-4 -top-4 w-20 h-20 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl opacity-20" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Bridging the gap between <br />
              <span className="text-emerald-500">Passion & Precision</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              It started in 2024 with a simple frustration: existing cricket apps were cluttered, slow, and focused on ads rather than insights.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              CricSphere was born to change that. We built a proprietary data engine that ingests ball-by-ball telemetry, processes it through our Spring Boot backend, and pushes it instantly to your device. No lag. No clutter. Just pure game intelligence.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-500">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500">Trusted by 10,000+ early adopters</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl group"
          >
            {/* --- UPDATED: Live Match Simulation --- */}
            <div className="absolute inset-0 bg-slate-950 p-6 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-mono tracking-wider">LIVE FEED • SOCKET: CONNECTED</span>
                    <span className="text-white font-bold">IND vs AUS <span className="text-emerald-500 text-xs ml-2 px-2 py-0.5 bg-emerald-500/10 rounded-full">LIVE</span></span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono text-white">184/3</div>
                    <div className="text-xs text-slate-400">Overs: 18.4 • CRR: 10.02</div>
                </div>
              </div>
              
              {/* Ball Trajectory Animation */}
              <div className="relative flex-grow bg-slate-900/50 rounded-xl border border-slate-800 mb-4 overflow-hidden">
                 {/* Pitch Representation */}
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50" />
                 <div className="absolute bottom-0 left-10 w-1 h-8 bg-slate-600" /> {/* Wickets */}
                 <div className="absolute bottom-0 right-10 w-1 h-8 bg-slate-600" /> {/* Wickets */}
                 
                 {/* Trajectory Path */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path 
                        d="M 40 200 Q 150 50 320 200" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                    />
                    {/* Impact Marker */}
                    <motion.circle 
                        cx="150" cy="50" r="4" fill="#fff"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: 0.7, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    />
                 </svg>

                 {/* Floating Stats */}
                 <motion.div 
                    className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 text-xs font-mono text-emerald-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                 >
                    Speed: 142.5 kph
                 </motion.div>
                 <motion.div 
                    className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 text-xs font-mono text-cyan-400"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                 >
                    Turn: 3.2°
                 </motion.div>
              </div>

              {/* Live Commentary Log */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex gap-2 items-center text-slate-300">
                    <span className="text-emerald-500 font-bold">18.4</span>
                    <span className="flex-1">Bumrah to Kohli, <span className="text-white font-bold">FOUR RUNS</span></span>
                    <span className="text-slate-500">142kph</span>
                </div>
                <div className="flex gap-2 items-center text-slate-500 opacity-60">
                    <span className="">18.3</span>
                    <span className="flex-1">Bumrah to Kohli, No run, defensive push.</span>
                    <span className="">138kph</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <DataLine />

      {/* Features Grid */}
      <section className="py-20 px-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Engineered for the Obsessed
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We stripped away the bloat to focus on three core pillars: Speed, Depth, and Usability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Zap}
              title="Real-Time Sockets"
              desc="Gone are the days of refreshing. Our WebSocket architecture pushes updates instantly, ensuring you see the wicket before your neighbor hears the shout."
              delay={0}
            />
            <FeatureCard 
              icon={Activity}
              title="Predictive AI"
              desc="Our machine learning models analyze historical data, pitch conditions, and player form to calculate win probability ball-by-ball."
              delay={0.2}
            />
            <FeatureCard 
              icon={Smartphone}
              title="Native Performance"
              desc="Built with React and Tailwind, our interface is fluid, responsive, and optimized for battery life, even during all-day Test matches."
              delay={0.4}
            />
            <FeatureCard 
              icon={Database}
              title="Deep Archive"
              desc="Access 10 years of ball-by-ball data. Query player stats against specific teams in specific conditions instantly."
              delay={0.6}
            />
            <FeatureCard 
              icon={Globe}
              title="Global Coverage"
              desc="From the Ashes to the IPL, from Ranji Trophy to County Cricket. If a ball is bowled, we are tracking it."
              delay={0.8}
            />
            <FeatureCard 
              icon={Shield}
              title="Ad-Free Focus"
              desc="We value your attention. No popup ads, no betting spam. Just a clean, immersive cricket experience."
              delay={1.0}
            />
          </div>
        </div>
      </section>

      <DataLine />

      {/* Tech Stack - Circuit Board Style */}
      <section className="py-20 px-4 overflow-hidden relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2">Under the Hood</h3>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                A Modern Tech Stack for a Modern Game
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                CricSphere is built on a microservices architecture, ensuring 99.99% uptime during high-traffic finals.
              </p>
              <div className="flex gap-4">
                 <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">50ms</span>
                    <span className="text-sm text-slate-500">Avg Latency</span>
                 </div>
                 <div className="w-px bg-slate-300 dark:bg-slate-700 h-12" />
                 <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">100k+</span>
                    <span className="text-sm text-slate-500">Concurrents</span>
                 </div>
              </div>
            </div>

            <div className="md:w-2/3 relative">
              {/* Circuit Lines Background */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 300">
                <path d="M50 150 H 150 V 50 H 250" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                <path d="M50 150 H 150 V 250 H 250" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                <circle cx="250" cy="50" r="5" className="fill-emerald-500" />
                <circle cx="250" cy="250" r="5" className="fill-emerald-500" />
              </svg>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                <TechPill name="React 18" icon={Code} color="bg-blue-500" />
                <TechPill name="Spring Boot" icon={Server} color="bg-green-500" />
                <TechPill name="PostgreSQL" icon={Database} color="bg-indigo-500" />
                <TechPill name="Tailwind" icon={Layers} color="bg-cyan-500" />
                <TechPill name="WebSocket" icon={Wifi} color="bg-purple-500" />
                <TechPill name="AWS" icon={Cpu} color="bg-orange-500" />
                <TechPill name="Redis" icon={Zap} color="bg-red-500" />
                <TechPill name="TypeScript" icon={Terminal} color="bg-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPROVED DEVELOPER PROFILE SECTION --- */}
      <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-hidden relative"
            >
                {/* Decorative sheen */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar / Icon */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="relative w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                             <Code size={48} className="text-emerald-400" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-900 p-2 rounded-full border-4 border-slate-900">
                            <Activity size={16} />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Vaibhav Bharathula</h2>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                                Lead Engineer
                            </span>
                        </div>
                        <p className="text-slate-400 mb-6 text-lg">
                            Full Stack Developer specializing in high-performance distributed systems. 
                            Building the future of sports analytics, one WebSocket at a time.
                        </p>

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                            {['React', 'Spring Boot', 'AWS', 'System Design'].map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 text-sm font-medium border border-slate-700">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <a 
                                href="https://www.linkedin.com/in/vaibhav-bharathula" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 group"
                            >
                                <Linkedin size={20} />
                                <span>Connect on LinkedIn</span>
                                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 transition-all">
                                <Github size={20} />
                                <span>View GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        
        <div className="mt-20 text-center text-slate-600 text-sm">
          © 2025 CricSphere Analytics. Built with <span className="text-red-500">♥</span> by Vaibhav.
        </div>
      </section>

    </div>
  );
};

export default AboutUs;