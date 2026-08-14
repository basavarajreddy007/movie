import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import MovieDetails from "./components/movieDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;