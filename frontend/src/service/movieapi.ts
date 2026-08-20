import type { Movie } from "../types/movies";

const BASE_URL = "https://api.tmdb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
}

const headers: HeadersInit = {
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

export const getMovieTrailers = async (
  movieId: string | number
): Promise<string | null> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movie trailer");
  }

  const data = await response.json();
  const results = data.results || [];

  const trailer =
    results.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    ) ||
    results.find(
      (video: any) => video.type === "Teaser" && video.site === "YouTube"
    ) ||
    results.find(
      (video: any) =>
        video.site === "YouTube" &&
        (video.type === "Clip" || video.type === "Featurette")
    ) ||
    results.find((video: any) => video.site === "YouTube");

  return trailer ? trailer.key : null;
};