import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import logo from "../assets/cricsphere-logo.png";
import { getLiveMatches as getCurrentMatches } from "../services/api";

/* ---------- 🧮 MATH ENGINE: Over Conversion ---------- */
const toFractionalOvers = (overs) => {
  if (!overs) return 0;
  const wholeOvers = Math.floor(overs);
  const balls = (overs % 1) * 10;
  return wholeOvers + balls / 6;
};

/* ---------- 📈 CountUp Component ---------- */
const CountUp = ({ to = 0, duration = 800, suffix = "" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to);
    if (end === 0) return;
    const step = Math.max(1, end / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= end) {
        setVal(end);
        clearInterval(id);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [to, duration]);

  return (
    <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ---------- 🎥 Trailer Modal ---------- */
const TrailerModal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.96, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 20 }}
          className="bg-white dark:bg-[#0b1220] rounded-2xl p-3 w-full max-w-4xl border border-black/10 dark:border-white/10 shadow-2xl"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
              title="CricSphere Trailer"
              allow="autoplay; fullscreen"
            />
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function IntroSection() {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [liveMatch, setLiveMatch] = useState(null);
  const [matches, setMatches] = useState([]);

  /* ---------- Fetch Live Engine ---------- */
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await getCurrentMatches();
        const list = res.data?.data || [];
        setMatches(list);

        const live = list.find(
          (m) =>
            !["won", "draw", "tie", "abandon", "result", "complete"].some((k) =>
              m.status?.toLowerCase().includes(k)
            )
        );

        setLiveMatch(live || list[0] || null);
      } catch (e) {
        console.error("Telemetry fetch failed", e);
      }
    };

    fetchLive();
    const t = setInterval(fetchLive, 30000);
    return () => clearInterval(t);
  }, []);

  /* ---------- CRR + RRR INTELLIGENCE ---------- */
  let crr = null,
    rrr = null,
    runsLeft = null,
    oversLeft = null;

  if (liveMatch?.score?.length >= 2) {
    const innings1 = liveMatch.score[0];
    const currentInnings = liveMatch.score[liveMatch.score.length - 1];

    const decimalOvers = toFractionalOvers(currentInnings.o);

    if (decimalOvers > 0) {
      crr = (currentInnings.r / decimalOvers).toFixed(2);
    }

    const formatLimit =
      liveMatch.matchType?.toLowerCase() === "t20"
        ? 20
        : liveMatch.matchType?.toLowerCase() === "odi"
        ? 50
        : null;

    if (innings1 && currentInnings && formatLimit) {
      const target = innings1.r + 1;
      runsLeft = target - currentInnings.r;
      oversLeft = formatLimit - decimalOvers;

      if (oversLeft > 0 && runsLeft > 0) {
        rrr = (runsLeft / (formatLimit - decimalOvers)).toFixed(2);
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white">
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#05070c] dark:via-[#05070c] dark:to-[#05070c]" />
        <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_55%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} className="w-10 h-10" alt="Logo" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                CricSphere • Version 2.0
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Real-time cricket data.
              <br />
              <span className="text-slate-500 dark:text-slate-400">
                Clean. Fast. Reliable.
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Track live matches with CRR/RRR analytics, match telemetry and
              insights — built for a smooth, modern cricket experience.
            </p>

            {/* Metrics */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                <CountUp to={matches.length} />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Live Matches
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                <CountUp to={300} />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Coverage
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                <CountUp to={150000} suffix="+" />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Data Points
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/home">
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition shadow-sm">
                  Open Dashboard
                </button>
              </Link>

              <button
                onClick={() => setTrailerOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition"
              >
                Watch Preview
              </button>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Live Match
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-refresh every 30s
                </p>
              </div>
              <Activity className="text-slate-400" size={18} />
            </div>

            {liveMatch ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    {liveMatch.teams?.[0]}{" "}
                    <span className="text-slate-400 font-normal">vs</span>{" "}
                    {liveMatch.teams?.[1]}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {liveMatch.status}
                  </p>
                </div>

                {liveMatch.score?.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-4xl font-bold tracking-tight">
                          {liveMatch.score.at(-1).r}
                          <span className="text-slate-400">/</span>
                          {liveMatch.score.at(-1).w}
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Overs: {liveMatch.score.at(-1).o}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        {crr && (
                          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            CRR: {crr}
                          </div>
                        )}
                        {rrr && (
                          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            RRR: {rrr}
                          </div>
                        )}
                      </div>
                    </div>

                    {rrr && (
                      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Target Tracker
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          Need{" "}
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {runsLeft}
                          </span>{" "}
                          runs in{" "}
                          <span className="text-blue-600 dark:text-blue-400">
                            {oversLeft.toFixed(1)}
                          </span>{" "}
                          overs
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-14 text-center">
                <div className="w-9 h-9 border-2 border-slate-200 dark:border-white/10 border-t-slate-900 dark:border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Loading live match feed...
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </div>
  );
}
