import type { Movie } from "./movies";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  watchlist?: Movie[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  watchlist?: Movie[];
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
  watchlist: Movie[];
  watchlistCount: number;
  isInWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movie: Movie) => Promise<boolean>;
  refreshWatchlist: () => Promise<void>;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearAuthError: () => void;
}