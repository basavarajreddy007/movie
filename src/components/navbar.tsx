import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, Menu, X, UserIcon, LogOutIcon, Sparkles } from "./icons";
import { SearchBar } from "./SearchBar";
import { ThemeSwitch } from "./ThemeSwitch";
import { useAuth } from "../context/AuthContext";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, isAuthenticated, bookmarkCount, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isMovieDetailPage = location.pathname.startsWith("/movie");
  const isBookmarksPage = location.pathname === "/bookmarks";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") ?? "";
    setSearchValue(query);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSearch = () => {
    const query = searchValue.trim();
    if (!query) return;

    navigate(`/?q=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false);
    onSearch?.(query);
  };

  const handleLogoClick = () => {
    setSearchValue("");
    setIsMobileMenuOpen(false);

    if (isAuthenticated) {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar-container sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0F1322]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-0 min-h-[64px] sm:min-h-[72px] flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-6 relative">
        <Link
          to={isAuthenticated ? "/" : "/login"}
          onClick={handleLogoClick}
          className="flex items-center gap-2 flex-shrink-0 group cursor-pointer transition-transform duration-200 hover:scale-105"
          title="MOVIEMAX"
        >
          <span
            className="brand-logo-text text-xl sm:text-2xl font-black tracking-wider uppercase inline-flex items-center drop-shadow-sm"
            aria-label="MOVIEMAX"
          >
            MOVIEMAX
          </span>
        </Link>

        {/* Search Bar - only shown when not on movie details or auth page */}
        {!isMovieDetailPage && !isAuthPage && isAuthenticated && (
          <div className="order-3 md:order-2 w-full md:w-auto flex-1 max-w-full md:max-w-md lg:max-w-lg mx-auto">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
            />
          </div>
        )}

        <div className="order-2 md:order-3 flex items-center gap-3 flex-shrink-0">
          {/* Bookmarks link - only for authenticated users */}
          {isAuthenticated && (
            <Link
              to="/bookmarks"
              className={`hidden md:inline-flex items-center gap-2 px-4 h-10 sm:h-11 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                isBookmarksPage
                  ? "bg-[#FF3D68] border-[#FF3D68] text-white shadow-md shadow-[#FF3D68]/20"
                  : "bg-white dark:bg-[#121625] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#FF3D68] hover:border-[#FF3D68] hover:text-white"
              }`}
              title="Bookmarks"
              aria-label={`View bookmarks (${bookmarkCount})`}
            >
              <Bookmark size={18} />
              <span>Bookmarks</span>
              {bookmarkCount > 0 && (
                <span
                  className={`nav-bookmark-badge ${
                    isBookmarksPage
                      ? "bg-white text-[#FF3D68]"
                      : "bg-[#FF3D68] text-white group-hover:bg-white group-hover:text-[#FF3D68]"
                  }`}
                >
                  {bookmarkCount}
                </span>
              )}
            </Link>
          )}

          {/* Theme Switcher - always visible */}
          <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* User profile / auth state buttons */}
          {isAuthenticated && user ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 h-10 sm:h-11 rounded-xl bg-slate-100 dark:bg-[#121625] border border-slate-200 dark:border-white/10 hover:border-[#FF3D68]/50 transition-all text-slate-900 dark:text-white text-sm font-semibold cursor-pointer"
                aria-label="User profile menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="user-avatar-gradient w-7 h-7 rounded-lg text-xs shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div className="nav-dropdown-animate absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOutIcon size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : isAuthPage ? (
            <div className="hidden sm:inline-flex items-center gap-2 px-3.5 h-10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <Sparkles size={14} className="text-[#FF3D68]" />
              <span>Cinema Portal</span>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 h-10 sm:h-11 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md shadow-[#FF3D68]/20 hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <UserIcon size={18} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121625] text-slate-700 dark:text-slate-200 hover:bg-[#FF3D68] hover:border-[#FF3D68] hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute right-4 top-full mt-2 w-72 max-w-[calc(100vw-32px)] z-50 flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-2xl animate-fadeIn">
          {isAuthenticated && user ? (
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121625] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="user-avatar-gradient w-8 h-8 rounded-lg text-xs flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOutIcon size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md shadow-[#FF3D68]/20 transition-all cursor-pointer"
            >
              <UserIcon size={18} />
              <span>Sign In / Register</span>
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/bookmarks"
              className={`flex items-center justify-between p-2.5 rounded-xl border font-semibold text-sm transition-colors ${
                isBookmarksPage
                  ? "bg-[#FF3D68] border-[#FF3D68] text-white"
                  : "bg-slate-50 dark:bg-[#121625] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-[#FF3D68] hover:border-[#FF3D68] hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={18} />
                <span>Bookmarks</span>
              </div>

              {bookmarkCount > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold ${
                    isBookmarksPage
                      ? "bg-white text-[#FF3D68]"
                      : "bg-[#FF3D68] text-white"
                  }`}
                >
                  {bookmarkCount}
                </span>
              )}
            </Link>
          )}

          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121625]">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Theme
            </span>
            <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;