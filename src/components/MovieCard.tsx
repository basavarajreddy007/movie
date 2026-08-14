import { Link } from "react-router-dom";
import type { Movie } from "../types/movies";
import "../styles/MovieCard.css";

type Props = {
  movie: Movie;
};

export function MovieCard({ movie }: Props) {
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
    <Link to={`/movie/${movie.id}`} className="movie-link">
      <article className="movie-card">
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

          <div className="play-button-container">
            <div className="play-button">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div className="rating-badge">
            <div className="rating-circle">
              <svg
                className="rating-star-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>

              <span className="rating-text">{rating}</span>
            </div>
          </div>
        </div>

        <div className="movie-card-details">
          <h3 className="movie-title">{movie.title}</h3>

          <span className="movie-release-year">
            {releaseYear}
          </span>

          {movie.overview && (
            <p className="movie-overview">
              {movie.overview}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}