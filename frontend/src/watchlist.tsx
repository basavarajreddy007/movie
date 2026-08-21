import { Link } from "react-router-dom";
import { Check, LockIcon, UserIcon } from "./components/icons";
import { MovieCard } from "./components/MovieCard";
import { useAuth } from "./context/AuthContext";

function Watchlist() {
  const { watchlist, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080B15] text-slate-900 dark:text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2.5">
            <Check size={22} className="text-[#FF3D68]" />
            <span>
              My Watchlist {isAuthenticated ? `(${watchlist.length})` : ""}
            </span>
          </h2>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center text-center py-20">
            <LockIcon
              size={40}
              className="text-[#FF3D68] mb-4"
            />

            <h3 className="text-xl font-black mb-2">
              Sign In to View Your Watchlist
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Sign in to save movies to your personal watchlist.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80]"
            >
              <UserIcon size={16} />
              Sign In
            </Link>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20">
            <Check
              size={40}
              className="text-[#FF3D68] mb-4"
            />

            <h3 className="text-lg font-bold mb-2">
              Your Watchlist is Empty
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Add movies you want to watch later.
            </p>

            <Link
              to="/"
              className="inline-flex items-center px-6 h-11 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3D68] to-[#FF5E80]"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6">
            {watchlist.map((movie) => (
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

export default Watchlist;