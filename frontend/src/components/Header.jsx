import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    { name: 'Live Scores', path: '/live-scores' },
    { name: 'Schedules', path: '/schedules' },
    { name: 'Teams', path: '/teams' },
    { name: 'Stats', path: '/stats' },
    { name: 'News', path: '/news' },
  ];

  const isActive = (path) => location.pathname === path;
  const displayName = user?.username || user || 'User';
  const avatar = displayName.charAt(0).toUpperCase();

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-gray-200 dark:border-gray-800'
          : 'bg-white dark:bg-gray-900 border-transparent dark:border-gray-800'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Brand */}
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-green-100 dark:border-gray-700">
              <img src={Logo} alt="CricSphere" className="w-7 h-7" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              CricSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-3" />

            {/* Auth Area */}
            {user ? (
              <div className="relative group">
                <button className="h-9 w-9 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full flex items-center justify-center font-bold border border-green-200 dark:border-green-800 hover:ring-2 hover:ring-green-400 transition">
                  {avatar}
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all origin-top-right z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                      {displayName}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all ${isOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'} bg-white dark:bg-gray-900 border-t`}>
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                My Profile
              </Link>

              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full px-4 py-3 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
