import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Play, Star } from "./icons";
import type { Movie } from "../types/movies";
import { isBookmarked, toggleBookmark } from "../utils/bookmarks";
import "../styles/MovieCard.css";

type Props = {
  movie: Movie;
  onBookmarkToggle?: () => void;
};

export function MovieCard({ movie, onBookmarkToggle }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(movie.id));
  }, [movie.id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleBookmark(movie);
    setBookmarked(newState);
    if (onBookmarkToggle) {
      onBookmarkToggle();
    }
  };

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "N/A";

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-link"
    >
      <article className="card movie-card">
        <div className="content">
          <div className="movie-image-container">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="movie-image"
                loading="lazy"
              />
            ) : (
              <div className="movie-image-placeholder">
                <span>{movie.title}</span>
              </div>
            )}

            <div className="movie-overlay" />

            <button
              type="button"
              className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
              onClick={handleBookmarkClick}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark movie"}
              title={bookmarked ? "Remove bookmark" : "Bookmark movie"}
            >
              <Bookmark
                size={18}
                fill={bookmarked ? "currentColor" : "none"}
                stroke="currentColor"
              />
            </button>

            <div className="play-button-container">
              <div className="play-button">
                <Play size={22} fill="currentColor" />
              </div>
            </div>

            <div className="rating-badge">
              <div className="rating-circle">
                <Star size={13} fill="currentColor" className="rating-star-icon" />
                <span className="rating-text">
                  {rating}
                </span>
              </div>
            </div>
          </div>

          <div className="movie-card-details">
            <h3 className="movie-title">
              {movie.title}
            </h3>

            <span className="movie-release-year">
              {releaseYear}
            </span>

            {movie.overview && (
              <p className="movie-overview">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}