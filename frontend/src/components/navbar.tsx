import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  Menu,
  X,
  UserIcon,
  LogOutIcon,
  Sparkles,
} from "./icons";
import { SearchBar, type SearchFilters } from "./SearchBar";
import { ThemeSwitch } from "./ThemeSwitch";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

type Props = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Navbar({ darkMode, setDarkMode }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const {
    user,
    isAuthenticated,
    watchlistCount,
    logout,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isMovieDetailPage = location.pathname.startsWith("/movie");
  const isWatchlistPage = location.pathname === "/watchlist";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const showSearchBar = !isMovieDetailPage && !isAuthPage && isAuthenticated;

  // Sync searchValue with URL search param 'q'
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") || "");
  }, [location.search]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown & mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (filters?: SearchFilters) => {
    const params = new URLSearchParams();
    const query = searchValue.trim();
    if (query) params.set("q", query);
    if (filters?.genre) params.set("genre", filters.genre);
    if (filters?.year) params.set("year", filters.year);
    if (filters?.rating) params.set("rating", filters.rating);

    const queryString = params.toString();
    navigate(queryString ? `/?${queryString}` : "/");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar-container sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0F1322]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Header Row */}
        <div className="h-16 sm:h-[70px] flex items-center justify-between gap-4 md:gap-6">
          {/* Brand Logo - Left */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to={isAuthenticated ? "/" : "/login"}
              onClick={() => {
                setSearchValue("");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 group cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <span className="brand-logo-text text-xl sm:text-2xl font-black tracking-wider uppercase inline-flex items-center leading-none">
                MOVIEMAX
              </span>
            </Link>
          </div>

          {/* Search Bar - Center (Desktop) */}
          {showSearchBar && (
            <div className="hidden md:flex flex-1 items-center justify-center max-w-md lg:max-w-xl mx-4">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSearch={handleSearch}
              />
            </div>
          )}

          {/* Action Controls - Right */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Watchlist Link */}
            {isAuthenticated && (
              <Link
                to="/watchlist"
                className={`hidden md:inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 h-10 rounded-xl font-semibold text-sm border transition-all ${
                  isWatchlistPage
                    ? "bg-[#FF3D68] border-[#FF3D68] text-white shadow-sm"
                    : "bg-white dark:bg-[#121625] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#FF3D68] hover:border-[#FF3D68] hover:text-white"
                }`}
              >
                <Check size={17} className="flex-shrink-0" />
                <span className="leading-none">Watchlist</span>

                {watchlistCount > 0 && (
                  <span
                    className={`nav-watchlist-badge ${
                      isWatchlistPage
                        ? "bg-white text-[#FF3D68]"
                        : "bg-[#FF3D68] text-white"
                    }`}
                  >
                    {watchlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Switcher */}
            <div className="flex items-center justify-center">
              <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 px-3 h-10 rounded-xl bg-slate-100 dark:bg-[#121625] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="user-avatar-gradient w-6.5 h-6.5 rounded-lg text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate leading-none">{user.name}</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="nav-dropdown-animate absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
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
                className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md hover:brightness-110 cursor-pointer"
              >
                <UserIcon size={18} />
                <span className="leading-none">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center" ref={mobileMenuRef}>
              <button
                type="button"
                aria-label="Toggle navigation menu"
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121625] text-slate-700 dark:text-slate-200 hover:bg-[#FF3D68] hover:border-[#FF3D68] hover:text-white transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Mobile Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="nav-dropdown-animate absolute right-4 top-[calc(100%+8px)] w-72 max-w-[calc(100vw-32px)] z-50 flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-2xl">
                  {isAuthenticated && user ? (
                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121625] flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="user-avatar-gradient w-8 h-8 rounded-lg text-xs flex items-center justify-center font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOutIcon size={18} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md cursor-pointer"
                    >
                      <UserIcon size={18} />
                      <span>Sign In / Register</span>
                    </Link>
                  )}

                  {isAuthenticated && (
                    <Link
                      to="/watchlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border font-semibold text-sm transition-colors ${
                        isWatchlistPage
                          ? "bg-[#FF3D68] border-[#FF3D68] text-white"
                          : "bg-slate-50 dark:bg-[#121625] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Check size={18} />
                        <span>Watchlist</span>
                      </div>
                      {watchlistCount > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            isWatchlistPage
                              ? "bg-white text-[#FF3D68]"
                              : "bg-[#FF3D68] text-white"
                          }`}
                        >
                          {watchlistCount}
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
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Only shown below header row on mobile */}
        {showSearchBar && (
          <div className="md:hidden pb-3 pt-0.5">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

