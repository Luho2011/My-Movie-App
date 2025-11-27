import type { MovieBasic, MovieWithImdb } from "./fetchMovies";

type TMDBListResponse = {
  results: MovieBasic[];
};

// Startseite Movies fetchen per Genre
export async function fetchMoviesByGenre(
  genreId: number,
  limit = 6
): Promise<MovieWithImdb[]> {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=de-DE&with_genres=${genreId}&sort_by=popularity.desc`
  );

  const data: TMDBListResponse = await res.json();
  const movies = data.results.slice(0, limit);

  const detailPromises = movies.map(async (m): Promise<MovieWithImdb> => {
    const r2 = await fetch(
      `https://api.themoviedb.org/3/movie/${m.id}/external_ids?api_key=${apiKey}`
    );
    const ext: { imdb_id: string | null } = await r2.json();
    return { ...m, imdb_id: ext.imdb_id ?? null };
  });

  return Promise.all(detailPromises);
}

