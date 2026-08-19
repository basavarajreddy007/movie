import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, SearchX } from "./icons";
import { getMovies } from "../service/movieapi";
import type { Movie } from "../types/movies";
import { Loader, UiverseSpinner } from "./Loader";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSearch,
  loading = false,
}: Props) {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = value.trim();

    if (!trimmed) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    let isCurrent = true;
    setLoadingSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        const results = await getMovies(trimmed);
        if (isCurrent) {
          setSuggestions(results.slice(0, 6));
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch {
        if (isCurrent) {
          setSuggestions([]);
        }
      } finally {
        if (isCurrent) {
          setLoadingSuggestions(false);
        }
      }
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectMovie = useCallback(
    (movie: Movie) => {
      setIsOpen(false);
      setSelectedIndex(-1);
      navigate(`/movie/${movie.id}`);
    },
    [navigate]
  );

  const handleFullSearch = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch();
  }, [onSearch]);

  const handleClear = () => {
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && (suggestions.length > 0 || value.trim())) {
        setIsOpen(true);
        return;
      }
      const maxIndex = suggestions.length;
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen && (suggestions.length > 0 || value.trim())) {
        setIsOpen(true);
        return;
      }
      const maxIndex = suggestions.length;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectMovie(suggestions[selectedIndex]);
      } else {
        handleFullSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("li");
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  const renderHighlightedTitle = (title: string, query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return title;
    const idx = title.toLowerCase().indexOf(q);
    if (idx === -1) return title;

    return (
      <>
        {title.slice(0, idx)}
        <span className="text-[#FF3D68] font-bold">
          {title.slice(idx, idx + q.length)}
        </span>
        {title.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="w-full flex items-center gap-2 relative">
        <div className="relative flex-1 flex items-center group">
          <Search
            size={16}
            className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-focus-within:text-[#FF3D68]"
          />
          <input
            ref={inputRef}
            className="w-full h-10 sm:h-11 pl-10 pr-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F1322] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none focus:border-[#FF3D68] focus:bg-white dark:focus:bg-[#0F1322] focus:ring-2 focus:ring-[#FF3D68]/20 transition-all duration-200"
            type="text"
            placeholder="Search movies..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0 || value.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Search movies"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            role="combobox"
            autoComplete="off"
          />

          {value.trim().length > 0 && (
            <button
              type="button"
              className="absolute right-2.5 flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-[#FF3D68] hover:text-white transition-colors cursor-pointer"
              onClick={handleClear}
              aria-label="Clear search text"
              title="Clear text"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 h-10 sm:h-11 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md shadow-[#FF3D68]/20 hover:brightness-110 hover:shadow-lg hover:shadow-[#FF3D68]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 transition-all duration-200 cursor-pointer"
          onClick={handleFullSearch}
          disabled={loading || !value.trim()}
          aria-label="Search"
          title="Search"
        >
          {loading ? (
            <UiverseSpinner size={16} strokeWidth={9} />
          ) : (
            <Search size={16} />
          )}
          <span className="hidden sm:inline">{loading ? "Searching..." : "Search"}</span>
        </button>
      </div>

      {isOpen && value.trim().length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-black/70 overflow-hidden animate-in fade-in duration-150 backdrop-blur-md">
          {loadingSuggestions && suggestions.length === 0 ? (
            <Loader
              size="sm"
              title="Searching Cinema Vault..."
              subtitle="Matching titles & keywords"
              showGlow={false}
              className="py-5"
            />
          ) : suggestions.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0F1322]/80 border-b border-slate-200 dark:border-white/10">
                <span>Suggestions</span>
                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                  Use &uarr;&darr; to navigate, &crarr; to select
                </span>
              </div>

              <ul
                ref={listRef}
                className="list-none m-0 p-1.5 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5"
                role="listbox"
              >
                {suggestions.map((movie, index) => {
                  const isSelected = index === selectedIndex;

                  return (
                    <li
                      key={movie.id}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-150 border-l-2 ${
                        isSelected
                          ? "bg-slate-100 dark:bg-[#0F1322] border-[#FF3D68]"
                          : "border-transparent hover:bg-slate-50 dark:hover:bg-[#0F1322]"
                      }`}
                      onClick={() => handleSelectMovie(movie)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <Search
                        size={14}
                        className={`flex-shrink-0 transition-colors ${
                          isSelected
                            ? "text-[#FF3D68]"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />

                      <span
                        className={`text-sm font-medium truncate flex-1 transition-colors ${
                          isSelected
                            ? "text-[#FF3D68] dark:text-[#FF3D68]"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {renderHighlightedTitle(movie.title, value)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#FF3D68] border-t border-slate-200 dark:border-white/10 cursor-pointer transition-colors ${
                  selectedIndex === suggestions.length
                    ? "bg-slate-100 dark:bg-[#0F1322]"
                    : "bg-white dark:bg-[#121625] hover:bg-slate-50 dark:hover:bg-[#0F1322]"
                }`}
                onClick={handleFullSearch}
                onMouseEnter={() => setSelectedIndex(suggestions.length)}
              >
                <div className="flex items-center gap-2 truncate">
                  <Search size={13} className="flex-shrink-0" />
                  <span className="truncate">
                    View all results for &quot;<strong className="text-slate-900 dark:text-white">{value.trim()}</strong>&quot;
                  </span>
                </div>
                <span className="hidden sm:inline text-[11px] font-normal text-slate-400 dark:text-slate-500 flex-shrink-0">
                  Press Enter &crarr;
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 py-6 px-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <SearchX size={18} className="text-[#FF3D68] opacity-70" />
              <span>No movies found for &quot;{value.trim()}&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}