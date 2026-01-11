import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Mail, Shield, Star, LogOut, Edit3, 
  CheckCircle, XCircle, Award, Zap, User, Settings
} from 'lucide-react';

const ProfilePage = () => {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ favoriteTeam: '' });

  const cricketTeams = [
    "Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bangalore", 
    "Gujarat Titans", "Kolkata Knight Riders", "Sunrisers Hyderabad",
    "Rajasthan Royals", "Delhi Capitals", "Lucknow Super Giants", "Punjab Kings",
    "Indian National Team", "Australian National Team", "England National Team"
  ];

  const API_URL = 'http://localhost:8081/api/v1/user/profile';

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setProfile(response.data);
        setFormData({ favoriteTeam: response.data.favoriteTeam || '' });
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
        headers: { 'Authorization': `Bearer ${token}` }
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
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f1a] px-4">
      {/* --- MODAL WRAPPER (Limited Width to prevent "Enlarged" look) --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-10 -mt-10" />

        {/* --- HEADER SECTION --- */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fan Profile</span>
            </div>
            <button 
              onClick={logout}
              className="text-slate-400 hover:text-rose-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-lg ring-4 ring-white dark:ring-slate-900">
                <div className="w-full h-full bg-slate-900 rounded-[1.2rem] flex items-center justify-center">
                  <span className="text-4xl font-black text-white uppercase">
                    {profile?.username?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                <Zap size={10} className="text-white fill-white" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                {profile?.username}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">{profile?.role} Account</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-400 font-medium">{profile?.email}</span>
              </div>
            </div>

            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Edit3 size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
              >
                <CheckCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="p-8 space-y-6">
          
          {/* Favorite Team (Full Width Focus) */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 group transition-all">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg"><Star size={16} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Favorite Franchise</span>
               </div>
               {isEditing && <span className="text-[9px] font-bold text-blue-600 uppercase">Selection Active</span>}
            </div>

            {isEditing ? (
              <select
                value={formData.favoriteTeam}
                onChange={(e) => setFormData({ favoriteTeam: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Choose your team...</option>
                {cricketTeams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            ) : (
              <div className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {profile?.favoriteTeam || "Not Configured"}
              </div>
            )}
          </div>

          {/* Quick Metrics (2 Column Grid) */}
          <div className="grid grid-cols-2 gap-4">
             <CompactMetric icon={<Award className="text-amber-500" />} label="Loyalty Tier" val="Gold Member" />
             <CompactMetric icon={<Zap className="text-emerald-500" />} label="Status" val="Active" />
          </div>

          <div className="pt-4 flex flex-col gap-3">
             <Link to="/home" className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-center text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all">
                Enter Match Center
             </Link>
             {isEditing && (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest"
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
  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
     <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">{icon}</div>
     <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">{val}</p>
     </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
    <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
  </div>
);

const AccessDenied = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a] text-center p-6">
      <Shield size={64} className="text-slate-800 mb-8" />
      <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter italic">Access Prohibited</h2>
      <Link to="/login" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/30">Go to Login</Link>
    </div>
);

export default ProfilePage;