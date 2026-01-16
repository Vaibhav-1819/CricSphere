import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

// Pages
import LandingPage from "./components/LandingPage";
import IntroPage from "./components/IntroPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

import Home from "./components/Home";
import LiveScore from "./components/LiveScore";
import Schedules from "./components/Schedules";
import SeriesPage from "./components/SeriesPage";
import Teams from "./components/Teams";
import TeamDetails from "./components/TeamDetails";
import Stats from "./components/Stats";
import News from "./components/News";
import ProfilePage from "./components/ProfilePage";

import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import PremiumFeatures from "./components/PremiumFeatures";

// ✅ NEW MATCH PAGE
import MatchPage from "./pages/MatchPage";

import "./index.css";

/* ==========================================================
   HELPERS
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

  if (loading) {
    return (
      <div className="h-screen bg-[#080a0f] flex items-center justify-center">
        <div className="text-blue-500 font-black uppercase text-xs tracking-[0.3em] animate-pulse">
          Syncing Session...
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children, toggleDarkMode, darkMode }) => (
  <div className="min-h-screen flex flex-col transition-colors duration-500 bg-slate-50 dark:bg-[#080a0f]">
    <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    <main className="flex-grow">
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

/* ==========================================================
   APP CONTENT
========================================================== */
function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((p) => !p);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />

      <Routes>
        {/* ENTRY & AUTH (No Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PUBLIC APP ROUTES */}
        <Route
          path="/home"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <Home />
            </AppLayout>
          }
        />

        <Route
          path="/live-scores"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <LiveScore />
            </AppLayout>
          }
        />

        {/* ✅ FIXED MATCH ROUTE */}
        <Route
          path="/match/:matchId"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <MatchPage />
            </AppLayout>
          }
        />

        <Route
          path="/schedules"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <Schedules />
            </AppLayout>
          }
        />

        <Route
          path="/schedules/:seriesId"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <SeriesPage />
            </AppLayout>
          }
        />

        <Route
          path="/teams"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <Teams />
            </AppLayout>
          }
        />

        <Route
          path="/teams/:teamId"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <TeamDetails />
            </AppLayout>
          }
        />

        <Route
          path="/stats"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <Stats />
            </AppLayout>
          }
        />

        <Route
          path="/news"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <News />
            </AppLayout>
          }
        />

        <Route
          path="/about"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <AboutUs />
            </AppLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <Contact />
            </AppLayout>
          }
        />

        <Route
          path="/privacy"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <PrivacyPolicy />
            </AppLayout>
          }
        />

        <Route
          path="/terms"
          element={
            <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
              <TermsOfService />
            </AppLayout>
          }
        />

        {/* SECURED ROUTES */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                <ProfilePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/premium"
          element={
              <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                <PremiumFeatures />
              </AppLayout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f] text-white">
              <h1 className="text-6xl font-black italic text-blue-500 mb-4 uppercase tracking-tighter">
                404
              </h1>
              <p className="uppercase font-black tracking-widest text-[10px] text-slate-500">
                The Arena is Empty | Page Not Found
              </p>
              <button
                onClick={() => (window.location.href = "/home")}
                className="mt-8 px-8 py-3 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl"
              >
                Return to Base
              </button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
