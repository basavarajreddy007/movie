import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "./components/icons";
import type { Movie } from "./types/movies";
import { getBookmarks } from "./utils/bookmarks";
import { MovieCard } from "./components/MovieCard";

function Bookmarks() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const refreshBookmarks = () => {
    setMovies(getBookmarks());
  };

  useEffect(() => {
    refreshBookmarks();

    const handleUpdate = () => {
      refreshBookmarks();
    };

    window.addEventListener("bookmarksUpdated", handleUpdate);
    return () => {
      window.removeEventListener("bookmarksUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080B15] text-slate-900 dark:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark size={22} className="text-[#FF3D68]" />
            <span>My Bookmarks ({movies.length})</span>
          </h2>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FF3D68]/10 text-[#FF3D68] flex items-center justify-center mb-4">
              <Bookmark size={32} />
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
              No bookmarked movies yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Explore movies and click the bookmark icon on any card to save your favorites.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-lg shadow-[#FF3D68]/25 hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              <span>Browse Movies</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBookmarkToggle={refreshBookmarks}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Bookmarks;
