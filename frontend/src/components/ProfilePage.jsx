import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, token, logout } = useAuth();
  
  // Data States
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    favoriteTeam: ''
  });

  // Predefined Teams List (You can fetch this from an API too)
  const cricketTeams = [
    "Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bangalore", 
    "Gujarat Titans", "Kolkata Knight Riders", "Sunrisers Hyderabad",
    "Rajasthan Royals", "Delhi Capitals", "Lucknow Super Giants", "Punjab Kings",
    "Indian National Team", "Australian National Team", "England National Team"
  ];

  const API_URL = 'http://localhost:8081/api/v1/user/profile';

  // --- FETCH PROFILE ---
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setProfile(response.data);
        // Initialize form data with fetched values
        setFormData({ favoriteTeam: response.data.favoriteTeam || '' });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load user data.");
        if (err.response && err.response.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout]);

  // --- HANDLE EDIT INPUT ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT UPDATES ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(API_URL, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local profile with new data from server
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOADING / ERROR / NO TOKEN STATES ---
  if (!token) return <AccessDenied logout={logout} />; // (Extracted for brevity below)
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
          
          {/* Header Banner */}
          <div className="relative h-48 bg-gradient-to-r from-emerald-600 to-teal-700">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>

          <div className="relative px-8 pb-12">
            
            {/* Top Row: Avatar & Actions */}
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-10 gap-6">
              {/* Avatar */}
              <motion.div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-slate-900 dark:bg-white p-1 shadow-2xl ring-4 ring-white dark:ring-slate-900">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[1.8rem] flex items-center justify-center">
                    <span className="text-6xl md:text-7xl font-black text-white select-none">
                      {profile?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Name & Title */}
              <div className="text-center md:text-left flex-1 pb-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                  {profile?.username}
                </h1>
                <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                  {profile?.role} Account
                </p>
              </div>

              {/* Edit / Save Buttons */}
              <div className="flex gap-3">
                 {!isEditing ? (
                   <button 
                     onClick={() => setIsEditing(true)}
                     className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                   >
                     Edit Profile
                   </button>
                 ) : (
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setIsEditing(false)}
                       className="px-4 py-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleSave}
                       disabled={isSaving}
                       className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                     >
                       {isSaving ? 'Saving...' : 'Save Changes'}
                     </button>
                   </div>
                 )}
              </div>
            </div>

            {/* --- INFO GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              
              {/* Standard Read-Only Fields */}
              <InfoCard label="Email" value={profile?.email} icon="mail" color="purple" />
              <InfoCard label="Role" value={profile?.role} icon="badge" color="blue" />

              {/* --- FAVORITE TEAM SECTION (EDITABLE) --- */}
              <div className="group p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 md:col-span-2 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Favorite Team</span>
                </div>
                
                {isEditing ? (
                  <div className="relative">
                    <select
                      name="favoriteTeam"
                      value={formData.favoriteTeam}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none"
                    >
                      <option value="">Select a team...</option>
                      {cricketTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                    {/* Custom Arrow Icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {profile?.favoriteTeam || "No team selected"}
                  </div>
                )}
              </div>

            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={logout}
              className="w-full py-4 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              Sign Out
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- HELPER COMPONENTS (For cleaner code) ---
const InfoCard = ({ label, value, color, icon }) => (
  <div className={`p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700`}>
    <div className="flex items-start justify-between mb-2">
      <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 rounded-2xl`}>
         {/* Simple dynamic icon placeholder */}
         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
    <div className="text-xl font-bold text-slate-900 dark:text-white break-all">{value}</div>
  </div>
);

const AccessDenied = ({ logout }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
      <Link to="/login" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold">Login</Link>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500 font-bold">
    {message}
  </div>
);

export default ProfilePage;