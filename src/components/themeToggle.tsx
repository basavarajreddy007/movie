import { useEffect, useState } from "react";
import "../styles/themeToggle.css";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [dark]);

  return (
    <label className="theme-switch" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <input
        type="checkbox"
        className="theme-switch__checkbox"
        checked={dark}
        onChange={() => setDark((value) => !value)}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <div className="theme-switch__container">
        <div className="theme-switch__circle-container">
          <div className="theme-switch__sun-moon-container">
            <div className="theme-switch__moon">
              <div className="theme-switch__spot" />
              <div className="theme-switch__spot" />
              <div className="theme-switch__spot" />
            </div>
          </div>
        </div>
        <div className="theme-switch__clouds" />
        <div className="theme-switch__stars-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 144 55"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M138.5 18.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zm-20-10a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zm-35 25a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zm-60-15a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zm105 10a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zm-80-20a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zM12 8a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm30 15a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm50-10a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm25 20a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1z"
            />
          </svg>
        </div>
      </div>
    </label>
  );
}