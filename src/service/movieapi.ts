import type { Movie } from "../types/movies";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN || "";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const REQUEST_TIMEOUT = 8000;
const MAX_RANDOM_PAGE = 10;

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const getRandomPage = () =>
  Math.floor(Math.random() * MAX_RANDOM_PAGE) + 1;

const getRandomHomepageUrl = () => {
  const page = getRandomPage();

  const endpoints = [
    `${TMDB_BASE_URL}/movie/popular?page=${page}`,
    `${TMDB_BASE_URL}/movie/now_playing?page=${page}`,
    `${TMDB_BASE_URL}/movie/top_rated?page=${page}`,
    `${TMDB_BASE_URL}/trending/movie/week?page=${page}`,
    `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&vote_count.gte=50`,
  ];

  return endpoints[
    Math.floor(Math.random() * endpoints.length)
  ];
};

const fetchMoviesFromUrl = async (
  url: string
): Promise<Movie[]> => {
  const response = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return Array.isArray(data.results)
    ? data.results
    : [];
};

export const getMovies = async (
  query = ""
): Promise<Movie[]> => {
  const trimmedQuery = query.trim();

  try {
    if (trimmedQuery) {
      const searchUrl =
        `${TMDB_BASE_URL}/search/movie?query=` +
        `${encodeURIComponent(trimmedQuery)}`;

      return await fetchMoviesFromUrl(searchUrl);
    }

    try {
      const homepageUrl = getRandomHomepageUrl();
      const movies = await fetchMoviesFromUrl(homepageUrl);

      if (movies.length > 0) {
        return shuffleArray(movies);
      }
    } catch (randomPageError) {
      console.warn("Random homepage fetch failed, falling back to popular page 1:", randomPageError);
    }

    const fallbackUrl = `${TMDB_BASE_URL}/movie/popular?page=1`;
    const fallbackMovies = await fetchMoviesFromUrl(fallbackUrl);

    return shuffleArray(fallbackMovies);
  } catch (error) {
    console.error("Movie fetch error:", error);

    throw new Error(
      "Unable to connect to movie service. Please check your internet connection."
    );
  }
};

export const getMovieById = async (
  id: string
): Promise<Movie> => {
  const url =
    `${TMDB_BASE_URL}/movie/${encodeURIComponent(id)}`;

  try {
    return await fetchMoviesDetails(url);
  } catch (error) {
    console.error("Movie details error:", error);

    throw new Error(
      "Unable to fetch movie details."
    );
  }
};

const fetchMoviesDetails = async (
  url: string
): Promise<Movie> => {
  const response = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
};