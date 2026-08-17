import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, SearchX } from "./components/icons";
import type { Movie } from "./types/movies";
import { getMovies } from "./service/movieapi";
import { MovieCard } from "./components/MovieCard";
import { Loader } from "./components/Loader";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  const moviesRef = useRef<HTMLElement>(null);

  const query = searchParams.get("q")?.trim() ?? "";

  const fetchMovies = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMovies(searchQuery);

      setMovies(
        data.slice(0, searchQuery ? 50 : 20)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load movies."
      );

      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(query || undefined);

    if (query) {
      requestAnimationFrame(() => {
        moviesRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [query, fetchMovies]);

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080B15] text-slate-900 dark:text-white transition-colors duration-200">
      <main
        ref={moviesRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#FF3D68] to-[#FFA06B]" />

            <span>
              {query
                ? `Search results for "${query}"`
                : "Now Showing"}
            </span>
          </h2>
        </div>

        {loading && (
          <Loader
            title="Discovering Movies"
            badge="NOW SHOWING"
            dynamicMessages={[
              "Dimming the cinema lights...",
              "Rolling the 35mm film reels...",
              "Curating top-rated blockbusters...",
              "Fetching latest cinema releases...",
              "Grabbing the popcorn & drinks...",
            ]}
            size="lg"
          />
        )}

        {error && (
          <div className="flex items-center justify-center gap-3 py-6 px-4 mb-8 text-red-500 font-medium text-base bg-red-500/10 rounded-2xl border border-red-500/20 max-w-xl mx-auto">
            <AlertCircle size={22} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500 dark:text-slate-400">
            <SearchX
              size={40}
              className="text-[#FF3D68] opacity-60"
            />

            <p className="text-base font-medium">
              {query
                ? `No movies found for "${query}".`
                : "No movies found."}
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;