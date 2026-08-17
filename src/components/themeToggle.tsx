import { useEffect, useState } from "react";
import { ThemeSwitch } from "./ThemeSwitch";

export { ThemeSwitch };

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [dark]);

  return <ThemeSwitch darkMode={dark} setDarkMode={setDark} />;
}