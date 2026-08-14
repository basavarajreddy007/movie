import type { Movie } from "../types/movies";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const getMovies = async (query = ""): Promise<Movie[]> => {
  const url = query
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
    : "https://api.themoviedb.org/3/movie/popular";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  return data.results;
};
export const getMovieById = async (id: string): Promise<Movie> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
};