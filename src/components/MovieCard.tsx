import { Link } from "react-router-dom";
import type { Movie } from "../types/movies";
import "../styles/MovieCard.css";

type Props = {
  movie: Movie;
};

export function MovieCard({ movie }: Props) {
  const rating = movie.vote_average || 0;
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';
  const ratingPercentage = Math.round((rating / 10) * 100);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-link"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="movie-card">
        <div className="movie-image-container">
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title}
            className="movie-image"
          />
          
        
          <div className="movie-overlay"></div>

         
          <div className="play-button-container">
            <button className="play-button" aria-label="Play">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

         
          <div className="rating-badge">
            <div className="rating-circle">
              <svg className="rating-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="rating-bg" />
                <circle cx="50" cy="50" r="45" className="rating-progress" 
                  style={{
                    strokeDasharray: `${ratingPercentage * 2.827} 282.7`,
                  }} 
                />
              </svg>
              <span className="rating-text">{ratingPercentage}%</span>
            </div>
          </div>
        </div>

        
        <div className="movie-details">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-release-year">{releaseYear}</p>
          {movie.overview && (
            <p className="movie-overview"></p>
          )}
        </div>
      </div>
    </Link>
  );
}