import type { Movie } from "../types/movies";

const TMDB_BASE_URL = "https://api.tmdb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN || "";

const getHeaders = () => ({
  Authorization: `Bearer ${TMDB_TOKEN}`,
  "Content-Type": "application/json",
});

// Fetch popular movies or search movies by query
export const getMovies = async (query = ""): Promise<Movie[]> => {
  const endpoint = query.trim()
    ? `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query.trim())}`
    : `${TMDB_BASE_URL}/movie/popular`;

  const response = await fetch(endpoint, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies.");
  }

  const data = await response.json();
  return data.results || [];
};

// Fetch single movie details by ID
export const getMovieById = async (id: string | number): Promise<Movie> => {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movie details.");
  }

  return await response.json();
};