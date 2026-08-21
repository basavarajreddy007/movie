import type { Movie } from "../types/movies";

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Fetch movies from user's watchlist in backend MongoDB
export const fetchWatchlist = async (
  token?: string
): Promise<{
  success: boolean;
  watchlist?: Movie[];
  message?: string;
}> => {
  if (!token) {
    return { success: false, watchlist: [], message: "No token provided." };
  }

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/watchlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      return {
        success: true,
        watchlist: data.watchlist || [],
      };
    }

    return {
      success: false,
      watchlist: [],
      message: data.message || "Failed to load watchlist",
    };
  } catch (error: any) {
    return {
      success: false,
      watchlist: [],
      message: error?.message || "Unable to reach server",
    };
  }
};

// Store (Add/Remove) a movie in user's watchlist in backend MongoDB
export const toggleUserWatchlist = async (
  movie: Movie,
  token?: string,
  isCurrentlyInWatchlist: boolean = false
): Promise<{
  success: boolean;
  isInWatchlist?: boolean;
  watchlist?: Movie[];
  message?: string;
}> => {
  if (!token) {
    return {
      success: false,
      isInWatchlist: isCurrentlyInWatchlist,
      message: "Please log in to manage your watchlist.",
    };
  }

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/watchlist/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: movie.id,
        title: movie.title || "",
        poster_path: movie.poster_path || null,
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || "",
        overview: movie.overview || "",
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      return {
        success: true,
        isInWatchlist: data.isInWatchlist,
        watchlist: data.watchlist || [],
        message: data.message,
      };
    }

    return {
      success: false,
      isInWatchlist: isCurrentlyInWatchlist,
      message: data.message || "Failed to update watchlist.",
    };
  } catch (error: any) {
    return {
      success: false,
      isInWatchlist: isCurrentlyInWatchlist,
      message: error?.message || "Unable to reach server",
    };
  }
};

export default {
  fetchWatchlist,
  toggleUserWatchlist,
};

