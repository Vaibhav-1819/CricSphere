import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Shield,
  Star,
  LogOut,
  Edit3,
  CheckCircle,
  Award,
  Zap,
  Settings,
} from "lucide-react";

const ProfilePage = () => {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ favoriteTeam: "" });

  const cricketTeams = [
    "Chennai Super Kings",
    "Mumbai Indians",
    "Royal Challengers Bangalore",
    "Gujarat Titans",
    "Kolkata Knight Riders",
    "Sunrisers Hyderabad",
    "Rajasthan Royals",
    "Delhi Capitals",
    "Lucknow Super Giants",
    "Punjab Kings",
    "Indian National Team",
    "Australian National Team",
    "England National Team",
  ];

  const API_URL = "http://localhost:8081/api/v1/user/profile";

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData({ favoriteTeam: response.data.favoriteTeam || "" });
      } catch (err) {
        setError("Telemetry link failed.");
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, logout]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to sync profile updates.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!token) return <AccessDenied />;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-white dark:bg-[#05070c] px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      {/* --- MODAL WRAPPER --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#080a0f] rounded-[2.5rem] shadow-2xl shadow-black/10 dark:shadow-black/50 border border-black/10 dark:border-white/10 overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />

        {/* --- HEADER SECTION --- */}
        <div className="p-8 border-b border-black/10 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Fan Profile
              </span>
            </div>

            <button
              onClick={logout}
              className="text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-lg">
                <div className="w-full h-full bg-white dark:bg-[#05070c] rounded-[1.25rem] flex items-center justify-center border border-black/10 dark:border-white/10">
                  <span className="text-4xl font-black text-slate-900 dark:text-white uppercase">
                    {profile?.username?.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-2 border-white dark:border-[#080a0f] rounded-full flex items-center justify-center shadow-md">
                <Zap size={11} className="text-white fill-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1 truncate">
                {profile?.username}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-500 tracking-widest">
                  {profile?.role} Account
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                  {profile?.email}
                </span>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm"
                title="Edit"
              >
                <Edit3 size={18} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Save"
              >
                <CheckCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="p-8 space-y-6">
          {/* Favorite Team */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-6 rounded-3xl border border-black/10 dark:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 text-blue-600 dark:text-blue-500 rounded-xl border border-blue-600/10 dark:border-blue-500/20">
                  <Star size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Favorite Franchise
                </span>
              </div>

              {isEditing && (
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest">
                  Editing
                </span>
              )}
            </div>

            {isEditing ? (
              <select
                value={formData.favoriteTeam}
                onChange={(e) => setFormData({ favoriteTeam: e.target.value })}
                className="w-full bg-white dark:bg-[#05070c] border border-black/10 dark:border-white/10 p-3 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm"
              >
                <option value="">Choose your team...</option>
                {cricketTeams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {profile?.favoriteTeam || "Not Configured"}
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <CompactMetric
              icon={<Award className="text-amber-500" />}
              label="Loyalty Tier"
              val="Gold Member"
            />
            <CompactMetric
              icon={<Zap className="text-emerald-500" />}
              label="Status"
              val="Active"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              to="/home"
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-center text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all"
            >
              Enter Match Center
            </Link>

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="w-full py-3 text-slate-500 dark:text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Discard Changes
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- COMPONENT HELPERS ---

const CompactMetric = ({ icon, label, val }) => (
  <div className="p-4 rounded-2xl bg-white dark:bg-[#080a0f] border border-black/10 dark:border-white/10 flex items-center gap-4 shadow-sm">
    <div className="p-2 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-black/5 dark:border-white/10">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900 dark:text-slate-200 leading-none">
        {val}
      </p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#05070c]">
    <div className="w-10 h-10 border-4 border-blue-600 dark:border-blue-500 rounded-full border-t-transparent animate-spin" />
  </div>
);

const AccessDenied = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#05070c] text-center p-6">
    <Shield size={64} className="text-slate-200 dark:text-slate-700 mb-8" />
    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter italic">
      Access Denied
    </h2>
    <Link
      to="/login"
      className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/30 transition-all"
    >
      Go to Login
    </Link>
  </div>
);

export default ProfilePage;
