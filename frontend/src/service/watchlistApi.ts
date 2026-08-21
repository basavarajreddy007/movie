import type { Movie } from "../types/movies";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Fetch the logged-in user's watchlist from MongoDB backend
export const fetchWatchlist = async (
  token: string
): Promise<{
  success: boolean;
  watchlist?: Movie[];
  message?: string;
}> => {
  if (!token) {
    return {
      success: false,
      message: "Authentication token is required.",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/watchlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to load watchlist.",
      };
    }

    return {
      success: true,
      watchlist: data.watchlist || [],
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Unable to connect to backend server.",
    };
  }
};

// Toggle a movie in the logged-in user's MongoDB watchlist
export const toggleUserWatchlist = async (
  movie: Movie,
  token: string
): Promise<{
  success: boolean;
  isInWatchlist?: boolean;
  watchlist?: Movie[];
  message?: string;
}> => {
  if (!token) {
    return {
      success: false,
      message: "Please sign in to manage your watchlist.",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/watchlist/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update watchlist.",
      };
    }

    return {
      success: true,
      isInWatchlist: data.isInWatchlist,
      watchlist: data.watchlist || [],
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Unable to connect to backend server.",
    };
  }
};

export default {
  fetchWatchlist,
  toggleUserWatchlist,
};