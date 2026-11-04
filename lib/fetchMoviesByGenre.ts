import type { MovieBasic, MovieWithImdb } from "./fetchMovies";
import type { MediaType } from "@/types/movieAPI";
type TMDBListResponse = {
  results: MovieBasic[];
};

// Startseite Movies/Serien fetchen per Genre
// imdb_id wird hier NICHT geladen (spart 20 Anfragen pro Genre) –
// sie kommt erst beim Öffnen der Details bzw. beim Hinzufügen zur Watchlist
export async function fetchMoviesByGenre(
  genreId: number,
  limit = 6,
  type: MediaType = "movie"
): Promise<MovieWithImdb[]> {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=de-DE&with_genres=${genreId}&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } }
  );

  const data: TMDBListResponse = await res.json();
  return (data.results ?? []).slice(0, limit).map((m) => ({
    ...m,
    title: m.title ?? m.name,
    media_type: type,
    imdb_id: null,
  }));
}
