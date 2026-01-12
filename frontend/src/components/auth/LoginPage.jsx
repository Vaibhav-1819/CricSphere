import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/cricsphere-logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({ username, password });
      toast.success(`Welcome back ${data.user.username} 🏏`);
      navigate("/home");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Invalid username or password"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-700 via-slate-900 to-black p-16 flex-col justify-between">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="CricSphere" className="w-10 h-10" />
          <span className="text-3xl font-black text-white">CricSphere</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Cricket.<br />Reimagined.
          </h1>
          <p className="mt-4 text-slate-300 max-w-md">
            Live matches, stats, news, and personalized dashboards — all in one place.
          </p>
        </div>

        <p className="text-slate-500 text-sm">
          © 2025 CricSphere Inc.
        </p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
          <p className="text-slate-400 mb-6">
            Access your CricSphere account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm text-slate-400">Username</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-400">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  required
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-lg hover:brightness-110 transition"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
