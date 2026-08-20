import "../styles/loader.css";

export interface LoaderProps {
  title?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({
  title = "Loading...",
  size = "md",
  className = "",
}: LoaderProps) {
  const pixelSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}
      role="status"
    >
      <div
        className="inline-flex items-center justify-center mb-3"
        style={{ width: pixelSize, height: pixelSize }}
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
      {title && (
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </p>
      )}
    </div>
  );
}

export default Loader;

