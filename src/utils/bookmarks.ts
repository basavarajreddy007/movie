import type { Movie } from "../types/movies";

const BOOKMARKS_KEY = "bookmarked_movies";

export const getBookmarks = (): Movie[] => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isBookmarked = (id: number): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some((m) => m.id === id);
};

export const toggleBookmark = (movie: Movie): boolean => {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((m) => m.id === movie.id);
  let updated: Movie[];

  if (exists) {
    updated = bookmarks.filter((m) => m.id !== movie.id);
  } else {
    updated = [...bookmarks, movie];
  }

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("bookmarksUpdated"));
  } catch {}

  return !exists;
};
