import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import logo from "../assets/cricsphere-logo.png";
import { getLiveMatches as getCurrentMatches } from "../services/api";

/* ---------- 🧮 MATH ENGINE: Over Conversion ---------- */
const toFractionalOvers = (oversStr) => {
  if (!oversStr) return 0;

  // oversStr can be like "12.3" meaning 12 overs + 3 balls
  const parts = String(oversStr).split(".");
  const wholeOvers = parseInt(parts[0] || "0", 10);
  const balls = parseInt(parts[1] || "0", 10);

  // balls are out of 6
  return wholeOvers + balls / 6;
};

/* ---------- 📈 CountUp Component ---------- */
const CountUp = ({ to = 0, duration = 800, suffix = "" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to || 0, 10);
    if (!end) {
      setVal(0);
      return;
    }

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

/* ---------- 🟢 MAIN INTRO SECTION ---------- */
export default function IntroSection() {
  const [trailerOpen, setTrailerOpen] = useState(false);

  // full flattened list of matches from RapidAPI
  const [matches, setMatches] = useState([]);
  const [liveMatch, setLiveMatch] = useState(null);

  const [loadingLive, setLoadingLive] = useState(true);

  /* ---------- Helper: determine match finished ---------- */
  const isMatchDone = (status = "") => {
    const s = String(status).toLowerCase();
    return ["won", "draw", "tie", "abandon", "result", "complete"].some((k) =>
      s.includes(k)
    );
  };

  /* ---------- RapidAPI Live Fetch Engine ---------- */
  useEffect(() => {
    let mounted = true;

    const flattenMatchesFromRapid = (raw) => {
      // RapidAPI structure:
      // data.typeMatches[].seriesMatches[].seriesAdWrapper.matches[]
      const list =
        raw?.typeMatches?.flatMap((tm) =>
          tm?.seriesMatches?.flatMap(
            (sm) => sm?.seriesAdWrapper?.matches || []
          )
        ) || [];

      return Array.isArray(list) ? list : [];
    };

    const fetchLive = async () => {
      try {
        setLoadingLive(true);

        const res = await getCurrentMatches();
        const raw = res?.data;

        const list = flattenMatchesFromRapid(raw);

        if (!mounted) return;

        setMatches(list);

        // Pick ONE live match (first not completed)
        const oneLive =
          list.find((m) => !isMatchDone(m?.matchInfo?.status)) || list[0] || null;

        setLiveMatch(oneLive);
      } catch (e) {
        console.error("Telemetry fetch failed", e);
        if (mounted) {
          setMatches([]);
          setLiveMatch(null);
        }
      } finally {
        if (mounted) setLoadingLive(false);
      }
    };

    fetchLive();

    // refresh every 30s (frontend refresh) but backend TTL protects RapidAPI quota
    const t = setInterval(fetchLive, 30000);

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  /* ---------- Match Derived Values (CRR/RRR) ---------- */
  const derived = useMemo(() => {
    if (!liveMatch) {
      return {
        team1: "Team 1",
        team2: "Team 2",
        status: "No live match found",
        runs: 0,
        wkts: 0,
        overs: "0.0",
        crr: null,
        rrr: null,
        runsLeft: null,
        oversLeft: null,
      };
    }

    const info = liveMatch?.matchInfo;
    const score = liveMatch?.matchScore;

    const team1 = info?.team1?.teamName || "Team 1";
    const team2 = info?.team2?.teamName || "Team 2";
    const status = info?.status || "Match status unavailable";

    // Try to extract current innings score safely
    // Usually live match uses team1Score/team2Score with inngs1 etc.
    const team1Inng = score?.team1Score?.inngs1 || null;
    const team2Inng = score?.team2Score?.inngs1 || null;

    // Decide current batting innings:
    // If team2 innings exists => chase is on
    const currentInng = team2Inng || team1Inng || null;

    const runs = currentInng?.runs || 0;
    const wkts = currentInng?.wickets || 0;
    const overs = currentInng?.overs || "0.0";

    // CRR
    const decimalOvers = toFractionalOvers(overs);
    const crr = decimalOvers > 0 ? (runs / decimalOvers).toFixed(2) : null;

    // RRR (only for limited overs and if chase is happening)
    const matchType = String(info?.matchFormat || info?.matchType || "")
      .toLowerCase()
      .trim();

    const formatLimit =
      matchType === "t20" ? 20 : matchType === "odi" ? 50 : null;

    let rrr = null;
    let runsLeft = null;
    let oversLeft = null;

    // Only calculate target if innings1 exists and innings2 exists (chase)
    if (team1Inng && team2Inng && formatLimit) {
      const target = (team1Inng?.runs || 0) + 1;
      runsLeft = target - (team2Inng?.runs || 0);
      oversLeft = formatLimit - toFractionalOvers(team2Inng?.overs || "0.0");

      if (runsLeft > 0 && oversLeft > 0) {
        rrr = (runsLeft / oversLeft).toFixed(2);
      }
    }

    return {
      team1,
      team2,
      status,
      runs,
      wkts,
      overs,
      crr,
      rrr,
      runsLeft,
      oversLeft,
    };
  }, [liveMatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-white relative">
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
                CricSphere • Version 2.1
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
                  Live Now
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time Updates
                </p>
              </div>
              <Activity className="text-slate-400" size={18} />
            </div>

            {loadingLive ? (
              <div className="py-14 text-center">
                <div className="w-9 h-9 border-2 border-slate-200 dark:border-white/10 border-t-slate-900 dark:border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Loading live match feed...
                </p>
              </div>
            ) : liveMatch ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    {derived.team1}{" "}
                    <span className="text-slate-400 font-normal">vs</span>{" "}
                    {derived.team2}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {derived.status}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold tracking-tight">
                        {derived.runs}
                        <span className="text-slate-400">/</span>
                        {derived.wkts}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Overs: {derived.overs}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      {derived.crr && (
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          CRR: {derived.crr}
                        </div>
                      )}
                      {derived.rrr && (
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          RRR: {derived.rrr}
                        </div>
                      )}
                    </div>
                  </div>

                  {derived.rrr && derived.runsLeft != null && derived.oversLeft != null && (
                    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Target Tracker
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        Need{" "}
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {derived.runsLeft}
                        </span>{" "}
                        runs in{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                          {Number(derived.oversLeft).toFixed(1)}
                        </span>{" "}
                        overs
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-14 text-center">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  No live match found right now.
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
