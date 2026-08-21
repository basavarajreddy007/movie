import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Star, Calendar, AlertCircle, ChevronLeft, Loader2 } from "./icons";
import type { Movie } from "../types/movies";
import { getMovieById, getMovieTrailers } from "../service/movieapi";
import { Loader } from "./Loader";
import "../styles/movieDetails.css";

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  // Fetch movie details on page load
  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch {
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Called when user clicks "Watch Trailer"
  const handleWatchTrailer = async () => {
    if (!movie) return;

    // If trailer key already exists, simply scroll to trailer section
    if (trailerKey) {
      document.getElementById("trailer-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    try {
      setTrailerLoading(true);
      const key = await getMovieTrailers(movie.id);
      if (key) {
        setTrailerKey(key);
        setTimeout(() => {
          document.getElementById("trailer-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch {
      // Ignore or handle gracefully without extra error state
    } finally {
      setTrailerLoading(false);
    }
  };

  // Format runtime in hours & minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <main className="w-full min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16 bg-[#f4f6fa] dark:bg-[#080B15]">
        <Loader title="Loading Movie Details..." size="lg" />
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-4 py-16 bg-[#f4f6fa] dark:bg-[#080B15]">
        <div className="flex items-center gap-2.5 text-red-500 font-medium text-base mb-6">
          <AlertCircle size={24} />
          <span>{error || "Movie not found."}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#FF3D68] hover:bg-[#FF5E80] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          <span>Back to Home</span>
        </button>
      </main>
    );
  }

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const posterUrl =
    movie.poster_path && !imageError
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;
  const runtimeFormatted = formatRuntime(movie.runtime);

  const genreList: string[] = Array.isArray(movie.genres)
    ? movie.genres.map((g) => (typeof g === "string" ? g : g.name))
    : [];

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  return (
    <main className="relative w-full min-h-[calc(100vh-72px)] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 bg-[#f4f6fa] dark:bg-[#080B15] transition-colors duration-200">
      {/* Ambient backdrop hero banner */}
      {backdropUrl && (
        <div className="movie-backdrop-hero">
          <img src={backdropUrl} alt="" aria-hidden="true" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Back navigation button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#FF3D68] dark:hover:text-[#FF3D68] hover:bg-slate-200/60 dark:hover:bg-white/5 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        <div className="movie-details-layout mb-8">
          {/* Poster */}
          <div className="relative w-full max-w-[280px] md:max-w-none aspect-[2/3] mx-auto overflow-hidden rounded-2xl bg-slate-200 dark:bg-[#0F1322] border border-slate-200 dark:border-white/10 shadow-xl group">
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
          </div>

          {/* Movie Details Info */}
          <div className="w-full flex flex-col items-start">
            <span className="movie-badge-pill mb-3">
              MOVIE DETAILS
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base italic text-[#FF3D68] mb-4">
                "{movie.tagline}"
              </p>
            )}

            {/* Badges / Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FF3D68]/30 bg-[#FF3D68]/10 text-[#FF3D68] text-sm font-bold">
                <Star size={15} fill="currentColor" />
                {rating} / 10
                {movie.vote_count ? (
                  <span className="text-xs font-normal opacity-75">
                    ({movie.vote_count.toLocaleString()})
                  </span>
                ) : null}
              </span>

              {movie.release_date && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Calendar size={15} />
                  {movie.release_date}
                </span>
              )}

              {runtimeFormatted && (
                <span className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400">
                  • {runtimeFormatted}
                </span>
              )}

              {movie.status && (
                <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {genreList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genreList.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="movie-divider-line" />

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              Overview
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {movie.overview || "No overview available for this movie."}
            </p>

            {/* Actions: Watch Trailer Button */}
            <div className="w-full flex items-center pt-2">
              <button
                type="button"
                onClick={handleWatchTrailer}
                disabled={trailerLoading}
                className="watch-trailer-btn"
              >
                <span className="watch-trailer-btn-icon">
                  {trailerLoading ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    <Play size={13} fill="currentColor" className="ml-0.5" />
                  )}
                </span>
                <span>{trailerLoading ? "Loading Trailer..." : "Watch Trailer"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Embedded Trailer Section (Below Poster and Details) */}
        {trailerKey && (
          <section
            id="trailer-section"
            className="w-full mt-10 pt-8 border-t border-slate-200 dark:border-white/10 trailer-inline-section scroll-mt-6"
            aria-label={`${movie.title} Trailer`}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FF3D68]/15 border border-[#FF3D68]/30 text-[#FF3D68]">
                <Play size={16} fill="currentColor" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Official Trailer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {movie.title}
                </p>
              </div>
            </div>

            {/* Video Iframe Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black trailer-inline-card border border-slate-200 dark:border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MovieDetails;
