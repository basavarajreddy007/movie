import type { Movie } from "../types/movies";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
}

const getHeaders = (): HeadersInit => {
  if (!TMDB_TOKEN) {
    console.warn("VITE_TMDB_TOKEN is not defined. Please set it in your .env file.");
  }

  return {
    Authorization: `Bearer ${TMDB_TOKEN || ""}`,
    "Content-Type": "application/json",
  };
};

export const getMovies = async (
  query = "",
  page = 1,
  genre = "",
  year = "",
  rating = ""
): Promise<MoviesResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));

  if (query.trim()) {
    params.set("query", query.trim());
    if (year) {
      params.set("primary_release_year", year);
    }
  } else {
    params.set("sort_by", "popularity.desc");
    if (genre) {
      params.set("with_genres", genre);
    }
    if (year) {
      params.set("primary_release_year", year);
    }
    if (rating) {
      params.set("vote_average.gte", rating);
    }
  }

  const url = query.trim()
    ? `${BASE_URL}/search/movie?${params.toString()}`
    : `${BASE_URL}/discover/movie?${params.toString()}`;

  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  let movies: Movie[] = data.results || [];

  if (query.trim()) {
    if (genre) {
      movies = movies.filter((m: any) =>
        m.genre_ids?.includes(Number(genre)) ||
        (Array.isArray(m.genres) && m.genres.some((g: any) => (typeof g === "object" ? g.id === Number(genre) : false)))
      );
    }
    if (rating) {
      movies = movies.filter((m: any) => (m.vote_average ?? 0) >= Number(rating));
    }
  }

  return {
    movies,
    totalPages: data.total_pages || 1,
  };
};

export const getMovieById = async (id: string | number): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/movie/${id}`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return await response.json();
};

export const getMovieTrailers = async (
  movieId: string | number
): Promise<string | null> => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos`, {
    headers: getHeaders(),
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