export interface Movie {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  genres?: string[] | { id: number; name: string }[];
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
}