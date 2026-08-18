import { useState, useEffect, useMemo } from "react";
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

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export function LoginPage() {
  const { login, register, isAuthenticated, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const initialTab =
    location.pathname === "/register" || searchParams.get("tab") === "register"
      ? "register"
      : "login";

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isShaking, setIsShaking] = useState(false);

  const isRegister = activeTab === "register";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const urlTab =
      location.pathname === "/register" || searchParams.get("tab") === "register"
        ? "register"
        : "login";
    setActiveTab(urlTab);
    setFieldErrors({});
    clearAuthError();
  }, [location.pathname, searchParams, clearAuthError]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 550);
  };

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setFieldErrors({});
    clearAuthError();
    setShowPassword(false);
    navigate(tab === "register" ? "/register" : "/login", { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FieldErrors];
        return next;
      });
    }

    if (fieldErrors.general) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.general;
        return next;
      });
    }
  };

  const passwordStrength = useMemo(() => {
    if (!form.password) return { score: 0, label: "", color: "", text: "", widthClass: "w-0" };
    let score = 0;
    if (form.password.length >= 6) score += 1;
    if (form.password.length >= 10) score += 1;
    if (/[A-Z]/.test(form.password) || /[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-rose-500", text: "text-rose-500", widthClass: "strength-bar-25" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500", text: "text-amber-500", widthClass: "strength-bar-50" };
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500", text: "text-blue-500", widthClass: "strength-bar-75" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500", widthClass: "strength-bar-100" };
      default:
        return { score: 15, label: "Too Short", color: "bg-rose-500", text: "text-rose-500", widthClass: "strength-bar-15" };
    }
  }, [form.password]);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedEmail = form.email.trim();
    const trimmedName = form.name.trim();

    if (isRegister && !trimmedName) {
      errors.name = "Full name is required.";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    } else if (isRegister && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake();
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = isRegister
        ? await register({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          })
        : await login({
            email: form.email.trim().toLowerCase(),
            password: form.password,
          });

      if (res.success) {
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setFieldErrors({ general: res.message || "Authentication failed." });
        triggerShake();
      }
    } catch {
      setFieldErrors({
        general: "Unable to connect to the server. Please verify backend is running on port 5000.",
      });
      triggerShake();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-ambient-orb-1" />
      <div className="login-ambient-orb-2" />

      <div className="relative z-10 w-full max-w-[460px] mx-auto">
        <div
          className={`login-card-panel transition-all duration-300 ${
            isShaking ? "animate-card-shake border-rose-500/40" : ""
          }`}
        >
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
                ? "Join MOVIEMAX to explore movies and manage your personal bookmarks."
                : "Sign in to access your movie watchlist and bookmarks."}
            </p>
          </div>

          <div className="login-tabs-container">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`login-tab-btn ${
                !isRegister ? "login-tab-btn-active" : "login-tab-btn-inactive"
              }`}
            >
              <UserIcon size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`login-tab-btn ${
                isRegister ? "login-tab-btn-active" : "login-tab-btn-inactive"
              }`}
            >
              <Sparkles size={16} />
              <span>Register</span>
            </button>
          </div>

          {fieldErrors.general && (
            <div className="p-3.5 sm:p-4 mb-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-medium animate-slideDown">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-rose-700 dark:text-rose-200 leading-snug">{fieldErrors.general}</p>
                  {fieldErrors.general.toLowerCase().includes("port 5000") && (
                    <p className="mt-1 text-[11px] text-rose-600/80 dark:text-rose-300/80">
                      Tip: Open terminal in <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/40 font-mono text-rose-800 dark:text-rose-200">backend</code> and run <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/40 font-mono text-rose-800 dark:text-rose-200">npm run dev</code>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="field-name"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon size={18} />
                  </div>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Alex Miller"
                    value={form.name}
                    onChange={handleChange}
                    className={`login-input-field ${
                      fieldErrors.name ? "border-rose-500 focus:border-rose-500" : ""
                    }`}
                    autoComplete="name"
                  />
                </div>
                {fieldErrors.name && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500 font-medium animate-slideDown">
                    <AlertCircle size={14} className="flex-shrink-0 text-rose-500" />
                    <span>{fieldErrors.name}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="field-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MailIcon size={18} />
                </div>
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`login-input-field ${
                    fieldErrors.email ? "border-rose-500 focus:border-rose-500" : ""
                  }`}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500 font-medium animate-slideDown">
                  <AlertCircle size={14} className="flex-shrink-0 text-rose-500" />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="field-password"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password {isRegister && <span className="text-slate-400 font-normal lowercase">(min. 6)</span>}
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LockIcon size={18} />
                </div>
                <input
                  id="field-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`login-input-field pr-11 ${
                    fieldErrors.password ? "border-rose-500 focus:border-rose-500" : ""
                  }`}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>

              {isRegister && form.password.length > 0 && (
                <div className="mt-2.5 animate-slideDown">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Strength:</span>
                    <span className={`font-bold ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.widthClass}`}
                    />
                  </div>
                </div>
              )}

              {fieldErrors.password && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500 font-medium animate-slideDown">
                  <AlertCircle size={14} className="flex-shrink-0 text-rose-500" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 mt-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF3D68] via-[#FF5E80] to-[#FFA06B] hover:brightness-110 active:scale-[0.98] shadow-lg shadow-[#FF3D68]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{isRegister ? "Creating Account..." : "Signing In..."}</span>
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
                  onClick={() => handleTabChange("login")}
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
                  onClick={() => handleTabChange("register")}
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
