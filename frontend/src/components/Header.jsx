import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, User, LogOut, ChevronDown, 
  Settings, Activity, Radio 
} from 'lucide-react';
import Logo from '../assets/cricsphere-logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Live Hub', path: '/live-scores', icon: Radio },
    { name: 'Schedules', path: '/schedules' },
    { name: 'Teams', path: '/teams' },
    { name: 'Stats', path: '/stats' },
    { name: 'News', path: '/news' },
  ];

  const isActive = (path) => location.pathname === path;
  const displayName = user?.username || 'User';
  const avatar = displayName.charAt(0).toUpperCase();

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-[#080a0f]/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl'
          : 'bg-[#080a0f] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between items-center">

          {/* 🟢 BRAND IDENTITY */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
              <img src={Logo} alt="CricSphere" className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white uppercase tracking-tighter leading-none italic">
                Cric<span className="text-blue-500">Sphere</span>
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Intelligence</span>
            </div>
          </Link>

          {/* 🔵 DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.icon && <link.icon size={12} className={isActive(link.path) ? "animate-pulse" : ""} />}
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-white/10 mx-4" />

            {/* 🟠 AUTH / USER AREA */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                    {avatar}
                  </div>
                  <ChevronDown size={14} className="text-slate-500 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-4 w-56 bg-[#111827] border border-white/5 rounded-2xl shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 origin-top-right z-[110] overflow-hidden">
                  <div className="px-5 py-4 bg-white/[0.02] border-b border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Profile</p>
                    <p className="text-sm font-black text-white truncate mt-1 italic uppercase">{displayName}</p>
                  </div>

                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-blue-500 rounded-xl transition-all">
                      <Settings size={14} /> Account Settings
                    </Link>
                    <Link to="/stats" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-emerald-500 rounded-xl transition-all">
                      <Activity size={14} /> Personal Stats
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut size={14} /> Secure Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-xl"
              >
                Enter Arena
              </Link>
            )}
          </div>

          {/* 🔴 MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE NAVIGATION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#080a0f] border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    isActive(link.path)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {link.name}
                  <ChevronRight size={16} />
                </Link>
              ))}

              {user && (
                <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest"
                  >
                    <User size={18} /> My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;