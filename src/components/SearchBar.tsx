import { useEffect } from "react";
import { Search, Loader2 } from "./icons";
import "../styles/SearchBar.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSearch,
  loading,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        onSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search movies..."
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          disabled={loading}
        />

        <button
          className="search-button"
          onClick={onSearch}
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
    </div>
  );
}