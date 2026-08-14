import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home";
import MovieDetails from "./components/movieDetails";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;