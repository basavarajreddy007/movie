import type { Movie } from "../types/movies";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

export const getMovies = async (query = ""): Promise<Movie[]> => {
  const targetUrl = query
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
    : "https://api.themoviedb.org/3/movie/popular";

  try {
    const response = await fetchWithTimeout(targetUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }, 6000);

    if (response.ok) {
      const data = await response.json();
      return data.results || [];
    }
  } catch {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const proxyResponse = await fetchWithTimeout(proxyUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }, 6000);

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      return data.results || [];
    }
  }

  throw new Error("Unable to connect to movie service. Please check your internet connection.");
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const targetUrl = `https://api.themoviedb.org/3/movie/${id}`;

  try {
    const response = await fetchWithTimeout(targetUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }, 6000);

    if (response.ok) {
      return await response.json();
    }
  } catch {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const proxyResponse = await fetchWithTimeout(proxyUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }, 6000);

    if (proxyResponse.ok) {
      return await proxyResponse.json();
    }
  }

  throw new Error("Unable to fetch movie details.");
};