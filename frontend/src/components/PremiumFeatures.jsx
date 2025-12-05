import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Zap, Crown, Shield, BarChart2, 
  Smartphone, Mic, Star, TrendingUp, Users, BrainCircuit
} from 'lucide-react';

// --- COMPONENTS ---

const LaunchingSoonModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center"
        >
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Coming Soon!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            We are putting the final touches on the <strong>{plan}</strong> experience. Payments are not yet active.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 text-sm text-left border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">What to expect:</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex gap-2 items-center"><Check size={14} className="text-green-500"/> Seamless UPI integration</li>
              <li className="flex gap-2 items-center"><Check size={14} className="text-green-500"/> Instant activation</li>
              <li className="flex gap-2 items-center"><Check size={14} className="text-green-500"/> 7-day refund policy</li>
            </ul>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Got it, thanks!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const PricingCard = ({ title, price, period, features, recommended = false, onSelect }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`relative p-8 rounded-3xl border flex flex-col h-full ${recommended ? 'border-indigo-500 bg-slate-900 text-white shadow-2xl z-10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg'}`}
  >
    {recommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg whitespace-nowrap">
        Most Popular
      </div>
    )}

    <div className="mb-6 text-center">
      <h3 className={`text-lg font-bold uppercase tracking-wider mb-2 ${recommended ? 'text-indigo-300' : 'text-slate-500'}`}>{title}</h3>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-black">{price}</span>
        {price !== "Free" && <span className={`text-sm ${recommended ? 'text-indigo-200' : 'text-slate-400'}`}>{period}</span>}
      </div>
    </div>

    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feat, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          {feat.included ? (
            <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${recommended ? 'bg-indigo-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
              <Check size={12} strokeWidth={3} />
            </div>
          ) : (
            <div className="p-0.5 rounded-full shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400">
              <X size={12} strokeWidth={3} />
            </div>
          )}
          <span className={!feat.included ? 'text-slate-400 line-through' : ''}>{feat.text}</span>
        </li>
      ))}
    </ul>

    <button 
      onClick={() => onSelect(title)}
      className={`w-full py-3 rounded-xl font-bold text-sm transition-transform active:scale-95 ${recommended ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'}`}
    >
      {price === "Free" ? 'Current Plan' : 'Select Plan'}
    </button>
  </motion.div>
);

// --- MAIN PAGE ---

const PremiumFeatures = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePlanSelect = (planTitle) => {
    if (planTitle.includes('Free')) return; // Don't show modal for free plan
    setSelectedPlan(planTitle);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans py-12 px-4 transition-colors duration-300">
      
      <LaunchingSoonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlan}
      />

      {/* 1. HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Crown size={14} /> CricSphere Premium
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight"
        >
          Data Deep Dives <br /> & Expert Insights.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 dark:text-slate-300 mb-8"
        >
          Get faster scores, ad-free browsing, and AI-powered fantasy predictions to win your leagues.
        </motion.p>
      </div>

      {/* 2. FEATURES GRID */}
      <div className="container mx-auto max-w-6xl mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureItem 
            icon={Zap} 
            title="Instant Score Updates" 
            desc="Socket-connected scorecards that update milliseconds before the TV broadcast." 
          />
          <FeatureItem 
            icon={Shield} 
            title="Zero Ads" 
            desc="Enjoy a clean, clutter-free interface. No popups, no banners, just cricket." 
          />
          <FeatureItem 
            icon={BarChart2} 
            title="Visual Analytics" 
            desc="Wagon wheels, Manhattan charts, and pitch maps for every single player." 
          />
          <FeatureItem 
            icon={BrainCircuit} 
            title="AI Predictions" 
            desc="Win probability calculator updated ball-by-ball based on historical data." 
          />
          <FeatureItem 
            icon={Mic} 
            title="Audio Commentary" 
            desc="Listen to expert ball-by-ball audio commentary in multiple languages." 
          />
          <FeatureItem 
            icon={Users} 
            title="Fantasy Assistant" 
            desc="Get the perfect 11. Player matchup data to help you build winning teams." 
          />
        </div>
      </div>

      {/* 3. PRICING SECTION */}
      <div className="container mx-auto max-w-6xl">
        {/* Toggle Switch */}
        <div className="flex justify-center mb-10">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800 flex items-center relative">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              Yearly <span className="text-[10px] bg-green-400 text-green-900 px-1.5 rounded ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* FREE PLAN */}
          <PricingCard 
            title="Fan (Free)" 
            price="Rs.0" 
            period="/ forever"
            onSelect={handlePlanSelect}
            features={[
              { text: "Live Scores (Standard Speed)", included: true },
              { text: "News & Editorials", included: true },
              { text: "Basic Scorecard", included: true },
              { text: "Text Commentary", included: true },
              { text: "Ad-Free Experience", included: false },
              { text: "Wagon Wheels & Charts", included: false },
              { text: "Fantasy Expert Team", included: false },
              { text: "Historical Stats Archive", included: false },
            ]}
          />

          {/* PRO PLAN */}
          <PricingCard 
            title="Analyst Pro" 
            price={billingCycle === 'monthly' ? "Rs.49" : "Rs.39"} 
            period="/ mo"
            recommended={true}
            onSelect={handlePlanSelect}
            features={[
              { text: "Everything in Free", included: true },
              { text: "Fastest Live Scores", included: true },
              { text: "100% Ad-Free", included: true },
              { text: "Deep Stats (Wagon Wheels)", included: true },
              { text: "Audio Commentary", included: true },
              { text: "Player Matchups", included: true },
              { text: "AI Win Probability", included: false },
              { text: "Multiple Fantasy Teams", included: false },
            ]}
          />

          {/* ELITE PLAN */}
          <PricingCard 
            title="Fantasy Elite" 
            price={billingCycle === 'monthly' ? "Rs.99" : "Rs.79"} 
            period="/ mo"
            onSelect={handlePlanSelect}
            features={[
              { text: "Everything in Pro", included: true },
              { text: "AI Win Probability", included: true },
              { text: "Generated Fantasy Teams (GL/SL)", included: true },
              { text: "Captaincy Predictor", included: true },
              { text: "Historical Stats Archive (10y)", included: true },
              { text: "Verified User Badge", included: true },
              { text: "Priority Support", included: true },
              { text: "Dark Mode Custom Themes", included: true },
            ]}
          />

        </div>
      </div>

      {/* 4. TRUST BADGE */}
      <div className="mt-20 text-center border-t border-slate-200 dark:border-slate-800 pt-10">
        <p className="text-slate-500 text-sm mb-4">Secured by Industry Standards</p>
        <div className="flex justify-center gap-8 opacity-40 grayscale">
            <h3 className="text-xl font-bold text-slate-400">UPI</h3>
            <h3 className="text-xl font-bold text-slate-400">Razorpay</h3>
            <h3 className="text-xl font-bold text-slate-400">VISA</h3>
            <h3 className="text-xl font-bold text-slate-400">MasterCard</h3>
        </div>
      </div>

    </div>
  );
};

export default PremiumFeatures;