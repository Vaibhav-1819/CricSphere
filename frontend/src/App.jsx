import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// --- Existing Components ---
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import LiveScore from './components/LiveScore'; 
import MatchDetail from './components/MatchDetail'; // ⭐ Added MatchDetail Import
import Schedules from './components/Schedules';
import Teams from './components/Teams';
import TeamDetails from './components/TeamDetails'; 
import Stats from './components/Stats';
import News from './components/News';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import SeriesPage from './components/SeriesPage'; 
import LoginPage from './components/auth/LoginPage'; 
import RegisterPage from './components/auth/RegisterPage'; 
import ProfilePage from './components/ProfilePage';
import IntroPage from './components/IntroPage'; 

// --- New Pages ---
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import PremiumFeatures from './components/PremiumFeatures'; 

import './index.css';

// ⭐ Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

// Reusable Layout Component
const Layout = ({ children, toggleDarkMode, darkMode }) => (
  <div className={`min-h-screen flex flex-col transition-colors duration-500`}>
    <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    <main className="flex-grow bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500 min-h-[calc(100vh-8rem)]">
      <div className="w-full"> 
        {children}
      </div>
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

function App() {
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      
      <Routes>
        {/* ROOT & AUTH ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        
        {/* APP ROUTES WRAPPED IN LAYOUT */}
        <Route path="/home" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><Home /></Layout>
        } />
        
        <Route path="/live-scores" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><LiveScore /></Layout>
        } />

        {/* ⭐ NEW: MATCH DETAIL ROUTE */}
        <Route path="/match/:id" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><MatchDetail /></Layout>
        } />

        <Route path="/schedules" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><Schedules /></Layout>
        } />
        
        <Route path="/schedules/:seriesId" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><SeriesPage /></Layout>
        } />
        
        <Route path="/teams" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><Teams /></Layout>
        } />
        
        <Route path="/teams/:teamId" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><TeamDetails /></Layout>
        } />
        
        <Route path="/stats" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><Stats /></Layout>
        } />
        
        <Route path="/news" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><News /></Layout>
        } />

        <Route path="/profile" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><ProfilePage /></Layout>
        } />

        {/* SUPPORT & LEGAL */}
        <Route path="/about" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><AboutUs /></Layout>
        } />
        <Route path="/contact" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><Contact /></Layout>
        } />
        <Route path="/privacy" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><PrivacyPolicy /></Layout>
        } />
        <Route path="/terms" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><TermsOfService /></Layout>
        } />
        <Route path="/premium" element={
          <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}><PremiumFeatures /></Layout>
        } />

        {/* 404 FALLBACK */}
        <Route path="*" element={
          <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
            <h1 className="text-2xl font-bold">404 | Page Not Found</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;