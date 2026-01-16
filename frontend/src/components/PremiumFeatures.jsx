import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Crown, Shield, BarChart2, BrainCircuit, Zap } from "lucide-react";

/* ==========================================================
   MODAL
========================================================== */
const LaunchingSoonModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          className="relative w-full max-w-sm rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] shadow-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Crown size={18} className="text-blue-500" />
            </div>

            <div className="flex-1">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Premium Coming Soon
              </h2>
              <p className="text-[12px] font-semibold text-slate-500">
                Selected plan: <span className="text-blue-500">{plan}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4">
            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
              We’re finalizing payment integration. Premium plans will be available soon.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-wide transition-all"
          >
            Okay
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ==========================================================
   PRICING CARD (Compact)
========================================================== */
const PricingCard = ({
  title,
  price,
  period,
  features,
  recommended = false,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`relative rounded-3xl border p-5 flex flex-col h-full transition-all ${
        recommended
          ? "border-blue-500/50 bg-blue-500/[0.06]"
          : "border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16]"
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-600 text-white shadow-lg">
          Best Value
        </div>
      )}

      <div className="mb-4 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
          {title}
        </p>

        <div className="mt-2 flex items-end justify-center gap-1">
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {price}
          </span>
          {price !== "Rs.0" && (
            <span className="text-[12px] font-bold text-slate-500">{period}</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-5 flex-grow">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px]">
            {feat.included ? (
              <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <X size={14} className="text-slate-300 dark:text-slate-700 mt-0.5 shrink-0" />
            )}

            <span
              className={
                feat.included
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-slate-400 line-through"
              }
            >
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(title)}
        className={`w-full py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wide transition-all ${
          recommended
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10"
        }`}
      >
        {price === "Rs.0" ? "Current Plan" : "Upgrade"}
      </button>
    </motion.div>
  );
};

/* ==========================================================
   FEATURE ITEM
========================================================== */
const FeatureItem = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
      <Icon size={18} className="text-blue-500" />
    </div>
    <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400">
      {title}
    </span>
  </div>
);

/* ==========================================================
   MAIN PAGE
========================================================== */
export default function PremiumFeatures() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handlePlanSelect = (planTitle) => {
    if (planTitle.toLowerCase().includes("fan")) return; // free plan = no modal
    setSelectedPlan(planTitle);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] text-slate-900 dark:text-slate-200">
      <LaunchingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold">
            <Crown size={14} />
            Premium Plans
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
            Upgrade your CricSphere experience
          </h1>

          <p className="mt-2 text-[13px] text-slate-500 leading-relaxed">
            Unlock faster updates, advanced insights and a clean ad-free experience.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] flex items-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Yearly{" "}
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <PricingCard
            title="Arena Fan"
            price="Rs.0"
            period="/ forever"
            onSelect={handlePlanSelect}
            features={[
              { text: "Live scores (standard)", included: true },
              { text: "News feed access", included: true },
              { text: "Series & schedules", included: true },
              { text: "Advanced insights", included: false },
            ]}
          />

          <PricingCard
            title="Analyst Pro"
            recommended
            price={billingCycle === "monthly" ? "Rs.49" : "Rs.39"}
            period="/ month"
            onSelect={handlePlanSelect}
            features={[
              { text: "Faster live updates", included: true },
              { text: "Ad-free experience", included: true },
              { text: "Advanced match insights", included: true },
              { text: "Premium UI badge", included: true },
            ]}
          />

          <PricingCard
            title="Fantasy Elite"
            price={billingCycle === "monthly" ? "Rs.99" : "Rs.79"}
            period="/ month"
            onSelect={handlePlanSelect}
            features={[
              { text: "Everything in Analyst Pro", included: true },
              { text: "AI fantasy suggestions", included: true },
              { text: "Priority support", included: true },
              { text: "Early access features", included: true },
            ]}
          />
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-black/10 dark:border-white/10 mt-10 pt-10">
          <FeatureItem icon={Zap} title="Faster Updates" />
          <FeatureItem icon={Shield} title="Ad-Free" />
          <FeatureItem icon={BarChart2} title="Insights" />
          <FeatureItem icon={BrainCircuit} title="AI Tools" />
        </div>
      </div>
    </div>
  );
}
