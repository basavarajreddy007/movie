import { useState } from "react";
import { SearchBar } from "./SearchBar";
import "../styles/navbar.css";

type Props = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onSearch?: (query: string) => void;
};

export function Navbar({
  darkMode,
  setDarkMode,
  onSearch,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (onSearch && searchValue.trim()) {
      setLoading(true);
      onSearch(searchValue);
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon"></span>
          <span className="logo-text">MOVIEMAX</span>
        </div>

        <div className="navbar-search">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={() =>
              setDarkMode((prev) => !prev)
            }
            aria-label="Toggle theme"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}