import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  Lock,
  Trash2,
  Database,
  FileText,
  UserCheck,
  Server,
  Globe,
  AlertCircle,
} from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "Jan 2026";

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] relative transition-colors">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#05070c] dark:via-[#05070c] dark:to-[#05070c]" />
        <div className="absolute inset-0 opacity-[0.20] dark:opacity-[0.10] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_55%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6"
          >
            <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              CricSphere Privacy Policy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Privacy Policy
          </motion.h1>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CricSphere is built to deliver live cricket scores, schedules, and stats
            with a clean dashboard experience. This policy explains what we collect,
            why we collect it, and how you control your data.
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-500">
            Last updated: <span className="font-medium">{lastUpdated}</span>
          </p>
        </header>

        {/* Quick summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <HudCard
            icon={<Eye size={18} />}
            title="No ad tracking"
            desc="We don’t sell your data or run behavioral ads."
          />
          <HudCard
            icon={<Lock size={18} />}
            title="Secure by default"
            desc="Data is protected using HTTPS and access controls."
          />
          <HudCard
            icon={<Trash2 size={18} />}
            title="You control deletion"
            desc="You can request account & data removal anytime."
          />
        </div>

        {/* Data table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden shadow-sm mb-10"
        >
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="text-blue-600 dark:text-blue-400" size={18} />
              Data we collect (summary)
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              We collect only what’s needed to run CricSphere smoothly.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#05070c]">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Why we need it</th>
                  <th className="px-6 py-4">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                <MatrixRow
                  label="Account details (email / auth ID)"
                  usage="Login, session management, and user preferences"
                  time="Until account deletion"
                />
                <MatrixRow
                  label="App usage (basic telemetry)"
                  usage="Improve performance, reduce errors, optimize caching"
                  time="Short-term (rolling window)"
                />
                <MatrixRow
                  label="Device / IP (limited)"
                  usage="Security, abuse prevention, regional API routing"
                  time="Up to 24 hours"
                />
                <MatrixRow
                  label="Favorites (teams / matches)"
                  usage="Personalized dashboard & quick access"
                  time="User-controlled"
                />
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-5">
          <PolicyCard
            icon={<FileText />}
            title="1. What CricSphere does"
            content={
              <>
                CricSphere provides a cricket dashboard experience including live
                scores, match schedules, series data, and player/team statistics.
                We use trusted sports data providers/APIs to fetch match data and
                show it inside the app.
              </>
            }
          />

          <PolicyCard
            icon={<Server />}
            title="2. Live data sources & caching"
            content={
              <>
                Live match data is fetched from third-party cricket data APIs.
                To reduce API usage and improve speed, CricSphere uses caching
                (temporary storage) so repeated requests don’t hit the provider
                unnecessarily. Cached data expires automatically after a short
                time (TTL).
              </>
            }
          />

          <PolicyCard
            icon={<UserCheck />}
            title="3. Your account & preferences"
            content={
              <>
                If you create an account, we store basic details like your
                authentication ID and preferences (example: favorite teams). We
                do not collect sensitive personal information such as passwords
                in plain text.
              </>
            }
          />

          <PolicyCard
            icon={<Lock />}
            title="4. Security"
            content={
              <>
                CricSphere uses standard security practices such as HTTPS, access
                rules, and server-side validation to protect your data. While no
                system can guarantee 100% security, we actively work to prevent
                unauthorized access and misuse.
              </>
            }
          />

          <PolicyCard
            icon={<Globe />}
            title="5. Cookies & analytics"
            content={
              <>
                CricSphere may use essential cookies/local storage for session
                state and app functionality. We do not use third-party ad trackers.
                If analytics are enabled, they are used only to improve product
                performance and reliability.
              </>
            }
          />

          <PolicyCard
            icon={<Trash2 />}
            title="6. Data deletion & export"
            content={
              <>
                You can request deletion of your CricSphere account and associated
                data. You may also request an export of your stored preferences
                (example: favorites) where applicable.
              </>
            }
          />

          <PolicyCard
            icon={<AlertCircle />}
            title="7. Contact"
            content={
              <>
                If you have questions about this Privacy Policy, you can contact us at{" "}
                <a
                  href="mailto:support@cricsphere.com"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  support@cricsphere.com
                </a>
                .
              </>
            }
          />
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            CricSphere is a student-built product demo. Policy text may be updated
            as features evolve.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Components ---------- */

const HudCard = ({ icon, title, desc }) => {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-200">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

const MatrixRow = ({ label, usage, time }) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
        {label}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {usage}
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
          {time}
        </span>
      </td>
    </tr>
  );
};

const PolicyCard = ({ icon, title, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-200">
          {React.cloneElement(icon, { size: 18 })}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
