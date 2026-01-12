import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/cricsphere-logo.png";
import { getCurrentMatches } from "../api/cricketApi";

/* ---------- CountUp ---------- */
const CountUp = ({ to = 0, duration = 800, suffix = "" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, to / (duration / 16));
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
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-slate-900 rounded-2xl p-4 w-full max-w-3xl border border-white/10"
        >
          <iframe
            className="w-full aspect-video rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
            allow="autoplay; fullscreen"
          />
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
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

  /* ---------- Fetch Live Matches ---------- */
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await getCurrentMatches();
        const list = res.data?.data || [];

        setMatches(list);

        const live = list.find(m =>
          !["won", "draw", "tie", "abandon", "result"].some(k =>
            m.status?.toLowerCase().includes(k)
          )
        );

        setLiveMatch(live || list[0] || null);
      } catch (e) {
        console.error("Live match fetch failed", e);
      }
    };

    fetchLive();
    const t = setInterval(fetchLive, 30000);
    return () => clearInterval(t);
  }, []);

  /* ---------- CRR + RRR ENGINE ---------- */
  let crr = null, rrr = null, runsLeft = null, oversLeft = null;

  if (liveMatch?.score?.length >= 2) {
    const first = liveMatch.score[0];
    const current = liveMatch.score[liveMatch.score.length - 1];

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

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600')] bg-cover bg-center opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ---------- LEFT ---------- */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} className="w-14 h-14" />
              <div className="text-xl font-black tracking-widest">CRICSPHERE</div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Live Cricket.<br />Real-Time Intelligence.
            </h1>

            <p className="text-slate-400 max-w-xl mb-8">
              The ultimate cricket broadcast hub for live scores, CRR, RRR,
              match analytics and schedules.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {["Live Scores", "CRR & RRR", "Match Analytics", "Schedules"].map(f => (
                <span key={f} className="px-4 py-1 bg-white/10 rounded-full text-xs">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex gap-10 mb-10">
              <div>
                <CountUp to={matches.length} />
                <p className="text-xs text-slate-400">Matches</p>
              </div>
              <div>
                <CountUp to={300} />
                <p className="text-xs text-slate-400">Players</p>
              </div>
              <div>
                <CountUp to={150000} suffix="+" />
                <p className="text-xs text-slate-400">Deliveries</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/home">
                <button className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition">
                  Enter Dashboard →
                </button>
              </Link>
              <button
                onClick={() => setTrailerOpen(true)}
                className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10"
              >
                Watch Trailer ▶
              </button>
            </div>
          </div>

          {/* ---------- RIGHT LIVE CARD ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {liveMatch ? (
              <>
                <div className="text-xs uppercase text-emerald-400 mb-2 animate-pulse">
                  LIVE MATCH
                </div>

                <h3 className="text-xl font-black mb-1">
                  {liveMatch.teams?.[0]} vs {liveMatch.teams?.[1]}
                </h3>

                <p className="text-slate-400 mb-6">
                  {liveMatch.matchType} • {liveMatch.venue?.split(",")[0]}
                </p>

                {liveMatch.score?.length > 0 && (
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-4xl font-black">
                        {liveMatch.score.at(-1).r}/{liveMatch.score.at(-1).w}
                      </div>
                      <div className="text-xs text-slate-400">
                        {liveMatch.score.at(-1).o} overs
                      </div>
                    </div>

                    <div className="text-right">
                      {crr && <div className="text-blue-400 font-bold">CRR {crr}</div>}
                      {rrr && <div className="text-emerald-400 font-bold">RRR {rrr}</div>}
                      {rrr && (
                        <div className="text-xs text-slate-500">
                          Need {runsLeft} in {oversLeft.toFixed(1)} ov
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-400">
                  {liveMatch.status}
                </div>
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
