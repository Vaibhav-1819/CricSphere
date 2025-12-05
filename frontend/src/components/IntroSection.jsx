import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/cricsphere-logo.png'; // adjust path if needed

// --- small numeric counter used in the hero ---
const CountUp = ({ to = 0, duration = 900, suffix = '', startAt = 0, delay = 0 }) => {
  const [val, setVal] = useState(startAt);
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVal(to);
      return;
    }

    const start = performance.now() + delay;
    const end = start + duration;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(startAt + (to - startAt) * eased));
      if (now < end) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration, startAt, delay]);

  return <span className="tabular-nums font-extrabold text-2xl md:text-3xl">{val}{suffix}</span>;
};

// --- Trailer modal (compact) ---
const TrailerModal = ({ open, onClose, youtubeId = 'dQw4w9WgXcQ' }) => {
  // youtubeId default is placeholder; replace with real id or remove video if you don't want one.
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-label="CricSphere trailer"
        >
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300 }} className="w-full max-w-3xl bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="relative pb-[56.25%]"> {/* 16:9 aspect */}
              <iframe
                title="CricSphere trailer"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-end gap-2 p-3 bg-slate-800">
              <button onClick={onClose} className="px-3 py-2 rounded-md bg-white/6 text-slate-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-300">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const IntroSection = () => {
  const heroRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [trailerOpen, setTrailerOpen] = useState(false);

  // small pointer-based parallax; no motion when user prefers reduced motion
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const onMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? w / 2;
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY) ?? h / 2;
      const px = (clientX / w - 0.5) * 2; // -1..1
      const py = (clientY / h - 0.5) * 2;
      setParallax({ x: px * 12, y: py * 10 });
    };

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // fallback for logo
  const [imgError, setImgError] = useState(false);

  // subtle motion variants
  const containerVar = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <>
      {/* Inline styles (small) for shimmer and particles; safe and self-contained */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -40% 0; }
          100% { background-position: 140% 0; }
        }
        .shimmer-text {
          background-size: 200% 100%;
          animation: shimmer 8s linear infinite;
        }
        /* tiny particle dots */
        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(0.6px);
          opacity: 0.14;
          mix-blend-mode: screen;
        }
        /* small accessibility helpers */
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.18);
          border-radius: 9999px;
        }
      `}</style>

      <div
        id="intro"
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden bg-gradient-to-b from-slate-950/95 to-slate-900 font-sans"
        aria-label="CricSphere introduction"
      >
        {/* Background image (css background for cover) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center transform-gpu transition-transform duration-500 will-change-transform"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2605&auto=format&fit=crop')`,
            transform: `translate3d(${parallax.x * -0.6}px, ${parallax.y * -0.6}px, 0) scale(1.06)`,
          }}
        />

        {/* gradient overlay for readability */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-slate-950/55 to-transparent" />

        {/* particles — decorative */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {/* place a few particles in different positions */}
          <div className="particle" style={{ width: 6, height: 6, background: 'rgba(99,102,241,0.6)', left: '8%', top: '16%' }} />
          <div className="particle" style={{ width: 5, height: 5, background: 'rgba(99,179,237,0.6)', left: '72%', top: '8%' }} />
          <div className="particle" style={{ width: 8, height: 8, background: 'rgba(16,185,129,0.6)', left: '60%', top: '72%' }} />
          <div className="particle" style={{ width: 5, height: 5, background: 'rgba(255,255,255,0.12)', left: '30%', top: '50%' }} />
        </div>

        {/* ambient light blobs (moved by parallax for depth) */}
        <motion.div
          aria-hidden
          className="absolute rounded-full blur-3xl pointer-events-none mix-blend-screen"
          style={{
            width: 420,
            height: 420,
            left: '6%',
            top: '18%',
            background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.20), transparent 30%)',
            transform: `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.6}px, 0)`,
          }}
        />
        <motion.div
          aria-hidden
          className="absolute rounded-full blur-3xl pointer-events-none mix-blend-screen"
          style={{
            width: 520,
            height: 520,
            right: '-6%',
            bottom: '10%',
            background: 'radial-gradient(circle at 70% 70%, rgba(59,130,246,0.12), transparent 35%)',
            transform: `translate3d(${parallax.x * -0.6}px, ${parallax.y * -0.4}px, 0)`,
          }}
        />

        {/* glass container */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVar}
          className="relative z-10 max-w-5xl w-full px-6 py-12 md:py-20 md:px-12 rounded-3xl bg-slate-900/40 backdrop-blur-lg border border-white/8 shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* logo + micro badge row */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {!imgError ? (
              <img
                src={logo}
                alt="CricSphere logo"
                onError={() => setImgError(true)}
                className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-black font-bold">
                CS
              </div>
            )}

            <div className="flex flex-col text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 border border-white/8 text-sm font-semibold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Platform Live</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">Command center for cricket fans • realtime & presenter-ready</div>
            </div>
          </div>

          {/* big heading — responsive sizes and shimmer */}
          <h1
            className="font-extrabold tracking-tight leading-tight mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 6.5rem)',
              lineHeight: 0.92,
            }}
          >
            <span
              className="block text-transparent bg-clip-text shimmer-text"
              style={{
                backgroundImage: 'linear-gradient(90deg,#ffffff 0%, #94a3b8 40%, #ffffff 100%)',
              }}
            >
              CRICSPHERE
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0.9, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-300 max-w-2xl mx-auto mb-8 text-base md:text-lg"
            style={{ lineHeight: 1.45 }}
          >
            The ultimate command center for cricket enthusiasts — real-time data, presenter-ready exports and elegant visualisations. Experience the game with <span className="text-white font-semibold">unmatched depth</span>.
          </motion.p>

          {/* small stats row (Counters) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <CountUp to={1_242} suffix="" />
              <div className="text-xs text-slate-400 mt-1">Matches / month</div>
            </div>
            <div className="flex flex-col items-center">
              <CountUp to={48_300} suffix="+" duration={1100} delay={120} />
              <div className="text-xs text-slate-400 mt-1">Active viewers</div>
            </div>
            <div className="flex flex-col items-center">
              <CountUp to={3_220} suffix="+" duration={1000} delay={220} />
              <div className="text-xs text-slate-400 mt-1">Exports</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/home" className="w-full sm:w-auto">
              <button
                className="focus-ring inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-slate-900 font-semibold shadow-xl transform transition-transform hover:scale-[1.03] active:scale-[0.98]"
                aria-label="Enter CricSphere dashboard"
              >
                Enter Dashboard
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </Link>

            <button
              onClick={() => setTrailerOpen(true)}
              className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/6 text-white font-medium hover:bg-white/10"
              aria-haspopup="dialog"
              aria-expanded={trailerOpen}
            >
              Watch Trailer
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M10 8l6 4-6 4V8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            <a href="#features" className="w-full sm:w-auto">
              <button className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium border border-white/6 hover:bg-white/8">
                Explore Features
              </button>
            </a>
          </div>

          {/* subtle scroll indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400/80" aria-hidden>
            <div className="w-[2px] h-12 rounded-full bg-gradient-to-b from-slate-400 to-transparent" />
            <div className="text-xs uppercase tracking-wider">Scroll</div>
          </div>
        </motion.div>

        {/* decorative stadium light at corner (SVG) */}
        <svg aria-hidden className="absolute right-6 top-12 w-40 h-40 opacity-8 pointer-events-none" viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="lg1" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#lg1)" />
          <g transform="translate(12,24) rotate(-10)">
            <rect x="0" y="0" width="12" height="36" rx="2" fill="#fff" opacity="0.04" />
            <rect x="20" y="0" width="12" height="36" rx="2" fill="#fff" opacity="0.04" />
            <rect x="40" y="0" width="12" height="36" rx="2" fill="#fff" opacity="0.04" />
          </g>
        </svg>

        {/* trailer modal */}
        <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} youtubeId="dQw4w9WgXcQ" />
      </div>
    </>
  );
};

export default IntroSection;
