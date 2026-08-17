import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Star, Calendar, AlertCircle, Loader2, Bookmark } from "./icons";
import type { Movie } from "../types/movies";
import { getMovieById } from "../service/movieapi";
import { isBookmarked, toggleBookmark } from "../utils/bookmarks";
import "../styles/movieDetails.css";

function MovieDetails() {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getMovieById(id);
        setMovie(data);
        setBookmarked(isBookmarked(data.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const updateBookmarkState = () => {
      if (movie) {
        setBookmarked(isBookmarked(movie.id));
      }
    };

    window.addEventListener("bookmarksUpdated", updateBookmarkState);
    return () => {
      window.removeEventListener("bookmarksUpdated", updateBookmarkState);
    };
  }, [movie]);

  const handleBookmarkToggle = () => {
    if (!movie) return;
    const newState = toggleBookmark(movie);
    setBookmarked(newState);
  };

  if (loading) {
    return (
      <main className="movie-page">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", padding: "4rem 1rem" }}>
          <Loader2 className="animate-spin" size={24} />
          <p className="loading" style={{ margin: 0 }}>Loading details...</p>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="movie-page">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", padding: "4rem 1rem", color: "#ef4444" }}>
          <AlertCircle size={24} />
          <p className="error-text" style={{ margin: 0 }}>{error || "Movie not found."}</p>
        </div>
      </main>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "N/A";

  return (
    <main className="movie-page">
      <div className="movie-details">

        <div className="poster-wrapper">
          <img
            className="movie-poster"
            src={posterUrl}
            alt={movie.title || "Movie poster"}
          />
          <button
            type="button"
            className={`poster-bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmarkToggle}
            aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <Bookmark
              size={18}
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
            />
          </button>
        </div>

        <div className="movie-info">

          <span className="movie-label">
            MOVIE DETAILS
          </span>

          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span className="rating" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Star size={16} fill="currentColor" />
              {rating} / 10
            </span>

            <span className="release-date" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={15} />
              {movie.release_date || "Release date unavailable"}
            </span>
          </div>

          <div className="divider" />

          <h2>Overview</h2>

          <p className="overview">
            {movie.overview || "No overview available for this movie."}
          </p>

          <div className="movie-actions">
            <button className="watch-button" type="button" aria-label="Watch Now" title="Watch Now">
              <Play size={18} fill="currentColor" />
              <span>Watch Now</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default MovieDetails;