import { SearchBar } from "./SearchBar";
import "../styles/navbar.css";

type Props = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Navbar({
  darkMode,
  setDarkMode,
}: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        MOVIEMAX
      </div>

      <SearchBar
        value=""
        onChange={() => {}}
        onSearch={() => {}}
        loading={false}
      />

      <button
        className="theme-toggle"
        onClick={() =>
          setDarkMode((prev) => !prev)
        }
        aria-label="Toggle theme"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}