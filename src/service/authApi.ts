import axios from "axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const authClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const postAuth = async (endpoint: string, body: object): Promise<AuthResponse> => {
  try {
    const res = await authClient.post<AuthResponse>(endpoint, body);
    return { success: true, ...res.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as { message?: string };
      return {
        success: false,
        message: data.message || "Authentication failed.",
      };
    }
    return {
      success: false,
      message: "Unable to connect to server. Ensure backend is running on port 5000.",
    };
  }
};

export const registerUser = (credentials: RegisterCredentials) =>
  postAuth("/api/auth/register", {
    name: credentials.name.trim(),
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  });

export const loginUser = (credentials: LoginCredentials) =>
  postAuth("/api/auth/login", {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  });

