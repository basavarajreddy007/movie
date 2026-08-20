import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "./icons";
import { getMovies } from "../service/movieapi";
import type { Movie } from "../types/movies";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
};

export function SearchBar({ value, onChange, onSearch, loading = false }: Props) {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch quick suggestions as user types
  useEffect(() => {
    const query = value.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const movies = await getMovies(query);
        setSuggestions(movies.slice(0, 5));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (movie: Movie) => {
    setShowSuggestions(false);
    navigate(`/movie/${movie.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch();
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search
            size={16}
            className="absolute left-3.5 text-slate-400 pointer-events-none"
          />
          <input
            className="w-full h-10 sm:h-11 pl-10 pr-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F1322] text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#FF3D68] focus:ring-2 focus:ring-[#FF3D68]/20 transition-all"
            type="text"
            placeholder="Search movies..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            disabled={loading}
          />
          {value.trim() && (
            <button
              type="button"
              className="absolute right-2.5 flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 hover:bg-[#FF3D68] hover:text-white transition-colors cursor-pointer"
              onClick={() => {
                onChange("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              title="Clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 h-10 sm:h-11 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-2xl p-2">
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {suggestions.map((movie) => (
              <li
                key={movie.id}
                onClick={() => handleSelect(movie)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-[#0F1322] cursor-pointer text-slate-800 dark:text-slate-200 hover:text-[#FF3D68]"
              >
                <Search size={14} className="text-slate-400" />
                <span className="truncate">{movie.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;