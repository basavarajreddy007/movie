import {
  useState,
  useRef,
  useEffect,
} from "react";
import {  Loader2, AlertCircle, SearchX } from "./components/icons";
import type { Movie } from "./types/movies";
import { getMovies } from "./service/movieapi";
import { MovieCard } from "./components/MovieCard";

type Props = {
  searchCallbackRef?: React.MutableRefObject<((query: string) => void) | null>;
};

function Home({ searchCallbackRef }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moviesRef = useRef<HTMLElement>(null);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMovies(query);
      setMovies(data.slice(0, 50));

      moviesRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load movies.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchCallbackRef) {
      searchCallbackRef.current = searchMovies;
    }
  }, [searchCallbackRef]);

  useEffect(() => {
    const loadPopularMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMovies();
        setMovies(data.slice(0, 15));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movies.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  return (
    <div className="home">
      <main
        ref={moviesRef}
        className="movies-section"
      >
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
         
          <span>Now Showing</span>
        </h2>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2rem 0" }}>
            <Loader2 className="animate-spin" size={20} />
            <p className="loading-text" style={{ margin: 0 }}>Loading movies...</p>
          </div>
        )}

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ef4444", padding: "1rem 0" }}>
            <AlertCircle size={20} />
            <p className="error-text" style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2rem 0", color: "var(--text-muted)" }}>
            <SearchX size={20} />
            <p className="no-results" style={{ margin: 0 }}>No movies found.</p>
          </div>
        )}

        <div className="movie-cards-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;