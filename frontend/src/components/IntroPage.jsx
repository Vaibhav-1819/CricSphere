import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ChevronRight, Trophy } from "lucide-react";
import { matchApi } from "../services/api";

const isMatchDone = (status = "") => {
  const s = String(status).toLowerCase();
  return ["won", "draw", "tie", "abandon", "result", "complete"].some((k) =>
    s.includes(k)
  );
};

const flattenMatches = (raw) => {
  const list =
    raw?.typeMatches?.flatMap((tm) =>
      tm?.seriesMatches?.flatMap((sm) => sm?.seriesAdWrapper?.matches || [])
    ) || [];

  return Array.isArray(list) ? list : [];
};

const IntroPage = () => {
  const navigate = useNavigate();
  const [liveMatch, setLiveMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPreview = async () => {
      try {
        const res = await matchApi.getLive();
        const allMatches = flattenMatches(res?.data);

        // Pick ONLY 1 Live match
        const oneLive =
          allMatches.find((m) => !isMatchDone(m?.matchInfo?.status)) ||
          allMatches[0] ||
          null;

        if (mounted) setLiveMatch(oneLive);
      } catch (err) {
        console.error("Live feed sync failed", err);
        if (mounted) setLiveMatch(null);
      } finally {
        if (mounted) setLoadingMatch(false);
      }
    };

    fetchPreview();

    // Refresh live preview every 30 seconds (backend TTL protects quota)
    const refresh = setInterval(fetchPreview, 30000);

    // Auto-redirect after 6 seconds
    const timer = setTimeout(() => navigate("/home"), 6000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(refresh);
    };
  }, [navigate]);

  const team1 = liveMatch?.matchInfo?.team1?.teamName || "Team 1";
  const team2 = liveMatch?.matchInfo?.team2?.teamName || "Team 2";

  const team1Score = liveMatch?.matchScore?.team1Score?.inngs1;
  const team2Score = liveMatch?.matchScore?.team2Score?.inngs1;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#f8fafc]">
      {/* Background Architecture */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-2xl px-6"
      >
        {/* Brand Header */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-slate-900">
          Cric<span className="text-blue-600">Sphere.</span>
        </h1>
        <p className="text-slate-500 font-medium mb-10 tracking-wide uppercase text-[10px]">
          Professional Cricket Intelligence & Telemetry
        </p>

        {/* Unified Live Match Preview Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden mb-12"
        >
          <div className="bg-slate-900 px-6 py-2.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                Live Arena Feed
              </span>
            </div>

            {liveMatch && (
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {liveMatch.matchInfo?.seriesName || "International Series"}
              </span>
            )}
          </div>

          <div className="p-8">
            {loadingMatch ? (
              <div className="py-4 flex flex-col items-center gap-3">
                <Activity className="animate-spin text-blue-600" size={24} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  Connecting to Sat-Link...
                </span>
              </div>
            ) : liveMatch ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900">{team1}</h4>
                  <p className="text-2xl font-black text-blue-600">
                    {team1Score?.runs ?? 0}/{team1Score?.wickets ?? 0}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                    Overs: {team1Score?.overs ?? "0.0"}
                  </p>
                </div>

                <div className="h-10 w-px bg-slate-100" />

                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900">{team2}</h4>

                  {team2Score ? (
                    <>
                      <p className="text-2xl font-black text-slate-900">
                        {team2Score?.runs ?? 0}/{team2Score?.wickets ?? 0}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        Overs: {team2Score?.overs ?? "0.0"}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-black text-slate-300">
                      Yet to Bat
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center gap-2 text-slate-400">
                <Trophy size={24} />
                <span className="text-xs font-bold uppercase">
                  No Active Fixtures
                </span>
              </div>
            )}
          </div>

          {liveMatch && (
            <div className="bg-slate-50 py-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase italic">
                {liveMatch.matchInfo?.status}
              </p>
            </div>
          )}
        </motion.div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/home")}
          className="group flex items-center gap-3 mx-auto px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          Enter Full Arena
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </motion.div>

      {/* Footer System Sync */}
      <div className="absolute bottom-12 w-full max-w-xs px-10">
        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full bg-blue-600"
          />
        </div>
        <p className="mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Syncing Analytics Engine v2.0
        </p>
      </div>
    </div>
  );
};

export default IntroPage;
