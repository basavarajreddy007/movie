import {
  useState,
  useRef,
  useEffect,
} from "react";

import type { Movie } from "./types/movies";
import { getMovies } from "./service/movieapi";
import { MovieCard } from "./components/MovieCard";
import { SearchBar } from "./components/SearchBar";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState("");
  const [loading, setLoading] = useState(false);

  const moviesRef = useRef<HTMLElement>(null);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);

    try {
      const data = await getMovies(query);

      setMovies(data.slice(0, 30));

      moviesRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPopularMovies = async () => {
      setLoading(true);

      try {
        const data = await getMovies();

        setMovies(data.slice(0, 10));
      } catch (error) {
        console.log(error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  useEffect(() => {
    if (!movieName.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      searchMovies(movieName);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [movieName]);

  return (
    <div className="home">
      <SearchBar
        value={movieName}
        onChange={setMovieName}
        onSearch={() => searchMovies(movieName)}
        loading={loading}
      />

      <main
        ref={moviesRef}
        className="movies-section"
      >
        <h2>Now Showing</h2>

        {loading && <p className="loading-text">Loading...</p>}

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