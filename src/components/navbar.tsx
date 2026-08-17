import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, Menu, X } from "./icons";
import { SearchBar } from "./SearchBar";
import { ThemeSwitch } from "./ThemeSwitch";
import { getBookmarks } from "../utils/bookmarks";

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

  const isMovieDetailPage = location.pathname.startsWith("/movie");
  const isBookmarksPage = location.pathname === "/bookmarks";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") ?? "";
    setSearchValue(query);
  }, [location.search]);

  useEffect(() => {
    const updateCount = () => {
      setBookmarkCount(getBookmarks().length);
    };

    updateCount();

    window.addEventListener("bookmarksUpdated", updateCount);

    return () => {
      window.removeEventListener("bookmarksUpdated", updateCount);
    };
  }, []);

  const handleSearch = () => {
    const query = searchValue.trim();

    if (!query) return;

    navigate(`/?q=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setSearchValue("");
    setIsMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
    } else {
      navigate("/");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0F1322]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-0 min-h-[64px] sm:min-h-[72px] flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-6 relative">
        
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 flex-shrink-0 group cursor-pointer transition-transform duration-200 hover:scale-105"
          title="MOVIEMAX Home"
        >
          <span
            className="text-xl sm:text-2xl font-black tracking-wider uppercase inline-flex items-center drop-shadow-sm bg-gradient-to-r from-[#FF3D68] via-[#FF6584] to-[#FFA06B] bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300"
            aria-label="MOVIEMAX"
          >
            MOVIEMAX
          </span>
        </Link>

        {!isMovieDetailPage && (
          <div className="order-3 md:order-2 w-full md:w-auto flex-1 max-w-full md:max-w-md lg:max-w-lg mx-auto">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
            />
          </div>
        )}

        <div className="order-2 md:order-3 hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/bookmarks"
            className={`group inline-flex items-center gap-2 px-4 h-10 sm:h-11 rounded-xl font-semibold text-sm border transition-all duration-200 ${
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
                className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold transition-colors ${
                  isBookmarksPage
                    ? "bg-white text-[#FF3D68]"
                    : "bg-[#FF3D68] text-white group-hover:bg-white group-hover:text-[#FF3D68]"
                }`}
              >
                {bookmarkCount}
              </span>
            )}
          </Link>

          <ThemeSwitch
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>

        <button
          type="button"
          className="order-2 md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121625] text-slate-700 dark:text-slate-200 hover:bg-[#FF3D68] hover:border-[#FF3D68] hover:text-white transition-colors"
          onClick={() =>
            setIsMobileMenuOpen((prev) => !prev)
          }
          aria-label={
            isMobileMenuOpen ? "Close menu" : "Open menu"
          }
        >
          {isMobileMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute right-4 top-full mt-2 w-64 max-w-[calc(100vw-32px)] z-50 flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-2xl">
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

          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121625]">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Theme
            </span>

            <ThemeSwitch
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </div>
        </div>
      )}
    </nav>
  );
}