import axios from "axios";
import type { Movie } from "../types/movies";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.tmdb.org/3";

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const getMovies = async (query = ""): Promise<Movie[]> => {
  const url = query.trim()
    ? `/search/movie?query=${encodeURIComponent(query)}`
    : `/movie/popular`;

  const response = await tmdbClient.get<{ results: Movie[] }>(url);
  return response.data.results || [];
};

export const getMovieById = async (
  id: string | number
): Promise<Movie> => {
  const response = await tmdbClient.get<Movie>(`/movie/${id}`);
  return response.data;
};