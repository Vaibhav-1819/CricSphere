import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, Users, Lock, Server, Mail, 
  CheckCircle, FileText, AlertTriangle, Clock,
  Gavel, Ban, Globe, Scale, BookOpen, ExternalLink
} from 'lucide-react';

const EFFECTIVE_DATE = "December 1, 2025";

const legalSections = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Acceptance of Terms",
    summary: "By using CricSphere, you agree to these rules legally.",
    content: "By accessing CricSphere, you confirm that you are at least 18 years old and agree to be bound by these Terms. Access constitutes a binding digital signature.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: 2,
    icon: Users,
    title: "Account Integrity",
    summary: "Your password is your responsibility.",
    content: "You are responsible for safeguarding your password. CricSphere cannot and will not be liable for any loss or damage arising from your failure to comply with security obligations.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    id: 3,
    icon: Server,
    title: "API & Data Usage",
    summary: "Our data comes from 3rd parties and isn't guaranteed.",
    content: "Our service aggregates data from third-party cricket telemetry providers. We act as a data processor, not a data creator. Service is provided on an 'AS IS' basis.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    id: 4,
    icon: Lock,
    title: "Intellectual Property",
    summary: "Don't steal our code or data algorithms.",
    content: "The CricSphere source code, algorithms, and UI design are exclusive property of CricSphere. You agree not to reverse-engineer or scrape our proprietary data engine.",
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    id: 5,
    icon: Ban,
    title: "Prohibited Uses",
    summary: "No hacking, scraping, or betting syndication.",
    content: "You may not use the service for any illegal purpose, including but not limited to: unauthorized betting syndication, match-fixing analysis, or automated scraping.",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    id: 6,
    icon: Globe,
    title: "Jurisdiction",
    summary: "We follow the laws of India.",
    content: "These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  }
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
      
      {/* --- PROGRESS HUD (Fixed to Top) --- */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-[60]">
        <motion.div 
          className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: false }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-20">
          <div className="flex flex-col items-start gap-4 mb-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20">
              <Scale size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Legal Framework 2.1</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <p className="max-w-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Standard operating procedures for the CricSphere telemetry engine. Updated {EFFECTIVE_DATE}.
            </p>
          </div>
        </header>

        {/* --- DUAL PANEL LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Legal Clauses (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {legalSections.map((item) => (
              <motion.section 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl ${item.bg} group-hover:rotate-12 transition-transform`}>
                    <item.icon size={24} className={item.color} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h3>
                </div>
                
                <div className="pl-2 border-l-2 border-slate-100 dark:border-slate-800 group-hover:border-blue-500/50 transition-colors">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                    {item.content}
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center gap-3">
                        <BookOpen size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Summary: {item.summary}</span>
                    </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* Sticky Disclaimer Panel (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              
              {/* Gambling Warning */}
              <div className="bg-amber-500 text-white rounded-[2rem] p-8 shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <AlertTriangle size={120} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Shield size={18} /> High Alert
                </h3>
                <h2 className="text-2xl font-black mb-4 leading-tight uppercase italic">No Gambling Policy</h2>
                <p className="text-xs font-bold leading-relaxed text-white/90">
                    CricSphere is an analytics platform. We are NOT a betting site. Use of our data for illegal gambling is strictly prohibited. We are not liable for financial losses.
                </p>
              </div>

              {/* Quick Links */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Internal Navigation</h3>
                <nav className="space-y-3">
                  <LegalLink to="/privacy" label="Privacy Data Policy" />
                  <LegalLink to="/about" label="Tech Architecture" />
                  <LegalLink to="/contact" label="Legal Inquiries" />
                </nav>
              </div>

              {/* Data Transparency Card */}
              <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10 text-center">
                 <Clock size={32} className="mx-auto text-blue-600 mb-4 opacity-50" />
                 <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-loose">
                    Latency Disclaimer: Data may lag by 5-10s based on node availability.
                 </p>
              </div>

            </div>
          </aside>
        </div>

        {/* --- FOOTER CTA --- */}
        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">End of Document</p>
            <Link to="/home" className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
                I Understand
            </Link>
        </div>

      </div>
    </div>
  );
};

const LegalLink = ({ to, label }) => (
  <Link to={to} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent hover:border-blue-500/20 group transition-all">
    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600">{label}</span>
    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600" />
  </Link>
);

const ChevronRight = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default TermsOfService;