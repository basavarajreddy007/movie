import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "./components/icons";
import type { Movie } from "./types/movies";
import { getMovies } from "./service/movieapi";
import { MovieCard } from "./components/MovieCard";
import MovieCardSkeleton from "./components/MovieCardSkeleton";
import "./styles/home.css";

const GENRE_MAP: Record<string, string> = {
  "28": "Action",
  "12": "Adventure",
  "16": "Animation",
  "35": "Comedy",
  "80": "Crime",
  "99": "Documentary",
  "18": "Drama",
  "10751": "Family",
  "14": "Fantasy",
  "36": "History",
  "27": "Horror",
  "10402": "Music",
  "9648": "Mystery",
  "10749": "Romance",
  "878": "Sci-Fi",
  "53": "Thriller",
  "10752": "War",
  "37": "Western",
};

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q")?.trim() ?? "";
  const genre = searchParams.get("genre") ?? "";
  const year = searchParams.get("year") ?? "";
  const rating = searchParams.get("rating") ?? "";

  const hasActiveFilters = Boolean(query || genre || year || rating);

  useEffect(() => {
    setPage(1);
  }, [query, genre, year, rating]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMovies(query, page, genre, year, rating);
      setMovies(data.movies);
      setTotalPages(Math.min(data.totalPages, 500)); // TMDB limits to 500 pages max
    } catch {
      setError("Failed to load movies. Please check your connection and try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [query, page, genre, year, rating]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearAll = () => {
    navigate("/");
  };

  const handleClearSearch = () => {
    navigate("/");
  };

  const handleRemoveParam = (key: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    const qs = nextParams.toString();
    navigate(qs ? `/?${qs}` : "/");
  };

  const getHeaderTitle = () => {
    if (query) return `Search: "${query}"`;
    if (genre && GENRE_MAP[genre]) return `${GENRE_MAP[genre]} Movies`;
    if (year) return `Movies from ${year}`;
    if (rating) return `Top Rated Movies (${rating}+ ★)`;
    return "Trending & Popular";
  };

  return (
    <div className="home-page-container min-h-screen bg-[#f4f6fa] dark:bg-[#080B15] text-slate-900 dark:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="home-section-title-accent" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>{getHeaderTitle()}</span>
                {!hasActiveFilters && (
                  <Sparkles size={18} className="text-[#FF3D68] hidden sm:inline" />
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {hasActiveFilters
                  ? "Showing filtered movie results"
                  : "Discover the latest movies and top-rated picks"}
              </p>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {query && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF3D68]/15 text-[#FF3D68] dark:bg-[#FF3D68]/25 border border-[#FF3D68]/30">
                      Query: "{query}"
                      <button
                        type="button"
                        onClick={() => handleRemoveParam("q")}
                        className="hover:text-red-700 cursor-pointer"
                        title="Remove keyword filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {genre && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                      Genre: {GENRE_MAP[genre] || genre}
                      <button
                        type="button"
                        onClick={() => handleRemoveParam("genre")}
                        className="hover:text-[#FF3D68] cursor-pointer"
                        title="Remove genre filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {year && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                      Year: {year}
                      <button
                        type="button"
                        onClick={() => handleRemoveParam("year")}
                        className="hover:text-[#FF3D68] cursor-pointer"
                        title="Remove year filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {rating && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                      Rating: {rating}+ ★
                      <button
                        type="button"
                        onClick={() => handleRemoveParam("rating")}
                        className="hover:text-[#FF3D68] cursor-pointer"
                        title="Remove rating filter"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-white/10 hover:bg-[#FF3D68] hover:text-white transition-colors cursor-pointer w-fit self-start sm:self-center"
            >
              <X size={14} />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="movies-grid-layout">
            {Array.from({ length: 12 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-lg text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Unable to load movies
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchMovies()}
              className="inline-flex items-center justify-center gap-2 px-6 h-10 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-400 flex items-center justify-center mb-4">
              <SearchX size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No movies found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {query
                ? `We couldn't find any movies matching "${query}". Try searching with another term.`
                : "No movies are currently available."}
            </p>
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 px-5 h-10 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                <span>Browse All Movies</span>
              </button>
            )}
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="movies-grid-layout">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && movies.length > 0 && totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="flex justify-center items-center mt-12 pt-8 border-t border-slate-200 dark:border-white/10"
          >
            <div className="inline-flex bg-white dark:bg-[#121625] rounded-full p-1 border border-slate-200 dark:border-white/10 shadow-sm">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full font-medium text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#FF3D68] dark:hover:text-[#FF3D68] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center px-4 font-medium text-sm text-slate-800 dark:text-slate-200 border-x border-slate-200 dark:border-white/10 mx-1">
                <span>Page <span className="font-bold text-[#FF3D68] mx-1">{page}</span> of {totalPages}</span>
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full font-medium text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#FF3D68] dark:hover:text-[#FF3D68] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}

export default Home;