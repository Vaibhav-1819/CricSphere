import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { AnimatePresence } from 'framer-motion';

// --- Auth Context & Guards ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Core Components ---
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

// --- Pages ---
import LandingPage from './components/LandingPage';
import IntroPage from './components/IntroPage';
import LoginPage from './components/auth/LoginPage'; 
import RegisterPage from './components/auth/RegisterPage'; 
import Home from './components/Home';
import LiveScore from './components/LiveScore'; 
import MatchDetail from './components/MatchDetail'; 
import Schedules from './components/Schedules';
import SeriesPage from './components/SeriesPage'; 
import Teams from './components/Teams';
import TeamDetails from './components/TeamDetails'; 
import Stats from './components/Stats';
import News from './components/News';
import ProfilePage from './components/ProfilePage';

// --- Support & Legal ---
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import PremiumFeatures from './components/PremiumFeatures'; 

import './index.css';

/* ==========================================================
   HELPERS & LAYOUT
   ========================================================== */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen bg-[#080a0f] flex items-center justify-center text-blue-500 font-black uppercase text-xs tracking-widest">Syncing Session...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children, toggleDarkMode, darkMode }) => (
  <div className="min-h-screen flex flex-col transition-colors duration-500 bg-slate-50 dark:bg-[#080a0f]">
    <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    <main className="flex-grow">
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

/* ==========================================================
   ROUTING LOGIC
   ========================================================== */
function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />
      
      <Routes>
        {/* 🟢 ENTRY & AUTH ROUTES (No Header/Footer Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 🔵 PUBLIC APP HUB (Viewable by Guests - NO Login Required) */}
        {[
          { path: "/home", element: <Home /> },
          { path: "/live-scores", element: <LiveScore /> },
          { path: "/match/:id", element: <MatchDetail /> },
          { path: "/schedules", element: <Schedules /> },
          { path: "/schedules/:seriesId", element: <SeriesPage /> },
          { path: "/teams", element: <Teams /> },
          { path: "/teams/:teamId", element: <TeamDetails /> },
          { path: "/stats", element: <Stats /> },
          { path: "/news", element: <News /> },
          { path: "/about", element: <AboutUs /> },
          { path: "/contact", element: <Contact /> },
          { path: "/privacy", element: <PrivacyPolicy /> },
          { path: "/terms", element: <TermsOfService /> },
        ].map((route) => (
          <Route 
            key={route.path}
            path={route.path} 
            element={
              <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                {route.element}
              </AppLayout>
            } 
          />
        ))}

        {/* 🔒 SECURED USER ROUTES (Requires Login) */}
        {[
          { path: "/profile", element: <ProfilePage /> },
          { path: "/premium", element: <PremiumFeatures /> },
        ].map((route) => (
          <Route 
            key={route.path}
            path={route.path} 
            element={
              <PrivateRoute>
                <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                  {route.element}
                </AppLayout>
              </PrivateRoute>
            } 
          />
        ))}

        {/* 🔴 404 FALLBACK */}
        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f] text-white">
            <h1 className="text-6xl font-black italic text-blue-500 mb-4 uppercase tracking-tighter">404</h1>
            <p className="uppercase font-black tracking-widest text-[10px] text-slate-500">The Arena is Empty | Page Not Found</p>
            <button onClick={() => window.location.href='/home'} className="mt-8 px-8 py-3 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl">Return to Base</button>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * 🛠️ FIX FOR VERCEL ERROR: 
 * Using 'export default' ensures 'main.jsx' can import this successfully.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}