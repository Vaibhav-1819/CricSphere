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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-gray-200 dark:border-gray-800'
          : 'bg-white dark:bg-gray-900 shadow-none border-transparent dark:border-gray-800'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* BRAND */}
          <Link 
            to="/home" 
            className="group flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-10 h-10 flex items-center justify-center bg-green-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-green-100 dark:border-gray-700">
              <img src={Logo} alt="CricSphere Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              CricSphere
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-3" />

            {/* AUTH BUTTONS */}
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <Link to="/profile" className="hidden lg:flex flex-col items-end group">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Welcome,</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-green-500 transition-colors">
                        {displayName}
                    </span>
                </Link>
                <div className="h-9 w-9 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold border border-green-200 dark:border-green-800">
                    {displayName.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-semibold rounded-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="ml-3 px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex md:hidden items-center space-x-3">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  isOpen 
                  ? "M6 18L18 6M6 6l12 12" 
                  : "M4 6h16M4 12h16m-7 6h7"
                } />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 ${
            isOpen ? 'max-h-[500px] opacity-100 shadow-xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-3">
              {user ? (
                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="h-8 w-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold">
                             {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {displayName}
                        </span>
                    </div>
                    <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full text-center px-4 py-3 rounded-lg text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
              ) : (
                <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-lg text-base font-bold text-white bg-green-600 hover:bg-green-700 hover:shadow-md transition-all"
                    onClick={() => setIsOpen(false)}
                >
                    Login
                </Link>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
