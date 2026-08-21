import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { loginUser, registerUser } from "../service/authApi";
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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (Array.isArray(parsed.watchlist)) {
          return parsed.watchlist;
        }
      }
    } catch {
      return [];
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;
  const watchlistCount = watchlist.length;

  const loadWatchlist = async (authToken: string) => {
    const res = await fetchWatchlist(authToken);

    if (res.success && res.watchlist) {
      setWatchlist(res.watchlist);
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, watchlist: res.watchlist };
        try {
          localStorage.setItem("user", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };



  const saveAuthSession = (
    newUser: User,
    newToken: string,
    initialWatchlist?: Movie[]
  ) => {
    const userWithWatchlist = {
      ...newUser,
      watchlist: initialWatchlist ?? newUser.watchlist ?? [],
    };
    setUser(userWithWatchlist);
    setToken(newToken);
    if (initialWatchlist || newUser.watchlist) {
      setWatchlist(initialWatchlist || newUser.watchlist || []);
    }

    try {
      localStorage.setItem("user", JSON.stringify(userWithWatchlist));
      localStorage.setItem("token", newToken);
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
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, watchlist: res.watchlist };
        try {
          localStorage.setItem("user", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      return res.isInWatchlist ?? isInWatchlist(movie.id);
    }

    return isInWatchlist(movie.id);
  };

  const refreshWatchlist = async () => {
    if (!token) return;

    await loadWatchlist(token);
  };

  const login = async (credentials: LoginCredentials) => {
    setAuthError(null);
    setIsLoading(true);

    const res = await loginUser(credentials);

    setIsLoading(false);

    if (!res.success || !res.token || !res.user) {
      const msg = res.message || "Invalid email or password.";
      setAuthError(msg);

      return {
        success: false,
        message: msg,
      };
    }

    const incomingWatchlist = res.watchlist || res.user.watchlist || [];
    saveAuthSession(res.user, res.token, incomingWatchlist);

    return {
      success: true,
    };
  };

  const register = async (credentials: RegisterCredentials) => {
    setAuthError(null);
    setIsLoading(true);

    const res = await registerUser(credentials);

    setIsLoading(false);

    if (!res.success || !res.token || !res.user) {
      const msg = res.message || "Unable to create account.";
      setAuthError(msg);

      return {
        success: false,
        message: msg,
      };
    }

    const incomingWatchlist = res.watchlist || res.user.watchlist || [];
    saveAuthSession(res.user, res.token, incomingWatchlist);

    return {
      success: true,
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    setAuthError(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
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