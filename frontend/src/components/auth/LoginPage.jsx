import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  LayoutDashboard, 
  BellRing, 
  Trophy 
} from 'lucide-react';

// --- Import Logo ---
import Logo from '../../assets/cricsphere-logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Focus state for input animations
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        toast.success('Welcome back to CricSphere! 🏏');
        setTimeout(() => navigate('/home'), 1000);
      } else {
        toast.error('Invalid Username or Password');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
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
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600&auto=format&fit=crop" 
            alt="Cricket Stadium at Night" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-900/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full p-16 flex flex-col justify-between h-full">
          
          {/* --- LOGO SECTION --- */}
          <div className="flex items-center gap-4">
            {/* Logo Container - Matches Register Page */}
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-xl">
              <img 
                src={Logo} 
                alt="CricSphere Logo" 
                className="w-8 h-8 object-contain" 
              />
            </div>
            <span className="text-3xl font-black text-white tracking-tight">
              CricSphere
            </span>
          </div>

          {/* Value Props */}
          <div className="max-w-md space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Welcome back, <br/>
                <span className="text-emerald-400">Strategist.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Your personalized analytics dashboard is ready. Dive back into the data.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { icon: LayoutDashboard, text: "Personalized Feed" },
                { icon: BellRing, text: "Live Match Alerts" },
                { icon: Trophy, text: "Premium Leaderboards" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <item.icon size={20} />
                  </div>
                  <span className="font-semibold text-slate-200">{item.text}</span>
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

      {/* --- RIGHT PANEL: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-950">
        {/* Ambient Glows */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'username' ? 'text-emerald-500' : 'text-slate-500'}`}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-500'}`}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
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
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-700 bg-slate-900 checked:border-emerald-500 checked:bg-emerald-500 transition-all"
                  />
                  <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
                Forgot password?
              </Link>
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
                  Log In <ArrowRight size={18} />
                </>
              )}
            </motion.button>

          </form>

          {/* Footer Link */}
          <div className="text-center pt-4">
            <p className="text-slate-400 text-sm">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;