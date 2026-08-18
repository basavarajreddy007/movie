import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./home";
import MovieDetails from "./components/movieDetails";
import Bookmarks from "./bookmarks";
import { Navbar } from "./components/navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./loginPage";
import { Loader } from "./components/Loader";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#f4f6fa] dark:bg-[#080B15]">
        <Loader
          size="fullscreen"
          title="Authenticating..."
          subtitle="Verifying your MOVIEMAX account"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#f4f6fa] dark:bg-[#080B15]">
        <Loader
          size="fullscreen"
          title="Authenticating..."
          subtitle="Verifying your MOVIEMAX account"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function MainLayout({
  darkMode,
  setDarkMode,
  searchCallbackRef,
}: {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  searchCallbackRef: React.RefObject<((query: string) => void) | null>;
}) {
  const handleSearch = (query: string) => {
    searchCallbackRef.current?.(query);
  };

  return (
    <>
      {/* Navbar is always visible on all pages including Login and Register */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSearch={handleSearch}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <LoginPage />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <LoginPage />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home searchCallbackRef={searchCallbackRef} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return true;
    }
  });
  const searchCallbackRef = useRef<((query: string) => void) | null>(null);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchCallbackRef={searchCallbackRef}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;