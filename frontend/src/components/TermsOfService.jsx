import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Imported Link
import { 
  Shield, Users, Lock, Server, Mail, 
  CheckCircle, FileText, AlertTriangle, Clock,
  Gavel, Ban, Globe, Scale
} from 'lucide-react';

// --- Configuration & Data ---
const EFFECTIVE_DATE = "December 1, 2025";

const legalSections = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Acceptance of Terms",
    content: "By accessing CricSphere, you confirm that you are at least 18 years old and agree to be bound by these Terms. Access constitutes a binding digital signature.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: 2,
    icon: Users,
    title: "Account Integrity",
    content: "You are responsible for safeguarding your password. CricSphere cannot and will not be liable for any loss or damage arising from your failure to comply with security obligations.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    id: 3,
    icon: Server,
    title: "API & Data Usage",
    content: "Our service aggregates data from third-party cricket telemetry providers. We act as a data processor, not a data creator. Service is provided on an 'AS IS' basis.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    id: 4,
    icon: Lock,
    title: "Intellectual Property",
    content: "The CricSphere source code, algorithms, and UI design are exclusive property of CricSphere. You agree not to reverse-engineer or scrape our proprietary data engine.",
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    id: 5,
    icon: Ban,
    title: "Prohibited Uses",
    content: "You may not use the service for any illegal purpose, including but not limited to: unauthorized betting syndication, match-fixing analysis, or automated scraping.",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    id: 6,
    icon: Globe,
    title: "Jurisdiction",
    content: "These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  }
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

// --- Components ---

const Background = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[120px]" />
    <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-20" />
  </div>
);

const LegalCard = ({ item }) => (
  <motion.div 
    variants={cardVariants}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="relative group bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-xl ${item.bg}`}>
        <item.icon size={20} className={item.color} />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{item.title}</h3>
    </div>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">
      {item.content}
    </p>
  </motion.div>
);

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
      <Background />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        {/* --- Hero Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 mb-6 backdrop-blur-sm">
            <Scale size={14} className="text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Legal Documentation
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-600">
            Terms of Service
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Transparent rules for a fair game. Please read these terms carefully before utilizing the CricSphere platform.
          </p>
          
          <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Effective: {EFFECTIVE_DATE}
            </span>
          </div>
        </motion.div>

        {/* --- CRITICAL DISCLAIMER SECTION --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-16"
        >
            <div className="bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Clock size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-2xl shrink-0">
                        <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            Service Limitations & Data Latency
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p>
                                <strong>Not Real-Time:</strong> While we strive for speed, CricSphere data is fetched at periodic intervals. Scores and commentary may lag behind live gameplay by several seconds or minutes depending on network conditions and source availability.
                            </p>
                            <p className="text-sm border-l-2 border-amber-500/50 pl-4 italic">
                                <strong>Limitation of Liability:</strong> CricSphere is an analytics tool for entertainment. We are not a gambling platform. We expressly disclaim any liability for financial losses, betting outcomes, or decisions made based on our data. Users engage in any form of fantasy sports or betting at their own risk and subject to local laws.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* --- General Terms Grid --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {legalSections.map((item) => (
            <LegalCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* --- Footer / Contact --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-10 flex flex-col items-center"
        >
          {/* Toggle Switcher */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-1 mb-6">
            <button className="px-6 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-sm font-semibold text-slate-900 dark:text-white cursor-default">
                Terms of Service
            </button>
            <Link 
                to="/privacy" 
                className="px-6 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center"
            >
                Privacy Policy
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 mb-8">
            <Mail size={16} />
            <a href="mailto:legal@cricsphere.com" className="hover:text-indigo-500 transition-colors">legal@cricsphere.com</a>
          </div>

          <p className="text-xs text-slate-400 text-center max-w-md">
            © 2025 CricSphere Analytics. <br/>
            All rights reserved. Unauthorized reproduction or distribution of this software or its data engine is strictly prohibited.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default TermsOfService;