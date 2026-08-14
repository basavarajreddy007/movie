export interface Movie {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  genres?: string[];
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  

  year?: number;
  rating?: number;
  medium_cover_image?: string;
  large_cover_image?: string;
  summary?: string;
}

export interface MovieResponse {
  data: {
    movies: Movie[];
  };
}