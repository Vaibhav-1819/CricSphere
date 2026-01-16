import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Activity, ShieldAlert, Clock, 
  Trophy, Loader2, Zap, Info as InfoIcon
} from "lucide-react";
import api from "../services/api";

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/cricket/match/${id}`)
      .then(res => {
        // 🟢 Defensive: The API might return match inside a 'data' wrapper
        setMatch(res.data?.match || res.data);
      })
      .catch(err => console.error("Telemetry Link Failed", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (!match) return <DetailError navigate={navigate} />;

  // 🟢 Extracting data with safe fallbacks
  const t1 = match.team1 || { name: "T1", runs: 0, wickets: 0, overs: 0 };
  const t2 = match.team2 || { name: "T2", runs: 0, wickets: 0, overs: 0 };
  const isDone = match.status?.toLowerCase().includes("won") || !!match.winner;

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-200 selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto p-6 md:py-12">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 mb-10 text-slate-500 hover:text-white transition-all"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-600 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Arena</span>
        </button>

        {/* 🟢 BROADCAST HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2.5rem] bg-[#111827]/60 backdrop-blur-3xl border border-white/5 shadow-2xl overflow-hidden mb-12"
        >
          {/* Header Status Bar */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b border-white/5">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Match ID: <span className="text-blue-500">{id}</span>
             </span>
             <div className="flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full border border-white/10">
                <div className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-slate-500' : 'bg-red-500 animate-ping'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{isDone ? "Final" : "Live"}</span>
             </div>
          </div>

          <div className="p-10 pt-24 text-center">
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.4em] mb-8 italic">
              {match.status}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
              <TeamBlock team={t1} winner={match.winner === t1.name} />
              <div className="flex flex-col items-center">
                <div className="text-5xl font-black text-white/5 italic select-none">VS</div>
                {match.matchFormat && (
                  <div className="mt-2 px-3 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-black text-slate-500 uppercase">
                    {match.matchFormat}
                  </div>
                )}
              </div>
              <TeamBlock team={t2} winner={match.winner === t2.name} />
            </div>

            {/* Run Rate Module */}
            {(match.crr || match.rrr) && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-8 md:gap-16 bg-[#080a0f]/60 px-10 md:px-20 py-8 rounded-3xl border border-white/5 shadow-inner">
                  {match.crr && <StatBlock label="Curr RR" value={match.crr} />}
                  {match.rrr && (
                    <StatBlock
                      label="Req RR"
                      value={match.rrr}
                      sub={`${match.runsLeft} from ${match.oversLeft}`}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 🟢 VENUE & TIME GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Info icon={<MapPin size={20}/>} label="Arena" value={match.venue || "Global Arena"} />
          <Info icon={<Clock size={20}/>} label="Telemetry Sync" value={new Date().toLocaleTimeString()} />
          <Info icon={<Zap size={20}/>} label="Intensity" value={isDone ? "Concluded" : "Maximum"} />
        </div>

      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

const TeamBlock = ({ team, winner }) => (
  <div className="flex flex-col items-center gap-6 group">
    <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-5xl font-black shadow-2xl transition-all duration-500 ${
      winner ? "ring-2 ring-emerald-500 text-emerald-400 scale-110" : "text-white group-hover:scale-105"
    }`}>
      {team.name ? team.name[0] : "?"}
    </div>

    <div className="text-center">
      <h2 className={`text-2xl font-black uppercase tracking-tighter italic ${winner ? "text-emerald-400" : "text-white"}`}>
        {team.name}
      </h2>
      <div className="mt-3 flex flex-col gap-1">
        <div className="text-4xl font-mono font-black text-blue-500">
          {team.runs || 0}<span className="text-white/20">/</span>{team.wickets || 0}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {team.overs || 0} Overs Completed
        </span>
      </div>
    </div>
  </div>
);

const StatBlock = ({ label, value, sub }) => (
  <div className="text-center group">
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 group-hover:text-blue-500 transition-colors">{label}</p>
    <p className="text-4xl font-mono font-black text-white">{value}</p>
    {sub && <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase tracking-widest">{sub}</p>}
  </div>
);

const Info = ({ icon, label, value }) => (
  <div className="bg-[#111827]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex items-center gap-5 hover:bg-white/[0.03] transition-all">
    <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-600/20">{icon}</div>
    <div>
      <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-black text-slate-200">{value}</div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center">
    <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Establishing Telemetry</span>
  </div>
);

const DetailError = ({ navigate }) => (
  <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center text-center p-6">
    <div className="p-6 bg-red-500/10 rounded-full mb-8 border border-red-500/20">
      <ShieldAlert size={60} className="text-red-500" />
    </div>
    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Signal Lost</h2>
    <p className="text-slate-500 text-sm max-w-xs mb-10 font-medium">This match telemetry is no longer active in the Cricsphere Arena.</p>
    <button
      onClick={() => navigate("/live-scores")}
      className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-600/20"
    >
      Return to Hub
    </button>
  </div>
);