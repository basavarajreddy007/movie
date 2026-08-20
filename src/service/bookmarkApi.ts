import axios from "axios";
import type { Movie } from "../types/movies";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const bookmarkClient = axios.create({
  baseURL: BASE_URL,
});

export const fetchUserBookmarks = async (
  token: string
): Promise<{ success: boolean; bookmarks?: Movie[]; message?: string }> => {
  if (!token) return { success: false, message: "No token provided." };

  try {
    const res = await bookmarkClient.get<{ success: boolean; bookmarks?: Movie[]; message?: string }>(
      "/api/bookmarks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { success: true, bookmarks: res.data.bookmarks || [] };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as { message?: string };
      return {
        success: false,
        message: data.message || "Failed to fetch bookmarks.",
      };
    }
    return { success: false, message: "Unable to load bookmarks." };
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
  if (!token) return { success: false, message: "Authentication required." };

  try {
    const res = await bookmarkClient.post<{
      success: boolean;
      isBookmarked?: boolean;
      bookmarks?: Movie[];
      message?: string;
    }>(
      "/api/bookmarks/toggle",
      movie,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      isBookmarked: res.data.isBookmarked,
      bookmarks: res.data.bookmarks || [],
      message: res.data.message,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as { message?: string };
      return {
        success: false,
        message: data.message || "Failed to update bookmark.",
      };
    }
    return { success: false, message: "Unable to update bookmark." };
  }
};
