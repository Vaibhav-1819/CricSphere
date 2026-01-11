import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Zap, Crown, Shield, BarChart2, 
  Users, BrainCircuit, ArrowRight 
} from 'lucide-react';

// --- 1. SUB-COMPONENT: MODAL (Fixed Reference Error) ---
const LaunchingSoonModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-slate-900 border border-white/10 w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Crown size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Arena Pro</h2>
          <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-bold">Plan: {plan}</p>
          <div className="bg-white/5 p-4 rounded-2xl mb-6 text-xs text-left border border-white/5 space-y-3">
             <p className="text-blue-400 font-black uppercase tracking-widest">Coming Soon</p>
             <p className="text-slate-300">We are finalizing the payment gateway for global access. Check back during the IPL 2026 launch.</p>
          </div>
          <button onClick={onClose} className="w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white transition-all">
            Understood
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- 2. SUB-COMPONENT: PRICING CARD (Optimized Size) ---
const PricingCard = ({ title, price, period, features, recommended = false, onSelect }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`relative p-6 md:p-8 rounded-[2.5rem] border flex flex-col h-full transition-all duration-500 ${
      recommended 
        ? 'border-blue-500 bg-blue-600/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' 
        : 'bg-white/5 border-white/10 hover:border-white/20'
    }`}
  >
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
        Recommended
      </div>
    )}
    <div className="mb-8 text-center">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{title}</h3>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl font-black tracking-tighter text-white">{price}</span>
        {price !== "Free" && <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{period}</span>}
      </div>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feat, i) => (
        <li key={i} className="flex items-start gap-3 text-xs font-medium">
          {feat.included ? (
            <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
          ) : (
            <X size={14} className="text-slate-700 shrink-0 mt-0.5" />
          )}
          <span className={!feat.included ? 'text-slate-600 line-through' : 'text-slate-300'}>{feat.text}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={() => onSelect(title)}
      className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
        recommended 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500' 
          : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
      }`}
    >
      {price === "Free" ? 'Current Plan' : 'Get Started'}
    </button>
  </motion.div>
);

// --- 3. MAIN PAGE COMPONENT ---
const PremiumFeatures = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePlanSelect = (planTitle) => {
    if (planTitle.includes('Fan')) return;
    setSelectedPlan(planTitle);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white font-sans py-16 px-6">
      <LaunchingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} plan={selectedPlan} />

      {/* Constraints: Max-width 7xl prevents "Enlarged" feel */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Crown size={12} className="fill-blue-400" /> Premium Access
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
            Elevate your <span className="text-blue-500">Analysis.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Switch to the Pro Tier for socket-speed telemetry, advanced wagon wheels, and zero advertisement interruption.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex items-center">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Yearly <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          <PricingCard title="Arena Fan" price="Rs.0" period="/ forever" onSelect={handlePlanSelect}
            features={[
              { text: "Live Scores (Standard Delay)", included: true },
              { text: "News & Editorial Feed", included: true },
              { text: "Ad-Supported Hub", included: true },
              { text: "Socket-Speed Telemetry", included: false },
            ]}
          />
          <PricingCard title="Analyst Pro" recommended={true} onSelect={handlePlanSelect}
            price={billingCycle === 'monthly' ? "Rs.49" : "Rs.39"} period="/ month"
            features={[
              { text: "Socket-Speed Live Scores", included: true },
              { text: "100% Ad-Free Experience", included: true },
              { text: "Advanced Wagon Wheels", included: true },
              { text: "Ball-by-Ball Predictive Logic", included: true },
            ]}
          />
          <PricingCard title="Fantasy Elite" price={billingCycle === 'monthly' ? "Rs.99" : "Rs.79"} period="/ month" onSelect={handlePlanSelect}
            features={[
              { text: "Everything in Analyst Pro", included: true },
              { text: "AI Generated Fantasy 11", included: true },
              { text: "Priority Support Line", included: true },
              { text: "Pro Badge in Community Chat", included: true },
            ]}
          />
        </div>

        {/* Feature Grid (Compact Icons) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5 pt-20 text-center">
            <FeatureItem icon={Zap} title="No Delay" />
            <FeatureItem icon={Shield} title="Ad-Free" />
            <FeatureItem icon={BarChart2} title="Visual Stats" />
            <FeatureItem icon={BrainCircuit} title="AI Engine" />
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
      <Icon size={20} className="text-blue-500" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</span>
  </div>
);

export default PremiumFeatures; // ENSURES EXPORT DEFAULT FIXED