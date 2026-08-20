import { useEffect, useState } from "react";
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
  const query = searchParams.get("q")?.trim() ?? "";

  // Fetch movies whenever the search query in URL changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMovies(query);
        setMovies(data);
      } catch {
        setError("Failed to load movies. Please check your connection.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080B15] text-slate-900 dark:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#FF3D68] to-[#FFA06B]" />
            <span>{query ? `Search results for "${query}"` : "Now Showing"}</span>
          </h2>
        </div>

        {loading && <Loader title="Discovering Movies..." size="lg" />}

        {error && (
          <div className="flex items-center justify-center gap-3 py-6 px-4 mb-8 text-red-500 font-medium text-base bg-red-500/10 rounded-2xl border border-red-500/20 max-w-xl mx-auto">
            <AlertCircle size={22} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500 dark:text-slate-400">
            <SearchX size={40} className="text-[#FF3D68] opacity-60" />
            <p className="text-base font-medium">
              {query ? `No movies found for "${query}".` : "No movies found."}
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;