import "../styles/SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  loading,
}: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() && !loading) {
      onSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a movie..."
          className="search-input"
          disabled={loading}
          aria-label="Search movies"
        />

        <button
          type="button"
          onClick={onSearch}
          disabled={loading || !value.trim()}
          className="search-button"
          aria-label="Search button"
        >
          {loading ? (
            <span className="button-loading">Searching...</span>
          ) : (
            <span className="button-text">Search</span>
          )}
        </button>
      </div>
    </div>
  );
};