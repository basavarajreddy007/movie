import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, Menu, X } from "./icons";
import { SearchBar } from "./SearchBar";
import { ThemeSwitch } from "./ThemeSwitch";
import { getBookmarks } from "../utils/bookmarks";
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
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    if (query) {
      if (location.pathname !== "/") {
        navigate("/");
      }
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  const handleLogoClick = () => {
    setSearchValue("");
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isMovieDetailPage = location.pathname.startsWith("/movie");

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

        {!isMovieDetailPage && (
          <div className="navbar-search">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
            />
          </div>
        )}

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

          <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
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
            <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      )}
    </nav>
  );
}