import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../service/authApi";
import { fetchUserBookmarks, toggleUserBookmark } from "../service/bookmarkApi";
import type { AuthContextType, LoginCredentials, RegisterCredentials, User } from "../types/auth";
import type { Movie } from "../types/movies";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Clean up any legacy localStorage bookmark data on initialization
  useEffect(() => {
    try {
      localStorage.removeItem("bookmarked_movies");
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const rawUser = localStorage.getItem("user");
      return rawUser ? (JSON.parse(rawUser) as User) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  // Bookmarks are strictly loaded and saved from MongoDB Atlas, never in localStorage
  const [bookmarks, setBookmarks] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const bookmarkCount = bookmarks.length;
  const isAuthenticated = !!user && !!token;

  const initializedTokenRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const refreshBookmarks = useCallback(
    async (authToken?: string) => {
      const activeToken = authToken ?? tokenRef.current ?? token;
      if (!activeToken) {
        setBookmarks([]);
        return;
      }

      try {
        const result = await fetchUserBookmarks(activeToken);

        if (result.success && result.bookmarks) {
          // Strictly use bookmarks loaded from MongoDB
          setBookmarks(result.bookmarks);
        } else {
          setBookmarks([]);
        }
      } catch {
        setBookmarks([]);
      }
    },
    [token]
  );

  const isBookmarked = (movieId: number): boolean => {
    return bookmarks.some((movie) => movie.id === movieId);
  };

  const toggleBookmark = async (movie: Movie): Promise<boolean> => {
    if (!isAuthenticated || !token) {
      setAuthError("Please sign in to bookmark movies.");
      setIsAuthModalOpen(true);
      setAuthModalTab("login");
      return false;
    }

    try {
      // Toggle bookmark directly in MongoDB collection via backend API
      const apiResult = await toggleUserBookmark(movie, token);
      if (apiResult.success && apiResult.bookmarks) {
        // Sync state directly from MongoDB response
        setBookmarks(apiResult.bookmarks);
        return apiResult.isBookmarked ?? !isBookmarked(movie.id);
      } else {
        setAuthError(apiResult.message || "Failed to update bookmark in database.");
        return isBookmarked(movie.id);
      }
    } catch {
      setAuthError("Failed to update bookmark in database. Please check your connection.");
      return isBookmarked(movie.id);
    }
  };

  const login = async (data: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    setAuthError(null);
    const result = await loginUser(data);

    if (!result.success || !result.token || !result.user) {
      const msg = result.message || "Invalid email or password.";
      setAuthError(msg);
      return { success: false, message: msg };
    }

    setUser(result.user);
    setToken(result.token);
    setAuthError(null);

    try {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      localStorage.removeItem("bookmarked_movies");
    } catch {
      // ignore
    }

    // Set bookmarks exclusively from the MongoDB user object
    const mongoBookmarks = Array.isArray(result.user.bookmarks) ? result.user.bookmarks : [];
    setBookmarks(mongoBookmarks);

    return { success: true, message: result.message };
  };

  const register = async (data: RegisterCredentials): Promise<{ success: boolean; message?: string }> => {
    setAuthError(null);
    const result = await registerUser(data);

    if (!result.success || !result.token || !result.user) {
      const msg = result.message || "Unable to create account.";
      setAuthError(msg);
      return { success: false, message: msg };
    }

    setUser(result.user);
    setToken(result.token);
    setAuthError(null);

    try {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      localStorage.removeItem("bookmarked_movies");
    } catch {
      // ignore
    }

    // Set bookmarks exclusively from MongoDB user object
    const mongoBookmarks = Array.isArray(result.user.bookmarks) ? result.user.bookmarks : [];
    setBookmarks(mongoBookmarks);

    return { success: true, message: result.message };
  };

  const logout = useCallback(() => {
    initializedTokenRef.current = null;
    setUser(null);
    setToken(null);
    setIsAuthModalOpen(false);
    setAuthError(null);
    setBookmarks([]);
    setIsLoading(false);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("bookmarked_movies");
    } catch {
      // ignore
    }
  }, []);

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Synchronize authenticated session with MongoDB
  useEffect(() => {
    if (!token) {
      initializedTokenRef.current = null;
      setBookmarks([]);
      setIsLoading(false);
      return;
    }

    if (initializedTokenRef.current === token) {
      return;
    }

    initializedTokenRef.current = token;
    const currentToken = token;

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const meResult = await getCurrentUser(currentToken);

        if (tokenRef.current !== currentToken) {
          return;
        }

        if (!meResult.success || !meResult.user) {
          logout();
          return;
        }

        setUser(meResult.user);
        try {
          localStorage.setItem("user", JSON.stringify(meResult.user));
        } catch {
          // ignore
        }

        // Fetch fresh bookmarks exclusively from MongoDB
        await refreshBookmarks(currentToken);
      } catch {
        if (tokenRef.current !== currentToken) {
          return;
        }
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, [token, logout, refreshBookmarks]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        bookmarks,
        bookmarkCount,
        isBookmarked,
        toggleBookmark,
        refreshBookmarks,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
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