import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Activity, ShieldAlert, Clock, Trophy
} from "lucide-react";
import api from "../services/api";

/* ===================== */

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/cricket/match/${id}`)
      .then(res => setMatch(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-screen bg-[#020617] animate-pulse" />;
  if (!match) return <DetailError navigate={navigate} />;

  const isDone = !!match.winner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] text-white">
      <div className="max-w-7xl mx-auto p-6 md:p-12">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 mb-10 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft /> Back
        </button>

        {/* Broadcast Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#111827] to-[#020617] border border-white/10 shadow-2xl p-10"
        >
          <div className="text-center">
            <span className={`px-6 py-2 rounded-full text-xs font-black uppercase ${
              isDone
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-blue-500/20 text-blue-400 animate-pulse"
            }`}>
              {match.status}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 mt-10">
              <TeamBlock team={match.team1} winner={match.winner === match.team1.name} />
              <div className="text-6xl font-black text-slate-700">VS</div>
              <TeamBlock team={match.team2} winner={match.winner === match.team2.name} />
            </div>

            {(match.crr || match.rrr) && (
              <div className="mt-10 flex justify-center">
                <div className="flex gap-12 bg-black/40 px-12 py-6 rounded-2xl border border-white/10">
                  {match.crr && <StatBlock label="CRR" value={match.crr} />}
                  {match.rrr && (
                    <StatBlock
                      label="RRR"
                      value={match.rrr}
                      sub={`${match.runsLeft} runs in ${match.oversLeft} overs`}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Info icon={<MapPin />} label="Venue" value={match.venue} />
          <Info icon={<Clock />} label="Last Updated" value={new Date().toLocaleTimeString()} />
          <Info icon={<Activity />} label="State" value={isDone ? "Final" : "Live"} />
        </div>

      </div>
    </div>
  );
}

/* ===================== */

const TeamBlock = ({ team, winner }) => (
  <div className="flex flex-col items-center gap-6">
    <div className={`w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-5xl font-black ${
      winner && "ring-4 ring-emerald-500 text-emerald-400"
    }`}>
      {team.name[0]}
    </div>

    <h2 className={`text-4xl font-black uppercase ${winner ? "text-emerald-400" : "text-white"}`}>
      {team.name}
    </h2>

    <div className="text-3xl font-mono text-blue-400">
      {team.runs}/{team.wickets}
      <span className="block text-sm text-slate-400">{team.overs} overs</span>
    </div>
  </div>
);

const StatBlock = ({ label, value, sub }) => (
  <div className="text-center">
    <p className="text-[11px] text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-blue-400">{value}</p>
    {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
  </div>
);

const Info = ({ icon, label, value }) => (
  <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 flex gap-4">
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
    <h2 className="text-4xl font-black mb-4">Match Not Found</h2>
    <button
      onClick={() => navigate("/")}
      className="px-10 py-4 bg-blue-600 rounded-xl font-bold"
    >
      Back Home
    </button>
  </div>
);
