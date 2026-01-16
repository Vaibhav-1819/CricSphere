import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/cricsphere-logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070c] flex">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c]">
        {/* Soft glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-indigo-600/10 rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 w-full p-14 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="CricSphere" className="w-10 h-10" />
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              CricSphere
            </span>
          </div>

          <div className="max-w-md">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Create your account
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Start tracking cricket like a{" "}
              <span className="text-blue-600 dark:text-blue-400">pro</span>.
            </h1>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Get live scores, schedules, team details, stats, and premium analysis
              in a clean modern dashboard.
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} CricSphere. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f16] p-7 md:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create account
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Join CricSphere in less than a minute
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username */}
            <div>
              <label className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                Username
              </label>
              <div className="relative mt-2">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  placeholder="kohli_fan_18"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                Email
              </label>
              <div className="relative mt-2">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-500">
                Use 8+ characters for a strong password.
              </p>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 transition disabled:opacity-60"
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

          <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
