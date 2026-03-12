export interface Movie {
  id: number;
  title: string;
  release_date: string; // ou Date
  duration: number;     // en minutes
  genre: string;
  created_at: Date;
}

export interface CreateMovieInput {
  title: string;
  release_date: string;
  duration: number;
  genre: string;
}

export interface UpdateMovieInput {
  title?: string;
  release_date?: string;
  duration?: number;
  genre?: string;
}