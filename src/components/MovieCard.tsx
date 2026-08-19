import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Play, Star } from "./icons";
import type { Movie } from "../types/movies";
import { useAuth } from "../context/AuthContext";

type Props = {
  movie: Movie;
  onBookmarkToggle?: () => void;
};

export function MovieCard({ movie, onBookmarkToggle }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated, isBookmarked, toggleBookmark } = useAuth();
  const [imageError, setImageError] = useState(false);

  const bookmarked = isBookmarked(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const posterUrl =
    movie.poster_path && !imageError
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : null;

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await toggleBookmark(movie);
    onBookmarkToggle?.();
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block h-full select-none"
      title={movie.title || "Movie details"}
    >
      <article className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-pink-950/20 hover:border-[#FF3D68]/40 transition-all duration-300 transform group-hover:-translate-y-1.5">
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-100 dark:bg-[#0F1322]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || "Movie poster"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-[#0F1322] text-[#FF3D68] text-xs sm:text-sm font-semibold text-center select-none">
              <span className="line-clamp-3 px-2">{movie.title || "No Image Available"}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/90 via-[#0B1020]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Bookmark Button */}
          <button
            type="button"
            className={`absolute top-2.5 left-2.5 z-20 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              bookmarked
                ? "bg-[#FF3D68] border-[#FF3D68] text-white shadow-md shadow-[#FF3D68]/30"
                : "border-white/20 bg-[#12182A]/80 text-white hover:bg-[#FF3D68] hover:border-[#FF3D68]"
            }`}
            onClick={handleBookmarkClick}
            aria-label={
              bookmarked
                ? `Remove ${movie.title || "movie"} from bookmarks`
                : `Bookmark ${movie.title || "movie"}`
            }
            title={
              bookmarked
                ? "Remove from bookmarks"
                : "Bookmark movie"
            }
          >
            <Bookmark
              size={16}
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
            />
          </button>

          {/* Play Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 scale-90 group-hover:scale-100 pointer-events-none">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#FF3D68] bg-[#12182A]/90 text-[#FF3D68] shadow-lg shadow-[#FF3D68]/30">
              <Play size={20} fill="currentColor" />
            </div>
          </div>

          {/* Rating */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/10 bg-[#12182A]/85 backdrop-blur-md text-white text-xs font-bold shadow-sm pointer-events-none">
            <Star
              size={12}
              fill="currentColor"
              className="text-[#FF3D68]"
            />
            <span>{rating}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 justify-between bg-white dark:bg-[#121625]">
          <div className="flex flex-col gap-1.5">
            <h3 
              className="font-bold text-sm sm:text-base line-clamp-1 sm:line-clamp-2 text-slate-900 dark:text-white group-hover:text-[#FF3D68] transition-colors duration-200 leading-snug"
              title={movie.title}
            >
              {movie.title || "Untitled"}
            </h3>

            <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FF3D68]/10 border border-[#FF3D68]/20 text-[#FF3D68]">
              {releaseYear}
            </span>
          </div>

          {movie.overview && (
            <p className="hidden sm:line-clamp-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              {movie.overview}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default MovieCard;