import React, { useEffect, useState } from "react";
import {
  Trophy, Globe, Star, Activity, BarChart3
} from "lucide-react";
import axios from "../api/axios";

export default function Stats() {
  const [format, setFormat] = useState("T20");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/v1/stats/icc?format=${format}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [format]);

  if (loading || !data) {
    return <div className="h-screen flex items-center justify-center text-slate-400">Loading Rankings…</div>;
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      {/* HEADER */}
      <div className="py-10 bg-[#0b1220] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex justify-between">
          <h1 className="text-5xl font-black">Official Rankings</h1>
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
            {["TEST","ODI","T20"].map(f => (
              <button key={f}
                onClick={() => setFormat(f)}
                className={`px-6 py-2 text-xs font-black rounded-lg ${
                  format===f ? "bg-blue-600" : "text-slate-500"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-12 gap-8">

        {/* TEAM TABLE */}
        <div className="col-span-7 bg-[#111a2e] rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Trophy className="text-amber-500"/> Teams
          </div>

          <table className="w-full">
            <tbody>
              {data.teams.map(t => (
                <tr key={t.team} className="border-b border-white/5">
                  <td className="p-5 text-blue-500 font-black">0{t.rank}</td>
                  <td className="p-5 font-black">{t.team}</td>
                  <td className="p-5 text-right text-xl font-black text-blue-500">{t.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PLAYER LIST */}
        <div className="col-span-5 bg-[#111a2e] rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Star className="text-blue-500"/> Top Batters
          </div>

          {data.players.map(p => (
            <div key={p.name} className="p-5 border-b border-white/5 flex justify-between">
              <div>
                <div className="font-black">{p.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Globe size={10}/> {p.country}
                </div>
              </div>
              <div className="text-xl font-black text-blue-500">{p.rating}</div>
            </div>
          ))}
        </div>

      </main>

      <footer className="max-w-6xl mx-auto px-6 py-6 text-[10px] text-slate-600 flex justify-between">
        <span>ICC Database Synced</span>
        <span className="flex items-center gap-2"><BarChart3 size={12}/> CricSphere Engine</span>
      </footer>
    </div>
  );
}
