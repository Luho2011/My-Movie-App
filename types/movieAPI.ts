export type MovieAPI = {
  id: number;
  title: string;
  poster_path: string | null;
  imdb_id?: string | null;
  backdrop_path?: string | null;
  overview?: string | null;
  release_date?: string | null;
  media_type?: "movie" | "tv";
};

export type MediaType = "movie" | "tv";
