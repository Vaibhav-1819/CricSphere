import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Lock,
  Server,
  CheckCircle,
  AlertTriangle,
  Clock,
  Scale,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const EFFECTIVE_DATE = "December 1, 2025";

/* ==========================================================
   CONTENT
========================================================== */
const legalSections = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Acceptance of Terms",
    summary: "Using CricSphere means you agree to these Terms.",
    content:
      "By accessing or using CricSphere, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    icon: Users,
    title: "Account Responsibility",
    summary: "Keep your account secure and private.",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. CricSphere is not responsible for any activity that occurs under your account.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 3,
    icon: Server,
    title: "Data & Service Availability",
    summary: "Match data comes from third-party providers.",
    content:
      "CricSphere displays cricket data sourced from third-party providers. We do our best to keep information accurate and timely, but we do not guarantee completeness or uninterrupted availability.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: 4,
    icon: Lock,
    title: "Intellectual Property",
    summary: "CricSphere content and design are protected.",
    content:
      "All branding, UI design, and platform functionality are owned by CricSphere. You may not copy, modify, distribute, or reverse engineer any part of the service without permission.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    id: 5,
    icon: Shield,
    title: "Prohibited Activities",
    summary: "No misuse, scraping, or illegal usage.",
    content:
      "You may not misuse CricSphere, including attempting unauthorized access, scraping content, abusing APIs, or using the platform for illegal activities.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: 6,
    icon: Scale,
    title: "Governing Law",
    summary: "These Terms are governed by Indian law.",
    content:
      "These Terms shall be governed by the laws of India. Any disputes shall be handled in the appropriate courts under applicable jurisdiction.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

/* ==========================================================
   HOOK: SCROLL PROGRESS (Real)
========================================================== */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;

      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }

      setProgress((scrollTop / scrollHeight) * 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
};

/* ==========================================================
   SMALL COMPONENTS
========================================================== */
const LegalLink = ({ to, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] hover:border-blue-500/40 transition-all"
  >
    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </span>
    <ChevronRight size={16} className="text-slate-400" />
  </Link>
);

/* ==========================================================
   PAGE
========================================================== */
export default function TermsOfService() {
  const progress = useScrollProgress();

  const sections = useMemo(() => legalSections, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
      {/* REAL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 z-[60]">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-16">
        {/* HEADER */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold">
            <Scale size={14} />
            Terms of Service
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
            CricSphere Terms
          </h1>

          <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            These Terms explain how CricSphere works and what we expect from users.
            Effective date: <span className="font-semibold">{EFFECTIVE_DATE}</span>
          </p>
        </header>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-8 space-y-5">
            {sections.map((item) => (
              <motion.section
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-5 md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border border-black/10 dark:border-white/10 ${item.bg}`}
                  >
                    <item.icon size={18} className={item.color} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-extrabold">{item.title}</h3>
                    <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-4 py-3">
                      <BookOpen size={14} className="text-blue-500" />
                      <p className="text-[12px] font-semibold text-slate-500">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              {/* WARNING */}
              <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-amber-600" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-extrabold">No Gambling Policy</h4>
                    <p className="mt-1 text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      CricSphere is an information platform. We do not support or
                      promote betting or gambling.
                    </p>
                  </div>
                </div>
              </div>

              {/* LINKS */}
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-4">
                  Quick Links
                </p>

                <div className="space-y-3">
                  <LegalLink to="/privacy" label="Privacy Policy" />
                  <LegalLink to="/about" label="About CricSphere" />
                  <LegalLink to="/contact" label="Contact Support" />
                </div>
              </div>

              {/* NOTE */}
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-5 text-center">
                <Clock size={22} className="mx-auto text-blue-500 mb-2" />
                <p className="text-[12px] font-semibold text-slate-500">
                  Data timing may vary slightly depending on provider availability.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER CTA */}
        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col items-center">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-5">
            End of Terms
          </p>

          <Link
            to="/home"
            className="px-10 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-wide transition-all"
          >
            I Understand
          </Link>
        </div>
      </div>
    </div>
  );
}
