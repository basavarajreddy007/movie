import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Star, Calendar, AlertCircle, Bookmark } from "./icons";
import type { Movie } from "../types/movies";
import { getMovieById } from "../service/movieapi";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./Loader";
import "../styles/movieDetails.css";

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isBookmarked, toggleBookmark } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadMovie = async () => {
      setLoading(true);

      try {
        const movieData = await getMovieById(id);

        if (!cancelled) {
          setMovie(movieData);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load movie"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBookmarkToggle = async () => {
    if (!movie) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await toggleBookmark(movie);
  };

  if (loading) {
    return (
      <main className="w-full min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16 bg-[#f4f6fa] dark:bg-[#080B15] transition-colors duration-200">
        <Loader title="Loading Movie Details..." size="lg" />
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="w-full min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16 bg-[#f4f6fa] dark:bg-[#080B15] transition-colors duration-200">
        <div className="flex items-center gap-2.5 text-red-500 font-medium text-base">
          <AlertCircle size={24} />
          <span>{error || "Movie not found."}</span>
        </div>
      </main>
    );
  }

  const bookmarked = isBookmarked(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const posterUrl =
    movie.poster_path && !imageError
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;

  return (
    <main className="w-full min-h-[calc(100vh-72px)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#f4f6fa] dark:bg-[#080B15] transition-colors duration-200">
      <div className="w-full max-w-5xl mx-auto">
        <div className="movie-details-layout mb-6">
          {/* Poster and Bookmark Button */}
          <div className="relative w-full max-w-[280px] md:max-w-none aspect-[2/3] mx-auto overflow-hidden rounded-2xl bg-slate-200 dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title || "Movie poster"}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-[#0F1322] text-[#FF3D68] font-bold text-center">
                <span className="line-clamp-4">{movie.title || "No Image Available"}</span>
              </div>
            )}

            <button
              type="button"
              className={`absolute top-3.5 right-3.5 z-10 flex items-center justify-center w-10 h-10 rounded-full border backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                bookmarked
                  ? "bg-[#FF3D68] border-[#FF3D68] text-white shadow-lg shadow-[#FF3D68]/40"
                  : "border-white/20 bg-black/60 text-white hover:bg-[#FF3D68] hover:border-[#FF3D68]"
              }`}
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

          {/* Movie Details Info */}
          <div className="w-full flex flex-col items-start">
            <span className="movie-badge-pill mb-3">
              MOVIE DETAILS
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FF3D68]/30 bg-[#FF3D68]/10 text-[#FF3D68] text-sm font-bold">
                <Star size={15} fill="currentColor" />
                {rating} / 10
              </span>

              {movie.release_date && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Calendar size={15} />
                  {movie.release_date}
                </span>
              )}
            </div>

            <div className="movie-divider-line" />

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              Overview
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {movie.overview || "No overview available for this movie."}
            </p>

            <div className="w-full flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-lg shadow-[#FF3D68]/30 hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Watch Now"
                title="Watch Now"
              >
                <Play size={18} fill="currentColor" />
                <span>Watch Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MovieDetails;