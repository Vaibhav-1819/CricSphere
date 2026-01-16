import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, MessageSquare, User, Send, CheckCircle2 } from "lucide-react";

const Contact = () => {
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 2500);
  };

  const fieldWrap = (key) =>
    `flex items-center gap-3 rounded-2xl border bg-white dark:bg-white/5 px-5 py-4 transition-all shadow-sm
     ${
       focused === key
         ? "border-blue-500/50 ring-4 ring-blue-500/10"
         : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
     }`;

  return (
    <section id="contact" className="relative py-24 bg-white dark:bg-[#05070c]">
      {/* Subtle background (same as AboutSection) */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#05070c] dark:via-[#05070c] dark:to-[#05070c]" />
        <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_55%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400"
          >
            Contact CricSphere
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Need help? Let’s talk.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-4 text-base text-slate-600 dark:text-slate-400"
          >
            Share your issue, feature request, or feedback. We’ll respond with a
            clean and quick resolution.
          </motion.p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left info cards */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Support Channels
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Reach out for live score issues, schedule mismatches, stats
                errors, or UI feedback.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="mailto:support@cricsphere.com"
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail size={18} />
                  support@cricsphere.com
                </a>

                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <MapPin size={18} />
                  Hyderabad, India
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <MiniCard
                icon={<MessageSquare size={18} />}
                title="Fast replies"
                desc="We respond quickly with clear updates."
              />
              <MiniCard
                icon={<CheckCircle2 size={18} />}
                title="Clean support"
                desc="No spam. No noise. Only solutions."
              />
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Send a message
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Fill in the form below and we’ll get back soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <div className={fieldWrap("first") + " mt-2"}>
                    <User size={18} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Vaibhav"
                      onFocus={() => setFocused("first")}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <div className={fieldWrap("last") + " mt-2"}>
                    <input
                      type="text"
                      placeholder="Ram"
                      onFocus={() => setFocused("last")}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className={fieldWrap("email") + " mt-2"}>
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    placeholder="yourmail@gmail.com"
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>

                <div
                  className={`rounded-2xl border bg-white dark:bg-white/5 px-5 py-4 transition-all shadow-sm mt-2
                  ${
                    focused === "msg"
                      ? "border-blue-500/50 ring-4 ring-blue-500/10"
                      : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <textarea
                    rows={5}
                    placeholder="Tell us what you need help with..."
                    onFocus={() => setFocused("msg")}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                    required
                  />
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full rounded-2xl py-4 text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2
                ${
                  sent
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-white hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      Message sent
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      Send message
                      <Send size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                We’ll respond within 24 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const MiniCard = ({ icon, title, desc }) => {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
      <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-200">
        {icon}
      </div>

      <h4 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h4>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

export default Contact;
