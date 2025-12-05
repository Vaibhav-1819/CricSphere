import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Activity, 
  BarChart3, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

// --- Import Logo ---
import Logo from '../../assets/cricsphere-logo.png';

// --- DATA ---
const FEATURES = [
  {
    id: 1,
    title: "Match Impact Score (MIS)",
    desc: "Our proprietary algorithm calculates the true value of every player, going beyond basic averages.",
    icon: Activity,
    stat: "98% Accuracy"
  },
  {
    id: 2,
    title: "Real-Time Analytics",
    desc: "Live visualizations, win probability graphs, and wagon wheels updated ball-by-ball.",
    icon: Zap,
    stat: "< 200ms Latency"
  },
  {
    id: 3,
    title: "Deep Stat Explorer",
    desc: "Filter 50+ years of cricket history. Compare players across eras with normalized metrics.",
    icon: BarChart3,
    stat: "50k+ Matches"
  }
];

const RegisterPage = () => {
  // Form State
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false); 
  
  // Carousel State
  const [activeFeature, setActiveFeature] = useState(0);

  const navigate = useNavigate();
  const { register } = useAuth(); 

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        toast.success("Account created! Redirecting...");
        setTimeout(() => navigate('/home'), 1500);
      } else {
        toast.error("Registration failed. Try again.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans selection:bg-emerald-500/30">
      
      {/* --- LEFT PANEL: BRAND EXPERIENCE --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2600&auto=format&fit=crop" 
            alt="Cricket Stadium" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-900/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          
          {/* --- LOGO SECTION --- */}
          <div className="flex items-center gap-4">
            {/* Logo Container */}
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-xl">
              <img 
                src={Logo} 
                alt="CricSphere Logo" 
                className="w-8 h-8 object-contain" 
              />
            </div>
            {/* Brand Text */}
            <span className="text-3xl font-black text-white tracking-tight">
              CricSphere
            </span>
          </div>

          {/* Feature Carousel */}
          <div className="max-w-md">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/10 text-emerald-400">
                  {React.createElement(FEATURES[activeFeature].icon, { size: 24 })}
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                  {FEATURES[activeFeature].title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {FEATURES[activeFeature].desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                  <ShieldCheck size={14} /> {FEATURES[activeFeature].stat}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bars */}
            <div className="flex gap-2">
              {FEATURES.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: activeFeature === idx ? "100%" : "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className={`h-full ${activeFeature === idx ? 'bg-emerald-500' : 'bg-transparent'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-xs text-slate-500">
            © 2025 CricSphere Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-950">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Join the community of data-driven cricket fans.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="e.g. kohli_fan_18"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength hint (static for now) */}
              <div className="flex gap-1 mt-2 pl-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 w-full rounded-full ${formData.password.length > i*2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </motion.button>

          </form>

          {/* Footer / Login Link */}
          <div className="text-center pt-4">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-slate-600 px-6">
            By clicking "Create Account", you agree to our <Link to="/terms" className="hover:text-slate-400">Terms</Link> and <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>.
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;