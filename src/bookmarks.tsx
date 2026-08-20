import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, LockIcon, UserIcon, Loader2 } from "./components/icons";
import { MovieCard } from "./components/MovieCard";
import { useAuth } from "./context/AuthContext";

function Bookmarks() {
  const { bookmarks, isAuthenticated, refreshBookmarks } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      refreshBookmarks().finally(() => setLoading(false));
    }
  }, [isAuthenticated, refreshBookmarks]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-[#f4f6fa] dark:bg-[#080B15]">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 size={32} className="animate-spin text-[#FF3D68]" />
          <p className="text-sm font-medium">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080B15] text-slate-900 dark:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark size={22} className="text-[#FF3D68]" />
            <span>My Bookmarks {isAuthenticated ? `(${bookmarks.length})` : ""}</span>
          </h2>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[#FF3D68] flex items-center justify-center mb-4 shadow-sm">
              <LockIcon size={30} />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1.5">
              Sign In to View Your Bookmarks
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Your saved movies are private and stored safely in your personal account. Sign in or create an account to view and manage them.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80] shadow-lg shadow-[#FF3D68]/25 hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <UserIcon size={16} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 hover:border-[#FF3D68]/40 hover:text-[#FF3D68] transition-all duration-200 cursor-pointer"
              >
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FF3D68]/10 text-[#FF3D68] flex items-center justify-center mb-4">
              <Bookmark size={32} />
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
              No bookmarked movies yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Explore movies and click the bookmark icon on any card to save your favorites to your account.
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
            {bookmarks.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Bookmarks;
