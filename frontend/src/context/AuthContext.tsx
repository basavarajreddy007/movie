import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { loginUser, registerUser } from "../service/authApi";
import { toggleUserBookmark } from "../service/bookmarkApi";
import type {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";
import type { Movie } from "../types/movies";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Load initial user and token from localStorage
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

  // Bookmarks are loaded directly from user session (no extra API call on login/mount)
  const [bookmarks, setBookmarks] = useState<Movie[]>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      return parsed?.bookmarks || [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;
  const bookmarkCount = bookmarks.length;

  // Helper to save authenticated session & bookmarks
  const saveAuthSession = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    const userBookmarks = newUser.bookmarks || [];
    setBookmarks(userBookmarks);

    try {
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", newToken);
    } catch {
      // ignore
    }
  };

  // Check if a movie is bookmarked
  const isBookmarked = (movieId: number): boolean => {
    return bookmarks.some((m) => m.id === movieId);
  };

  // Toggle bookmark in MongoDB - updates state directly from toggle response
  const toggleBookmark = async (movie: Movie): Promise<boolean> => {
    if (!token) {
      setAuthError("Please sign in to bookmark movies.");
      return false;
    }

    const res = await toggleUserBookmark(movie, token);
    if (res.success && res.bookmarks) {
      setBookmarks(res.bookmarks);

      // Sync updated bookmarks with stored user
      if (user) {
        const updatedUser = { ...user, bookmarks: res.bookmarks };
        setUser(updatedUser);
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch {
          // ignore
        }
      }
      return res.isBookmarked ?? !isBookmarked(movie.id);
    }

    return isBookmarked(movie.id);
  };

  // Log in user - bookmarks come directly in login response
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

    saveAuthSession(res.user, res.token);
    return { success: true };
  };

  // Register new user
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

    saveAuthSession(res.user, res.token);
    return { success: true };
  };

  // Log out user
  const logout = () => {
    setUser(null);
    setToken(null);
    setBookmarks([]);
    setAuthError(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
  };

  const refreshBookmarks = async () => {
    // Bookmarks are synced with user login and toggle responses
  };

  const clearAuthError = () => setAuthError(null);

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
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
