import type { Movie } from "../types/movies";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchUserBookmarks = async (
  token: string
): Promise<{ success: boolean; bookmarks?: Movie[]; message?: string }> => {
  if (!token) {
    return { success: false, message: "No token provided." };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch bookmarks.",
      };
    }

    return {
      success: true,
      bookmarks: data.bookmarks || [],
    };
  } catch {
    return {
      success: false,
      message: "Unable to load bookmarks.",
    };
  }
};


export const toggleUserBookmark = async (
  movie: Movie,
  token: string
): Promise<{
  success: boolean;
  isBookmarked?: boolean;
  bookmarks?: Movie[];
  message?: string;
}> => {
  if (!token) {
    return { success: false, message: "Authentication required." };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/bookmarks/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update bookmark.",
      };
    }

    return {
      success: true,
      isBookmarked: data.isBookmarked,
      bookmarks: data.bookmarks || [],
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: "Unable to update bookmark.",
    };
  }
};

