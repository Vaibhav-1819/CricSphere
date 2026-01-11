import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Eye, FileText, 
  Server, Database, Globe, CheckCircle2,
  Fingerprint, Scale, AlertCircle, Terminal,
  Zap, ShieldCheck, UserCheck, Trash2
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080a0f] font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* --- AMBIENT TECH BACKGROUND --- */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute h-full w-full bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* --- HEADER BLOCK --- */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 backdrop-blur-xl"
          >
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              GDPR & CCPA Compliant Engine
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
          >
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Shield</span>
          </motion.h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            At CricSphere, your data is treated like a prize wicket—protected at all costs. We only collect what we need to power your live experience.
          </p>
        </header>

        {/* --- PRIVACY HUD (Quick Digest for Fans) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <HudCard icon={<Eye size={20}/>} title="Zero Tracking" desc="No 3rd party ad trackers or behavioral cookies." />
            <HudCard icon={<Lock size={20}/>} title="End-to-End" desc="Telemetry data is encrypted via TLS 1.3." />
            <HudCard icon={<Trash2 size={20}/>} title="Right to Erase" desc="Delete your entire data history in 1-click." />
        </div>

        {/* --- DATA TRANSPARENCY MATRIX --- */}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden mb-12 shadow-2xl shadow-emerald-500/5"
        >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Database className="text-emerald-500" /> Data Transparency Matrix
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-950">
                        <tr>
                            <th className="px-8 py-4">Data Point</th>
                            <th className="px-8 py-4">Usage Purpose</th>
                            <th className="px-8 py-4">Retention</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <MatrixRow label="Auth Credentials" usage="Secure session & JWT management" time="Until account deletion" />
                        <MatrixRow label="Region / IP" usage="Live score node optimization" time="24 Hours (Volatile)" />
                        <MatrixRow label="Favorite Teams" usage="Push Notification personalization" time="User-controlled" />
                    </tbody>
                </table>
            </div>
        </motion.div>

        {/* --- DETAILED PROTOCOLS --- */}
        <div className="space-y-6">
            <ProtocolCard 
                number="01" 
                title="Encryption Architecture" 
                icon={<Terminal />}
                content="Our Spring Boot backend utilizes AES-256-GCM encryption for all database records. Authentication is handled via RS256 Signed JWTs, ensuring your identity cannot be forged or intercepted during match updates."
            />
            <ProtocolCard 
                number="02" 
                title="User Sovereignty" 
                icon={<UserCheck />}
                content="CricSphere operates on the principle of 'Data Portability'. You can export your interaction history, favorite team preferences, and account logs at any time via your profile settings."
            />
        </div>

        {/* --- FOOTER CTA --- */}
        <footer className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-8 max-w-sm text-center">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                    Have questions about our telemetry data? <br/> Reach our Data Protection Officer at:
                </p>
                <a href="mailto:dpo@cricsphere.com" className="text-emerald-500 font-black text-sm hover:underline mt-2 inline-block">dpo@cricsphere.com</a>
            </div>
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">Secure Environment // Dec 2025</p>
        </footer>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const HudCard = ({ icon, title, desc }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase">{desc}</p>
    </div>
);

const MatrixRow = ({ label, usage, time }) => (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
        <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-slate-200">{label}</td>
        <td className="px-8 py-5 text-xs font-medium text-slate-500 dark:text-slate-400">{usage}</td>
        <td className="px-8 py-5">
            <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400">
                {time}
            </span>
        </td>
    </tr>
);

const ProtocolCard = ({ number, title, icon, content }) => (
    <div className="flex gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 group transition-all">
        <div className="hidden md:flex flex-col items-center shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <div className="mt-4 text-[10px] font-black text-slate-300 dark:text-slate-700 tracking-tighter">{number}</div>
        </div>
        <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{title}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {content}
            </p>
        </div>
    </div>
);

export default PrivacyPolicy;