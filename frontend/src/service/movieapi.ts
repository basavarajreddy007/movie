import type { Movie } from "../types/movies";

const BASE_URL = "https://api.tmdb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
}

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  "Content-Type": "application/json",
};

export const getMovies = async (
  query = "",
  page = 1
): Promise<MoviesResponse> => {
  const url = query.trim()
    ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query.trim())}&page=${page}`
    : `${BASE_URL}/movie/popular?page=${page}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  return {
    movies: data.results || [],
    totalPages: data.total_pages || 1,
  };
};

export const getMovieById = async (id: string | number): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/movie/${id}`, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return await response.json();
};