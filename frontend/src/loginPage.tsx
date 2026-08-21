import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2,
  AlertCircle,
  MailIcon,
  LockIcon,
  UserIcon,
  Sparkles,
} from "./components/icons";
import "./styles/login.css";

export function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterPage = location.pathname === "/register";
  const [isRegister, setIsRegister] = useState(isRegisterPage);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
    setError(null);
  }, [location.pathname]);

  const switchTab = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setError(null);
    navigate(toRegister ? "/register" : "/login", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = form.email.trim();
    const password = form.password;
    const name = form.name.trim();

    if (isRegister && !name) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || (isRegister && password.length < 6)) {
      setError(isRegister ? "Password must be at least 6 characters." : "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = isRegister
        ? await register({ name, email, password })
        : await login({ email, password });

      if (res.success) {
        navigate("/", { replace: true });
      } else {
        setError(res.message || "Authentication failed.");
      }
    } catch {
      setError("Unable to connect to server. Ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-ambient-orb-1" />
      <div className="login-ambient-orb-2" />

      <div className="relative z-10 w-full max-w-[460px] mx-auto">
        <div className="login-card-panel">
          <div className="flex items-center justify-between mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <LockIcon size={13} className="text-[#FF3D68]" />
              <span>Cinema Portal</span>
            </span>
            <span className="text-[11px] font-black tracking-widest text-[#FF3D68] uppercase">
              MOVIEMAX
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {isRegister ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {isRegister
                ? "Join MOVIEMAX to explore movies and manage your personal watchlist."
                : "Sign in to access your saved movies and watchlist."}
            </p>
          </div>

          <div className="login-tabs-container">
            <button
              type="button"
              onClick={() => switchTab(false)}
              className={`login-tab-btn ${!isRegister ? "login-tab-btn-active" : "login-tab-btn-inactive"}`}
            >
              <UserIcon size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab(true)}
              className={`login-tab-btn ${isRegister ? "login-tab-btn-active" : "login-tab-btn-inactive"}`}
            >
              <Sparkles size={16} />
              <span>Register</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 mb-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Miller"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="login-input-field"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <MailIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="login-input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="login-input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF3D68] via-[#FF5E80] to-[#FFA06B] hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[#FF3D68]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isRegister ? "Create Free Account" : "Sign In to MOVIEMAX"}</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
            {isRegister ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab(false)}
                  className="font-bold text-[#FF3D68] hover:underline cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab(true)}
                  className="font-bold text-[#FF3D68] hover:underline cursor-pointer ml-1"
                >
                  Create account for free
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
