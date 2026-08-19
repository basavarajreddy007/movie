import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { loginUser, registerUser } from "../service/authApi";
import { fetchUserBookmarks, toggleUserBookmark } from "../service/bookmarkApi";
import type { AuthContextType, LoginCredentials, RegisterCredentials, User } from "../types/auth";
import type { Movie } from "../types/movies";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
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

  const [bookmarks, setBookmarks] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem("user");
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.bookmarks || [];
    } catch {
      return [];
    }
  });

  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const refreshBookmarks = useCallback(async () => {
    if (!token) {
      setBookmarks([]);
      return;
    }
    const res = await fetchUserBookmarks(token);
    if (res.success && res.bookmarks) {
      setBookmarks(res.bookmarks);
    }
  }, [token]);

  const isBookmarked = (movieId: number): boolean => {
    return bookmarks.some((m) => m.id === movieId);
  };

  const toggleBookmark = async (movie: Movie): Promise<boolean> => {
    if (!isAuthenticated || !token) {
      setAuthError("Please sign in to bookmark movies.");
      return false;
    }

    const res = await toggleUserBookmark(movie, token);
    if (res.success && res.bookmarks) {
      setBookmarks(res.bookmarks);
      return res.isBookmarked ?? !isBookmarked(movie.id);
    }
    return isBookmarked(movie.id);
  };

  const saveAuthSession = (resUser: User, resToken: string) => {
    setUser(resUser);
    setToken(resToken);
    setAuthError(null);
    setBookmarks(resUser.bookmarks || []);
    try {
      localStorage.setItem("user", JSON.stringify(resUser));
      localStorage.setItem("token", resToken);
    } catch {
      // ignore
    }
  };

  const login = async (data: LoginCredentials) => {
    setAuthError(null);
    const res = await loginUser(data);
    if (!res.success || !res.token || !res.user) {
      const msg = res.message || "Invalid email or password.";
      setAuthError(msg);
      return { success: false, message: msg };
    }
    saveAuthSession(res.user, res.token);
    return { success: true, message: res.message };
  };

  const register = async (data: RegisterCredentials) => {
    setAuthError(null);
    const res = await registerUser(data);
    if (!res.success || !res.token || !res.user) {
      const msg = res.message || "Unable to create account.";
      setAuthError(msg);
      return { success: false, message: msg };
    }
    saveAuthSession(res.user, res.token);
    return { success: true, message: res.message };
  };

  const logout = useCallback(() => {
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
  }, []);

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading: false,
        authError,
        bookmarks,
        bookmarkCount: bookmarks.length,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}