export type WatchlistDB = {
  id: string;
  userId: string;
  movieId: string;
  title: string;
  posterPath: string | null;   
  poster_path?: string | null;    
  imdbId: string | null;         
};