import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const postAuth = async (endpoint: string, data: object): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Authentication failed.",
      };
    }

    return {
      success: true,
      token: result.token,
      user: result.user,
      message: result.message,
    };
  } catch {
    return {
      success: false,
      message: "Unable to connect to server. Make sure the backend is running.",
    };
  }
};

// Register a new user
export const registerUser = (credentials: RegisterCredentials): Promise<AuthResponse> => {
  return postAuth("/api/auth/register", {
    name: credentials.name?.trim() || "",
    email: credentials.email?.trim().toLowerCase() || "",
    password: credentials.password,
  });
};

// Log in an existing user
export const loginUser = (credentials: LoginCredentials): Promise<AuthResponse> => {
  return postAuth("/api/auth/login", {
    email: credentials.email?.trim().toLowerCase() || "",
    password: credentials.password,
  });
};

// Get current user profile using JWT token
export const getCurrentUser = async (token: string): Promise<AuthResponse> => {
  if (!token) {
    return { success: false, message: "No token provided." };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to load user profile.",
      };
    }

    return {
      success: true,
      token,
      user: result.user,
    };
  } catch {
    return {
      success: false,
      message: "Unable to connect to server. Make sure the backend is running.",
    };
  }
};

export const authApi = {
  registerUser,
  loginUser,
  getCurrentUser,
};

export default authApi;


