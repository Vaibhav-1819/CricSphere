import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import logo from "../assets/cricsphere-logo.png";
// ✅ NEW (Synced)
import { getLiveMatches as getCurrentMatches } from "../services/api";/* ---------- 🧮 MATH ENGINE: Over Conversion ---------- */
const toFractionalOvers = (overs) => {
  if (!overs) return 0;
  const wholeOvers = Math.floor(overs);
  const balls = (overs % 1) * 10; // .1 -> 1, .3 -> 3
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

  return <span className="font-black text-3xl tabular-nums">{val.toLocaleString()}{suffix}</span>;
};

/* ---------- 🎥 Trailer Modal ---------- */
const TrailerModal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#111827] rounded-[2rem] p-2 w-full max-w-4xl border border-white/10 shadow-2xl"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
              title="CricSphere Trailer"
              allow="autoplay; fullscreen"
            />
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-colors"
          >
            Exit Theater
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

        // Find the most relevant live match (In-Progress)
        const live = list.find(m =>
          !["won", "draw", "tie", "abandon", "result", "complete"].some(k =>
            m.status?.toLowerCase().includes(k)
          )
        );
        setLiveMatch(live || list[0] || null);
      } catch (e) {
        console.error("Telemetry fetch failed", e);
      }
    };

    fetchLive();
    const t = setInterval(fetchLive, 30000); // 30s Refresh
    return () => clearInterval(t);
  }, []);

  /* ---------- CRR + RRR INTELLIGENCE ---------- */
  let crr = null, rrr = null, runsLeft = null, oversLeft = null;

  if (liveMatch?.score?.length >= 2) {
    const innings1 = liveMatch.score[0];
    const currentInnings = liveMatch.score[liveMatch.score.length - 1];
    
    const decimalOvers = toFractionalOvers(currentInnings.o);

    if (decimalOvers > 0) {
      crr = (currentInnings.r / decimalOvers).toFixed(2);
    }

    const formatLimit =
      liveMatch.matchType?.toLowerCase() === "t20" ? 20 :
      liveMatch.matchType?.toLowerCase() === "odi" ? 50 : null;

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
    <div className="min-h-screen bg-[#080a0f] text-white relative overflow-hidden flex items-center">
      {/* Background with modern masking */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f] via-[#080a0f]/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600" 
          className="w-full h-full object-cover opacity-30 grayscale"
          alt="Stadium"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ---------- LEFT CONTENT ---------- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <img src={logo} className="w-12 h-12" alt="Logo" />
              <div className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase">CricSphere Engine</div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter italic uppercase">
              Cricket.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Reimagined.</span>
            </h1>

            <p className="text-slate-400 max-w-lg mb-10 text-lg leading-relaxed">
              Experience lightning-fast telemetry, real-time RRR/CRR analytics, 
              and global match intelligence synced via Spring Boot.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {["Live Sync", "Precision Data", "Historical Vault", "Ball-by-Ball"].map(f => (
                <span key={f} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {f}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="flex gap-12 mb-12 border-l border-blue-500/30 pl-8">
              <div>
                <CountUp to={matches.length} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">Live Matches</p>
              </div>
              <div>
                <CountUp to={300} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">Nations</p>
              </div>
              <div>
                <CountUp to={150000} suffix="+" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">Datapoints</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/home">
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl shadow-white/5">
                  Enter Dashboard
                </button>
              </Link>
              <button
                onClick={() => setTrailerOpen(true)}
                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
              >
                Watch Trailer ▶
              </button>
            </div>
          </motion.div>

          {/* ---------- RIGHT TELEMETRY CARD ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-[#111827]/80 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative group"
          >
            <div className="absolute top-0 right-0 p-8">
               <Activity size={24} className="text-blue-500 opacity-20" />
            </div>

            {liveMatch ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Live Telemetry</div>
                </div>

                <div className="flex justify-between items-end mb-8">
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic">
                    {liveMatch.teams?.[0]} <span className="text-slate-700 text-xl not-italic font-light">vs</span> {liveMatch.teams?.[1]}
                  </h3>
                </div>

                {liveMatch.score?.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-6xl font-black tracking-tighter">
                          {liveMatch.score.at(-1).r}<span className="text-slate-700">/</span>{liveMatch.score.at(-1).w}
                        </div>
                        <div className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">
                          Overs: {liveMatch.score.at(-1).o}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        {crr && <div className="text-xl font-black text-blue-500">CRR {crr}</div>}
                        {rrr && <div className="text-xl font-black text-emerald-400">RRR {rrr}</div>}
                      </div>
                    </div>

                    {rrr && (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target Tracker</div>
                        <div className="text-sm font-bold">
                          Need <span className="text-emerald-400">{runsLeft}</span> runs in <span className="text-blue-400">{oversLeft.toFixed(1)}</span> overs
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  {liveMatch.status}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connecting to Stadium Feed...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </div>
  );
}