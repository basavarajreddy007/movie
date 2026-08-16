import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home";
import MovieDetails from "./components/movieDetails";
import Bookmarks from "./bookmarks";
import { Navbar } from "./components/navbar";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const searchCallbackRef = useRef<((query: string) => void) | null>(null);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  const handleSearch = (query: string) => {
    searchCallbackRef.current?.(query);
  };

  return (
    <BrowserRouter>
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        onSearch={handleSearch}
      />

      <Routes>
        <Route 
          path="/" 
          element={<Home searchCallbackRef={searchCallbackRef} />} 
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;