import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Activity,
  ShieldAlert,
  Zap,
  Clock,
  Trophy
} from "lucide-react";

const MatchDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.state?.matchData;

  const getTeamScore = (teamName) => {
    if (!match?.score) return null;
    return match.score.find(s =>
      s.inning?.toLowerCase().includes(teamName.toLowerCase())
    );
  };

  if (!match) return <DetailError navigate={navigate} />;

  const [t1, t2] = match.teams;
  const status = match.status.toLowerCase();
  const isDone = ["won", "draw", "tie", "result"].some(k => status.includes(k));

  /* ---------- CRR + RRR CALCULATION ---------- */

  const scores = match.score || [];
  const first = scores[0];
  const current = scores[1];

  let crr = null;
  let rrr = null;
  let runsLeft = null;
  let oversLeft = null;

  const totalOvers =
    match.matchType?.toLowerCase() === "t20" ? 20 :
    match.matchType?.toLowerCase() === "odi" ? 50 : null;

  if (current?.o > 0) {
    crr = (current.r / current.o).toFixed(2);
  }

  if (first && current && totalOvers) {
    const target = first.r + 1;
    runsLeft = target - current.r;
    oversLeft = totalOvers - current.o;

    if (oversLeft > 0) {
      rrr = (runsLeft / oversLeft).toFixed(2);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] text-white">
      <div className="max-w-7xl mx-auto p-6 md:p-12">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 mb-10 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft /> Back to Matches
        </button>

        {/* Broadcast Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#111827] to-[#020617] border border-white/10 shadow-2xl p-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent)]" />

          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <span className={`px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase ${isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400 animate-pulse"}`}>
                {match.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10">
              <TeamBlock name={t1} score={getTeamScore(t1)} isWinner={isDone && match.status.includes(t1)} />
              <div className="text-7xl font-black text-slate-700">VS</div>
              <TeamBlock name={t2} score={getTeamScore(t2)} isWinner={isDone && match.status.includes(t2)} />
            </div>

            {/* --- CRR / RRR BAR --- */}
            {crr && (
              <div className="mt-10 flex justify-center">
                <div className="flex gap-12 bg-black/40 border border-white/10 px-12 py-6 rounded-2xl shadow-xl backdrop-blur-xl">
                  <div className="text-center">
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest">CRR</p>
                    <p className="text-3xl font-black text-blue-400">{crr}</p>
                  </div>

                  {rrr && (
                    <>
                      <div className="w-px bg-white/10" />
                      <div className="text-center">
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest">RRR</p>
                        <p className="text-3xl font-black text-emerald-400">{rrr}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {runsLeft} runs in {oversLeft.toFixed(1)} overs
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Stat icon={<MapPin />} label="Venue" value={match.venue} />
          <Stat icon={<Clock />} label="Last Updated" value={new Date().toLocaleTimeString()} />
          <Stat icon={<Activity />} label="Match State" value={isDone ? "Final Result" : "Live Match"} />
        </div>
      </div>
    </div>
  );
};

/* ===== UI Blocks ===== */

const TeamBlock = ({ name, score, isWinner }) => (
  <div className="flex flex-col items-center gap-6">
    <div className={`w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-5xl font-black ${isWinner && "ring-4 ring-emerald-500 text-emerald-400"}`}>
      {name[0]}
    </div>

    <h2 className={`text-4xl font-black uppercase ${isWinner ? "text-emerald-400" : "text-white"}`}>
      {name}
    </h2>

    {score && (
      <div className="text-3xl font-mono font-black text-blue-400">
        {score.r}/{score.w}
        <span className="block text-sm text-slate-400">{score.o} overs</span>
      </div>
    )}
  </div>
);

const Stat = ({ icon, label, value }) => (
  <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 flex gap-4 items-center shadow-xl">
    <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
      <div className="font-bold text-slate-200">{value}</div>
    </div>
  </div>
);

const DetailError = ({ navigate }) => (
  <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-center text-white">
    <ShieldAlert size={80} className="text-red-500 mb-8" />
    <h2 className="text-4xl font-black mb-4">Match Data Missing</h2>
    <p className="text-slate-500 mb-8">Please open the match from Live Scores.</p>
    <button
      onClick={() => navigate("/live-scores")}
      className="px-10 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500"
    >
      Back to Live Scores
    </button>
  </div>
);

export default MatchDetail;
