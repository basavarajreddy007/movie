import "../styles/loader.css";

export interface SpinnerProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export function UiverseSpinner({ size = 48, className = "" }: SpinnerProps) {
  const pixelSize = typeof size === "number" ? size : 48;

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`.trim()}
      style={{ width: pixelSize, height: pixelSize }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 50 50" className="animate-spin w-full h-full text-[#FF3D68]">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="90"
          strokeDashoffset="60"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export interface LoaderProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  dynamicMessages?: string[];
  size?: "xs" | "sm" | "md" | "lg" | "fullscreen";
  showGlow?: boolean;
  className?: string;
  inline?: boolean;
}

export function Loader({
  title = "Loading Movies",
  subtitle,
  badge = "CINEMA EXPERIENCE",
  size = "md",
  className = "",
  inline = false,
}: LoaderProps) {
  if (inline || size === "xs") {
    return (
      <div className={`inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium ${className}`}>
        <UiverseSpinner size={20} />
        {title && <span className="text-sm">{title}</span>}
      </div>
    );
  }

  const isFullscreen = size === "fullscreen";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#f4f6fa]/95 dark:bg-[#080B15]/95 backdrop-blur-md px-4"
          : "w-full py-16 sm:py-24 px-4"
      } ${className}`}
      role="status"
    >
      <div className="relative flex items-center justify-center mb-5">
        <UiverseSpinner size={size === "sm" ? 32 : 56} />
      </div>

      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-[#FF3D68]/10 border border-[#FF3D68]/30 text-[#FF3D68] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D68] animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
      )}

      {subtitle && (
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default Loader;
