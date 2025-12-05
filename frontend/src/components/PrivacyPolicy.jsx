import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Eye, FileText, 
  Server, Database, Globe, CheckCircle2,
  Fingerprint, Scale, AlertCircle, Terminal
} from 'lucide-react';

// --- Background Component (Consistent with App Theme) ---
const RetroGrid = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-30 pointer-events-none">
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};

// --- Status Badge ---
const ComplianceBadge = () => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 mb-8 backdrop-blur-md"
  >
    <Shield size={14} className="text-emerald-500" />
    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
      Protocol Verified
    </span>
    <span className="w-px h-3 bg-emerald-200 dark:bg-emerald-800 mx-1" />
    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500">
      Last Updated: Dec 2025
    </span>
  </motion.div>
);

// --- Section Card Component ---
const PolicySection = ({ number, title, icon: Icon, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.01 }}
    className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden"
  >
    {/* Hover Gradient */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
    
    <div className="flex flex-col md:flex-row gap-6 relative z-10">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
          <Icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
        </div>
        <div className="mt-4 text-center font-mono text-xs text-slate-300 dark:text-slate-600 font-bold">
          0{number}
        </div>
      </div>
      
      <div className="flex-grow">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          {title}
        </h2>
        <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden transition-colors duration-300">
      
      <RetroGrid />
      
      {/* Abstract Lighting */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-16 relative">
            <ComplianceBadge />
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Data Privacy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Protocols
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Transparency is the core of our architecture. Below is a detailed breakdown of how CricSphere handles, encrypts, and utilizes your data.
            </motion.p>
          </div>

          {/* Policy Document Container */}
          <div className="space-y-6 relative">
             {/* Connecting Line */}
             <div className="absolute left-[2.65rem] top-10 bottom-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            {/* Section 1: Ingestion */}
            <PolicySection number="1" title="Data Ingestion & Collection" icon={Database} delay={0.3}>
              <p>
                To provide millisecond-latency scores, we collect minimal data points essential for the application's performance.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Fingerprint size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium">Device ID & Type</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Globe size={16} className="text-blue-500" />
                  <span className="text-sm font-medium">Approx. Location (Region)</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Terminal size={16} className="text-purple-500" />
                  <span className="text-sm font-medium">App Usage Telemetry</span>
                </li>
              </ul>
            </PolicySection>

            {/* Section 2: Usage */}
            <PolicySection number="2" title="Processing Logic" icon={Server} delay={0.4}>
              <p>
                We process data to create a personalized match experience. Your data is used exclusively to:
              </p>
              <div className="space-y-3 mt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                  <span className="text-sm">Deliver push notifications for wickets and milestones for your favorite teams.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                  <span className="text-sm">Optimize our WebSocket connections based on regional server load.</span>
                </div>
              </div>
            </PolicySection>

            {/* Section 3: Security */}
            <PolicySection number="3" title="Encryption Standards" icon={Lock} delay={0.5}>
              <p>
                Security is not an afterthought; it is built into our Spring Boot architecture.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-sm border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <p className="mb-2"><span className="text-emerald-400">{">>"}</span> PROTOCOL: TLS 1.3</p>
                <p className="mb-2"><span className="text-emerald-400">{">>"}</span> AUTH: JWT (RS256 Signature)</p>
                <p><span className="text-emerald-400">{">>"}</span> DB_ENCRYPTION: AES-256-GCM</p>
              </div>
            </PolicySection>

            {/* Section 4: User Rights */}
            <PolicySection number="4" title="User Control" icon={Scale} delay={0.6}>
              <p>
                You retain full sovereignty over your data. At any point, you may request:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Data Export', 'Account Deletion', 'Opt-out of Analytics'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-default transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </PolicySection>

          </div>

          {/* Footer / Contact */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Privacy Officer</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                For detailed inquiries or data requests, contact our security team directly.
              </p>
              <a 
                href="mailto:privacy@cricsphere.com" 
                className="px-6 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                privacy@cricsphere.com
              </a>
            </div>
            
            <p className="mt-8 text-xs font-mono text-slate-400 dark:text-slate-600">
              ID: CS-POL-2025-V2.4 // ENCRYPTED
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;