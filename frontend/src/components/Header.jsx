import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  Activity,
  LogOut,
  User,
  Radio,
} from "lucide-react";
import Logo from "../assets/cricsphere-logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Live Hub", path: "/live-scores", icon: Radio },
    { name: "Schedules", path: "/schedules" },
    { name: "Teams", path: "/teams" },
    { name: "Stats", path: "/stats" },
    { name: "News", path: "/news" },
  ];

  const isActive = (path) => location.pathname === path;

  const displayName = user?.username || "User";
  const avatar = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-[#05070c]/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10"
          : "bg-white dark:bg-[#05070c] border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[72px] flex items-center justify-between">
          {/* Brand */}
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm flex items-center justify-center">
              <img src={Logo} alt="CricSphere" className="w-7 h-7" />
            </div>

            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Cric<span className="text-blue-600 dark:text-blue-400">Sphere</span>
              </p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Cricket Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className={active ? "opacity-100" : "opacity-70"}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}

            <div className="h-7 w-px bg-black/10 dark:bg-white/10 mx-2" />

            {/* Auth Area */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-black/10 dark:border-white/10">
                    {avatar}
                  </div>

                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Account
                    </span>
                  </div>

                  <ChevronDown
                    size={16}
                    className="text-slate-500 dark:text-slate-400 group-hover:rotate-180 transition-transform"
                  />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all origin-top-right overflow-hidden">
                  <div className="px-4 py-3 border-b border-black/10 dark:border-white/10">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Signed in
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      <Settings size={16} />
                      Account Settings
                    </Link>

                    <Link
                      to="/stats"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      <Activity size={16} />
                      Personal Stats
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen((p) => !p)}
            className="lg:hidden p-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 shadow-sm"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-black/5 dark:bg-white/5 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {Icon && <Icon size={16} />}
                      {link.name}
                    </span>
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="pt-4 mt-4 border-t border-black/10 dark:border-white/10">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-700 dark:text-slate-200 text-sm font-semibold"
                    >
                      <User size={16} />
                      My Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 text-red-600 text-sm font-semibold"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
