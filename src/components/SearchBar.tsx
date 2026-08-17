import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X, SearchX } from "./icons";
import { getMovies } from "../service/movieapi";
import type { Movie } from "../types/movies";
import "../styles/SearchBar.css";

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

    const debounceTimer = setTimeout(async () => {
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
    }, 280);

    return () => {
      isCurrent = false;
      clearTimeout(debounceTimer);
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

  const handleSelectMovie = (movie: Movie) => {
    setIsOpen(false);
    onChange("");
    navigate(`/movie/${movie.id}`);
  };

  const handleFullSearch = () => {
    setIsOpen(false);
    onSearch();
  };

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
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true);
        return;
      }
      const maxIndex = suggestions.length > 0 ? suggestions.length : -1;
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true);
        return;
      }
      const maxIndex = suggestions.length > 0 ? suggestions.length : -1;
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
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-wrapper">
        <div className="search-input-wrapper">
          <Search size={16} className="search-input-icon" />
          <input
            ref={inputRef}
            className="search-input"
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
            autoComplete="off"
          />

          {value.trim().length > 0 && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search text"
              title="Clear text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="search-button"
          onClick={handleFullSearch}
          disabled={loading || !value.trim()}
          aria-label="Search"
          title="Search"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Search size={16} />
          )}
          <span>{loading ? "Searching..." : "Search"}</span>
        </button>
      </div>

      {isOpen && value.trim().length > 0 && (
        <div className="search-suggestions-dropdown">
          {loadingSuggestions ? (
            <div className="suggestions-loading">
              <Loader2 className="animate-spin" size={18} />
              <span>Finding movies...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="suggestions-header">
                <span className="suggestions-header-title">Movie Suggestions</span>
                <span className="suggestions-header-count">{suggestions.length} found</span>
              </div>

              <ul className="suggestions-list" role="listbox">
                {suggestions.map((movie, index) => {
                  const isSelected = index === selectedIndex;

                  return (
                    <li
                      key={movie.id}
                      className={`suggestion-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectMovie(movie)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <Search size={15} className="suggestion-item-icon" />
                      <span className="suggestion-title">{movie.title}</span>
                    </li>
                  );
                })}
              </ul>

              <div
                className={`suggestions-footer ${selectedIndex === suggestions.length ? "selected" : ""}`}
                onClick={handleFullSearch}
                onMouseEnter={() => setSelectedIndex(suggestions.length)}
              >
                <Search size={14} />
                <span>View all results for &quot;<strong>{value.trim()}</strong>&quot;</span>
              </div>
            </>
          ) : (
            <div className="suggestions-empty">
              <SearchX size={20} />
              <span>No movies found for &quot;{value.trim()}&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}