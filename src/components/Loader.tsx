import { useState, useEffect, useId } from "react";
import "../styles/loader.css";

export interface SpinnerProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export function UiverseSpinner({
  size = 48,
  className = "",
  strokeWidth = 7,
}: SpinnerProps) {
  const rawId = useId().replace(/:/g, "_");
  const grad1Id = `uiverse_g1_${rawId}`;
  const grad2Id = `uiverse_g2_${rawId}`;

  const numSize = typeof size === "number" ? size : parseInt(size, 10) || 48;

  return (
    <div
      className={`inline-flex items-center justify-center relative flex-shrink-0 ${className}`}
      style={{ width: numSize, height: numSize }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        width={numSize}
        height={numSize}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={grad1Id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3D68" />
            <stop offset="100%" stopColor="#FFA06B" />
          </linearGradient>
          <linearGradient id={grad2Id} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA06B" />
            <stop offset="100%" stopColor="#FF3D68" />
          </linearGradient>
        </defs>

        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-15 dark:opacity-20 text-slate-400 dark:text-slate-500"
        />

        <circle
          className="dash"
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={`url(#${grad1Id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength="360"
        />

        <circle
          className="spin"
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={`url(#${grad2Id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength="360"
        />
      </svg>
    </div>
  );
}

const DEFAULT_DYNAMIC_MESSAGES = [
  "Dimming the cinema lights...",
  "Rolling the 35mm film reels...",
  "Curating top-rated blockbusters...",
  "Fetching high-res movie posters...",
  "Grabbing the popcorn for showtime...",
];

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
  dynamicMessages = DEFAULT_DYNAMIC_MESSAGES,
  size = "md",
  showGlow = true,
  className = "",
  inline = false,
}: LoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!dynamicMessages || dynamicMessages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % dynamicMessages.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [dynamicMessages]);

  const displayedSubtitle =
    subtitle ?? (dynamicMessages && dynamicMessages.length > 0
      ? dynamicMessages[currentMessageIndex]
      : undefined);

  const spinnerSize =
    size === "xs"
      ? 18
      : size === "sm"
      ? 28
      : size === "md"
      ? 54
      : size === "lg" || size === "fullscreen"
      ? 68
      : 54;

  const strokeWidth = size === "xs" || size === "sm" ? 9 : 7;

  if (inline || size === "xs") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium ${className}`}
        role="status"
        aria-live="polite"
      >
        <UiverseSpinner size={spinnerSize} strokeWidth={strokeWidth} />
        {title && <span className="text-sm font-medium">{title}</span>}
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div
        className={`flex items-center justify-center gap-3 py-6 px-4 text-slate-600 dark:text-slate-300 ${className}`}
        role="status"
        aria-live="polite"
      >
        <UiverseSpinner size={spinnerSize} strokeWidth={strokeWidth} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </span>
          {displayedSubtitle && (
            <span
              key={displayedSubtitle}
              className="text-xs text-slate-500 dark:text-slate-400 loader-fade-slide"
            >
              {displayedSubtitle}
            </span>
          )}
        </div>
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
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center mb-6">
        {showGlow && (
          <div
            className="loader-glow"
            style={{
              width: spinnerSize * 2.2,
              height: spinnerSize * 2.2,
            }}
          />
        )}
        <UiverseSpinner size={spinnerSize} strokeWidth={strokeWidth} />
      </div>

      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-[#FF3D68]/10 dark:bg-[#FF3D68]/15 border border-[#FF3D68]/30 text-[#FF3D68] mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D68] animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {displayedSubtitle && (
        <div className="min-h-[1.5rem] flex items-center justify-center">
          <p
            key={displayedSubtitle}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-sm mx-auto loader-fade-slide"
          >
            {displayedSubtitle}
          </p>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-4 opacity-75">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D68] loader-dot-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFA06B] loader-dot-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D68] loader-dot-pulse" />
      </div>
    </div>
  );
}

export default Loader;
