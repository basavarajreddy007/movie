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
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}