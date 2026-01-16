import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Database,
  Code,
  Globe,
  Server,
  Layers,
  Activity,
  Shield,
  Wifi,
  Linkedin,
  Github,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: Activity,
      title: "Live match updates",
      desc: "Fast refresh + clean live telemetry so you stay updated without noise.",
    },
    {
      icon: Zap,
      title: "Performance-first",
      desc: "Caching + optimized requests to keep the app responsive and quota-safe.",
    },
    {
      icon: Shield,
      title: "Reliable experience",
      desc: "Focused UI, no clutter, and a dashboard that feels like a real product.",
    },
    {
      icon: Database,
      title: "Deep cricket data",
      desc: "Scores, schedules, series, and stats — structured and easy to explore.",
    },
    {
      icon: Globe,
      title: "Global coverage",
      desc: "International + domestic matches supported through trusted data sources.",
    },
    {
      icon: Layers,
      title: "Modern UI system",
      desc: "Tailwind-based design system with smooth animations and clean layout.",
    },
  ];

  const stack = [
    { name: "React", icon: Code },
    { name: "Spring Boot", icon: Server },
    { name: "PostgreSQL", icon: Database },
    { name: "Tailwind CSS", icon: Layers },
    { name: "WebSocket", icon: Wifi },
    { name: "API Caching", icon: Zap },
  ];

  const comingSoon = (name) => alert(`${name} is coming soon! 🚀`);

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] transition-colors">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#05070c] dark:via-[#05070c] dark:to-[#05070c]" />
        <div className="absolute inset-0 opacity-[0.20] dark:opacity-[0.10] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_55%)]" />
      </div>

      {/* HERO */}
      <section className="pt-24 pb-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            About CricSphere
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Built for cricket fans who love{" "}
            <span className="text-slate-500 dark:text-slate-400">clarity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            CricSphere is a modern cricket dashboard focused on live scores,
            match schedules, and stats — with a clean UI and fast performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-3"
          >
            <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition inline-flex items-center justify-center gap-2">
              Explore Dashboard <ArrowRight size={16} />
            </button>

            <button className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition">
              Read Our Story
            </button>
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-7 shadow-sm"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Why CricSphere exists
            </h2>

            <p className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Most cricket apps feel cluttered and slow — too many ads, too many
              distractions, and not enough useful match context.
            </p>

            <p className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              CricSphere was built to solve that with a clean UI, fast live match
              refresh, and structured cricket data that feels like a modern
              product.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                <Activity size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Product-first dashboard experience
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Designed to feel clean and reliable.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Minimal preview card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-7 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Live Match Preview
              </p>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300">
                Live
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#05070c] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    IND vs AUS
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    18.4 overs • CRR 10.02
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                    184<span className="text-slate-400">/</span>3
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Updated moments ago
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  Win%: 63
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  RRR: 8.40
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  4s/6s: 18/7
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean match context with quick insights — without clutter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 px-6 bg-slate-50/60 dark:bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              What we focus on
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for speed, depth, and usability
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              CricSphere keeps the experience minimal while still delivering
              powerful cricket data.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Tech Stack
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Modern stack, production mindset
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              CricSphere is built using modern frontend + backend tools to keep
              performance high and the UI consistent.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stack.map((t) => (
              <TechPill key={t.name} name={t.name} icon={t.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPER */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#05070c] flex items-center justify-center">
              <Code size={22} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Vaibhav Bharathula
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Full Stack Developer • Building CricSphere with a clean product UI
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "Spring Boot", "API Integration", "System Design"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => comingSoon("LinkedIn Profile")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                  <Linkedin size={18} />
                  LinkedIn
                  <ExternalLink size={14} className="opacity-70" />
                </button>

                <button
                  onClick={() => comingSoon("GitHub Profile")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition"
                >
                  <Github size={18} />
                  GitHub
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-xs text-center text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} CricSphere • Built with ❤️ by Vaibhav
          </p>
        </div>
      </section>
    </div>
  );
};

/* ---------- Components ---------- */

const FeatureCard = ({ icon: Icon, title, desc, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#05070c] flex items-center justify-center text-slate-700 dark:text-slate-200">
        <Icon size={18} className="text-blue-600 dark:text-blue-400" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

const TechPill = ({ name, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 shadow-sm transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#05070c] flex items-center justify-center">
          <Icon size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {name}
        </p>
      </div>
    </motion.div>
  );
};

export default AboutUs;
