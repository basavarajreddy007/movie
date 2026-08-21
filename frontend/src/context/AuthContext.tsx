import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loginUser, registerUser, getCurrentUser } from "../service/authApi";
import {
  fetchWatchlist,
  toggleUserWatchlist,
} from "../service/watchlistApi";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";
import type { Movie } from "../types/movies";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;
  const watchlistCount = watchlist.length;

  const loadWatchlist = useCallback(async (authToken: string) => {
    const res = await fetchWatchlist(authToken);
    if (res.success && res.watchlist) {
      setWatchlist(res.watchlist);
      setUser((prev) => (prev ? { ...prev, watchlist: res.watchlist } : prev));
    }
  }, []);

  // On page load/refresh: If token exists, load user and watchlist directly from DB
  useEffect(() => {
    const restoreSessionFromDB = async () => {
      // Ensure no cached user data is stored in localStorage
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("watchlist");
      } catch {}

      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser(savedToken);
        if (res.success && res.user) {
          setUser(res.user);
          setToken(savedToken);
          setWatchlist(res.watchlist || res.user.watchlist || []);
        } else {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          setWatchlist([]);
          localStorage.removeItem("token");
        }
      } catch {
        setUser(null);
        setToken(null);
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSessionFromDB();
  }, []);

  const saveAuthSession = (
    newUser: User,
    newToken: string,
    initialWatchlist?: Movie[]
  ) => {
    setUser({
      ...newUser,
      watchlist: initialWatchlist ?? newUser.watchlist ?? [],
    });
    setToken(newToken);
    setWatchlist(initialWatchlist || newUser.watchlist || []);

    try {
      localStorage.setItem("token", newToken);
      // Ensure no user data objects are saved in localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("watchlist");
    } catch {}
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const toggleWatchlist = async (movie: Movie) => {
    if (!token) {
      setAuthError("Please sign in to manage your watchlist.");
      return false;
    }

    const res = await toggleUserWatchlist(movie, token);

    if (res.success && res.watchlist) {
      setWatchlist(res.watchlist);
      setUser((prev) => (prev ? { ...prev, watchlist: res.watchlist } : prev));
      return res.isInWatchlist ?? isInWatchlist(movie.id);
    }

    return isInWatchlist(movie.id);
  };

  const refreshWatchlist = useCallback(async () => {
    if (!token) return;
    await loadWatchlist(token);
  }, [token, loadWatchlist]);

  const login = async (credentials: LoginCredentials) => {
    setAuthError(null);
    setIsLoading(true);

    const res = await loginUser(credentials);
    setIsLoading(false);

    if (!res.success || !res.token || !res.user) {
      const msg = res.message || "Invalid email or password.";
      setAuthError(msg);
      return { success: false, message: msg };
    }

    const incomingWatchlist = res.watchlist || res.user.watchlist || [];
    saveAuthSession(res.user, res.token, incomingWatchlist);

    return { success: true };
  };

  const register = async (credentials: RegisterCredentials) => {
    setAuthError(null);
    setIsLoading(true);

    const res = await registerUser(credentials);
    setIsLoading(false);

    if (!res.success || !res.token || !res.user) {
      const msg = res.message || "Unable to create account.";
      setAuthError(msg);
      return { success: false, message: msg };
    }

    const incomingWatchlist = res.watchlist || res.user.watchlist || [];
    saveAuthSession(res.user, res.token, incomingWatchlist);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    setAuthError(null);

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("watchlist");
    } catch {}
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        watchlist,
        watchlistCount,
        isInWatchlist,
        toggleWatchlist,
        refreshWatchlist,
        login,
        register,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

