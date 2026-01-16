import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const aboutCards = [
    {
      title: "Real-time precision",
      desc: "Live match updates with clean telemetry and fast refresh cycles.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Global coverage",
      desc: "From franchise leagues to ICC tournaments — all in one dashboard.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Historical depth",
      desc: "Explore match archives, player profiles, and performance history.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-white dark:bg-[#05070c]">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#05070c] dark:via-[#05070c] dark:to-[#05070c]" />
        <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_55%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          <StatCard value="50+" label="Global leagues" />
          <StatCard value="24/7" label="Live telemetry" badge="Live" />
          <StatCard value="100%" label="Data sync" />
          <StatCard value="10k+" label="Analyst insights" />
        </motion.div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400"
          >
            About CricSphere
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Built for speed, clarity, and cricket intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-4 text-base text-slate-600 dark:text-slate-400"
          >
            CricSphere delivers clean live scoring, match context, and stats —
            designed with a modern product-first experience.
          </motion.p>
        </div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {aboutCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-200">
                {card.icon}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const StatCard = ({ value, label, badge }) => {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-5 text-left shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {value}
        </p>

        {badge && (
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
};

export default AboutSection;
