import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/cricsphere-logo.png";

/* ---------- CountUp ---------- */
const CountUp = ({ to = 0, duration = 900, suffix = "" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = to / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(id);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [to, duration]);

  return <span className="font-extrabold text-2xl">{val}{suffix}</span>;
};

/* ---------- Trailer Modal ---------- */
const TrailerModal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      >
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 rounded-xl p-6 w-full max-w-2xl">
          <iframe
            className="w-full h-80 rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            allow="autoplay"
          />
          <button onClick={onClose} className="mt-4 w-full py-2 bg-blue-600 rounded-lg">Close</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function IntroSection() {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [liveMatch, setLiveMatch] = useState(null);

  /* ---------- Fetch Live Match ---------- */
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/v1/cricket/current-matches");
        const json = await res.json();
        const matches = json?.data || [];

        const live = matches.find(m =>
          !["won", "draw", "tie", "abandon", "result"].some(k =>
            m.status?.toLowerCase().includes(k)
          )
        );

        setLiveMatch(live || matches[0]);
      } catch (e) {
        console.error("Failed to load live match", e);
      }
    };

    fetchLive();
    const i = setInterval(fetchLive, 30000);
    return () => clearInterval(i);
  }, []);

  /* ---------- CRR + RRR ---------- */
  let crr = null, rrr = null, runsLeft = null, oversLeft = null;

  if (liveMatch?.score?.length >= 2) {
    const first = liveMatch.score[0];
    const current = liveMatch.score[1];

    if (current?.o > 0) {
      crr = (current.r / current.o).toFixed(2);
    }

    const totalOvers =
      liveMatch.matchType?.toLowerCase() === "t20" ? 20 :
      liveMatch.matchType?.toLowerCase() === "odi" ? 50 : null;

    if (first && current && totalOvers) {
      const target = first.r + 1;
      runsLeft = target - current.r;
      oversLeft = totalOvers - current.o;
      if (oversLeft > 0) {
        rrr = (runsLeft / oversLeft).toFixed(2);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white relative overflow-hidden">

      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600')] bg-cover bg-center opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} className="w-16 h-16" />
              <div className="text-xl font-black">CRICSPHERE</div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Live Cricket.<br />Real-Time Intelligence.
            </h1>

            <p className="text-slate-400 max-w-xl mb-8">
              Your all-in-one cricket command center for live scores, CRR, RRR and broadcast-grade visuals.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {["Live Scores", "CRR & RRR", "Match Analytics", "Shareable Scorecards"].map(f => (
                <span key={f} className="px-4 py-1 bg-white/10 rounded-full text-xs">{f}</span>
              ))}
            </div>

            <div className="flex gap-10 mb-10">
              <div><CountUp to={12} /><p className="text-xs text-slate-400">Live Matches</p></div>
              <div><CountUp to={420} /><p className="text-xs text-slate-400">Players</p></div>
              <div><CountUp to={120000} suffix="+" /><p className="text-xs text-slate-400">Deliveries</p></div>
            </div>

            <div className="flex gap-4">
              <Link to="/home">
                <button className="px-6 py-3 bg-white text-black rounded-full font-bold">Enter Dashboard →</button>
              </Link>
              <button onClick={() => setTrailerOpen(true)} className="px-6 py-3 border border-white/20 rounded-full">
                Watch Trailer ▶
              </button>
            </div>
          </div>

          {/* RIGHT SIDE – REAL LIVE MATCH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {liveMatch ? (
              <>
                <div className="text-xs uppercase text-emerald-400 mb-2 animate-pulse">LIVE MATCH</div>
                <h3 className="text-xl font-black mb-1">
                  {liveMatch.teams[0]} vs {liveMatch.teams[1]}
                </h3>
                <p className="text-slate-400 mb-6">
                  {liveMatch.matchType} • {liveMatch.venue?.split(",")[0]}
                </p>

                {liveMatch.score?.[1] && (
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-4xl font-black">
                        {liveMatch.score[1].r}/{liveMatch.score[1].w}
                      </div>
                      <div className="text-xs text-slate-400">
                        {liveMatch.score[1].o} overs
                      </div>
                    </div>
                    <div className="text-right">
                      {crr && <div className="text-blue-400 font-bold">CRR {crr}</div>}
                      {rrr && <div className="text-emerald-400 font-bold">RRR {rrr}</div>}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-400">{liveMatch.status}</div>
              </>
            ) : (
              <div className="text-slate-400">Loading live match…</div>
            )}
          </motion.div>

        </div>
      </div>

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </div>
  );
}
