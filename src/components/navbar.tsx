import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, Menu, X } from "./icons";
import { SearchBar } from "./SearchBar";
import { getBookmarks } from "../utils/bookmarks";
import "../styles/navbar.css";
import "../styles/themeToggle.css";

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
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateCount = () => {
      try {
        const bookmarks = getBookmarks();
        setBookmarkCount(Array.isArray(bookmarks) ? bookmarks.length : 0);
      } catch {
        setBookmarkCount(0);
      }
    };

    updateCount();
    window.addEventListener("bookmarksUpdated", updateCount);

    return () => {
      window.removeEventListener("bookmarksUpdated", updateCount);
    };
  }, []);

  const handleSearch = () => {
    const query = searchValue.trim();
    if (query && onSearch) {
      onSearch(query);
    }
  };

  const handleLogoClick = () => {
    setSearchValue("");
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={handleLogoClick}
          title="MOVIEMAX Home"
        >
          <span className="logo-text" aria-label="MOVIEMAX">
            <span className="logo-word logo-word-movie">
              <span className="logo-char">M</span>
              <span className="logo-char">O</span>
              <span className="logo-char">V</span>
              <span className="logo-char">I</span>
              <span className="logo-char">E</span>
            </span>
            <span className="logo-word logo-word-max">
              <span className="logo-char">M</span>
              <span className="logo-char">A</span>
              <span className="logo-char">X</span>
            </span>
          </span>
        </Link>

        <div className="navbar-search">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
          />
        </div>

        <div className="navbar-actions desktop-actions">
          <Link
            to="/bookmarks"
            className={`nav-link bookmark-nav-link ${location.pathname === "/bookmarks" ? "active" : ""}`}
            title="Bookmarks"
            aria-label={`View bookmarks (${bookmarkCount})`}
          >
            <Bookmark size={18} />
            <span className="nav-text">Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="bookmark-badge">{bookmarkCount}</span>
            )}
          </Link>

          <label className="theme-switch" title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <input
              type="checkbox"
              className="theme-switch__checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          title={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <Link
            to="/bookmarks"
            className={`mobile-menu-item ${location.pathname === "/bookmarks" ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bookmark size={18} />
              <span>Bookmarks</span>
            </div>
            {bookmarkCount > 0 && (
              <span className="bookmark-badge">{bookmarkCount}</span>
            )}
          </Link>

          <div className="mobile-menu-item mobile-theme-item">
            <span className="mobile-menu-label">Theme</span>
            <label className="theme-switch" title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <input
                type="checkbox"
                className="theme-switch__checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
          </div>
        </div>
      )}
    </nav>
  );
}