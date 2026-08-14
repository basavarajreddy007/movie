import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Movie } from "../types/movies";
import { getMovieById } from "../service/movieapi";

import "../styles/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return (
      <main className="movie-page">
        <p className="loading">Loading...</p>
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
        </div>

        <div className="movie-info">

          <span className="movie-label">
            MOVIE DETAILS
          </span>

          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span className="rating">
              {rating} / 10
            </span>

            <span className="release-date">
              {movie.release_date || "Release date unavailable"}
            </span>
          </div>

          <div className="divider" />

          <h2>Overview</h2>

          <p className="overview">
            {movie.overview || "No overview available for this movie."}
          </p>

          <div className="movie-actions">
            <button className="watch-button" type="button">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>

              <span>Watch Now</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default MovieDetails;