import type { MovieBasic, MovieWithImdb } from "./fetchMovies";
import type { MediaType } from "@/types/movieAPI";

type TMDBListResponse = {
  results: MovieBasic[];
};

// Startseite Movies/Serien fetchen per Genre
export async function fetchMoviesByGenre(
  genreId: number,
  limit = 6,
  type: MediaType = "movie"
): Promise<MovieWithImdb[]> {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=de-DE&with_genres=${genreId}&sort_by=popularity.desc`
  );

  const data: TMDBListResponse = await res.json();
  const movies = data.results.slice(0, limit);

  const detailPromises = movies.map(async (m): Promise<MovieWithImdb> => {
    const r2 = await fetch(
      `https://api.themoviedb.org/3/${type}/${m.id}/external_ids?api_key=${apiKey}`
    );
    const ext: { imdb_id: string | null } = await r2.json();
    return { ...m, title: m.title ?? m.name, media_type: type, imdb_id: ext.imdb_id ?? null };
  });

  return Promise.all(detailPromises);
}
