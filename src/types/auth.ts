import type { Movie } from "./movies";

export interface User {
  id: string;
  name: string;
  email: string;
  bookmarks?: Movie[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  bookmarks: Movie[];
  bookmarkCount: number;
  isBookmarked: (movieId: number) => boolean;
  toggleBookmark: (movie: Movie) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearAuthError: () => void;
}
