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

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  popularity?: number;
  order?: number;
  known_for_department?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}