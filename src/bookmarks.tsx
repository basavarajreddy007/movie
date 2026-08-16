import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Film } from "./components/icons";
import type { Movie } from "./types/movies";
import { getBookmarks } from "./utils/bookmarks";
import { MovieCard } from "./components/MovieCard";

function Bookmarks() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const refreshBookmarks = () => {
    setMovies(getBookmarks());
  };

  useEffect(() => {
    refreshBookmarks();

    const handleUpdate = () => {
      refreshBookmarks();
    };

    window.addEventListener("bookmarksUpdated", handleUpdate);
    return () => {
      window.removeEventListener("bookmarksUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="home">
      <main className="movies-section">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Bookmark size={22} />
          <span>My Bookmarks ({movies.length})</span>
        </h2>

        {movies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <Bookmark size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
              No bookmarked movies yet.
            </p>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                background: "var(--primary-color)",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <Film size={18} />
              <span>Browse Movies</span>
            </Link>
          </div>
        ) : (
          <div className="movie-cards-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBookmarkToggle={refreshBookmarks}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Bookmarks;
