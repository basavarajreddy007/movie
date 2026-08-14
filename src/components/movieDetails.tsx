import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../types/movies";
import { getMovieById } from "../service/movieapi";
import "../styles/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <main className="movie-page">
      <div className="movie-details">
        <div className="poster-wrapper">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />

          <div className="poster-overlay"></div>
        </div>

        <div className="movie-info">
          <span className="movie-label">MOVIE DETAILS</span>

          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span className="rating">
             {movie.vote_average.toFixed(1)} / 10
            </span>
<br />
            <span className="release-date">
              {movie.release_date}
            </span>
          </div>

          <div className="divider"></div>

          <h2>Overview</h2>

          <p className="overview">
            {movie.overview || "No overview available for this movie."}
          </p>

          <div className="movie-actions">
            <button className="watch-button">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>

              Watch Now
            </button>

           
          </div>
        </div>
      </div>
    </main>
  );
}

export default MovieDetails;