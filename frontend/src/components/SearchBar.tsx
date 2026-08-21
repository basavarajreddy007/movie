import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal, Star } from "./icons";
import { getMovies } from "../service/movieapi";
import type { Movie } from "../types/movies";

export type SearchFilters = {
  genre?: string;
  year?: string;
  rating?: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (filters?: SearchFilters) => void;
  loading?: boolean;
};

const GENRES = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const YEARS = [
  "2026", "2025", "2024", "2023", "2022", "2021",
  "2020", "2019", "2018", "2015", "2010", "2000",
];

const RATINGS = [
  { value: "8.5", label: "8.5+ Top Rated" },
  { value: "8", label: "8.0+ Exceptional" },
  { value: "7", label: "7.0+ Good" },
  { value: "6", label: "6.0+ Above Average" },
  { value: "5", label: "5.0+ Mixed" },
];

const SELECT_CLASSES =
  "w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F1322] text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-[#FF3D68] transition-colors";

export function SearchBar({ value, onChange, onSearch, loading = false }: Props) {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
  });

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync filters with URL search params
  useEffect(() => {
    setFilters({
      genre: searchParams.get("genre") || "",
      year: searchParams.get("year") || "",
      rating: searchParams.get("rating") || "",
    });
  }, [searchParams]);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClosePopups = (e: MouseEvent | KeyboardEvent) => {
      const isOutsideClick =
        e instanceof MouseEvent &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node);
      const isEscapeKey = e instanceof KeyboardEvent && e.key === "Escape";

      if (isOutsideClick || isEscapeKey) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClosePopups);
    document.addEventListener("keydown", handleClosePopups);
    return () => {
      document.removeEventListener("mousedown", handleClosePopups);
      document.removeEventListener("keydown", handleClosePopups);
    };
  }, []);

  // Fetch search suggestions as user types (debounced 300ms)
  useEffect(() => {
    const query = value.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { movies } = await getMovies(query);
        setSuggestions(movies.slice(0, 5));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const applySearch = (activeFilters: SearchFilters = filters) => {
    setShowFilters(false);
    setShowSuggestions(false);
    onSearch({
      genre: activeFilters.genre || undefined,
      year: activeFilters.year || undefined,
      rating: activeFilters.rating || undefined,
    });
  };

  const handleSelectSuggestion = (movie: Movie) => {
    setShowSuggestions(false);
    setShowFilters(false);
    navigate(`/movie/${movie.id}`);
  };

  const handleResetFilters = () => {
    const emptyFilters = { genre: "", year: "", rating: "" };
    setFilters(emptyFilters);
    applySearch(emptyFilters);
  };

  const handleClearInput = () => {
    onChange("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="w-full relative" ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applySearch();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1 flex items-center">
          <Search
            size={16}
            className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
          />

          <input
            ref={inputRef}
            className="w-full h-10 pl-10 pr-20 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F1322] text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#FF3D68] focus:ring-2 focus:ring-[#FF3D68]/20 transition-all leading-normal"
            type="text"
            placeholder="Search movies by title..."
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            disabled={loading}
          />

          <div className="absolute right-2.5 flex items-center gap-1.5 z-10">
            {value.trim() && (
              <button
                type="button"
                className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 hover:bg-[#FF3D68] hover:text-white transition-colors cursor-pointer"
                onClick={handleClearInput}
                title="Clear input"
              >
                <X size={12} />
              </button>
            )}

            <button
              type="button"
              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors cursor-pointer relative ${
                showFilters || hasActiveFilters
                  ? "bg-[#FF3D68]/15 text-[#FF3D68] dark:bg-[#FF3D68]/25"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10"
              }`}
              onClick={() => {
                setShowFilters(!showFilters);
                setShowSuggestions(false);
              }}
              title={hasActiveFilters ? `${activeFiltersCount} active filter(s)` : "Filter movies"}
            >
              <SlidersHorizontal size={14} />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3D68] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF3D68] text-[9px] font-bold text-white items-center justify-center">
                    {activeFiltersCount}
                  </span>
                </span>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || (!value.trim() && !hasActiveFilters)}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer leading-none"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Filter Popover */}
      {showFilters && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 p-4 rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#FF3D68]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Filter Movies
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#FF3D68] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Genre
              </label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value }))}
                className={SELECT_CLASSES}
              >
                <option value="">All Genres</option>
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Release Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
                className={SELECT_CLASSES}
              >
                <option value="">Any Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}
                className={SELECT_CLASSES}
              >
                <option value="">Any Rating</option>
                {RATINGS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => applySearch()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow hover:brightness-110 transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-2xl p-2 max-h-96 overflow-y-auto">
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {suggestions.map((movie) => {
              const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";

              return (
                <li
                  key={movie.id}
                  onClick={() => handleSelectSuggestion(movie)}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F1322] cursor-pointer text-slate-800 dark:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Search size={14} className="text-slate-400 group-hover:text-[#FF3D68] flex-shrink-0 transition-colors" />
                    <p className="font-semibold text-sm truncate text-slate-900 dark:text-white group-hover:text-[#FF3D68] transition-colors">
                      {movie.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {releaseYear && <span>{releaseYear}</span>}
                    {typeof movie.vote_average === "number" && movie.vote_average > 0 && (
                      <span className="flex items-center gap-1 font-medium text-amber-500">
                        <Star size={11} fill="currentColor" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;

