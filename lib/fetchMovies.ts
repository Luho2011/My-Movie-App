import type { MovieAPI, MediaType } from "@/types/movieAPI";
import { fetchRatings } from "./fetchRatings";

// Serien haben bei TMDB "name" statt "title"
type TMDBListResponse = {
  results: (Omit<MovieAPI, "imdb_id"> & { name?: string })[];
};

// Basis-Typ ohne imdb_id
export type MovieBasic = Omit<MovieAPI, "imdb_id"> & { name?: string };

// Typ mit imdb_id
export type MovieWithImdb = MovieAPI;

export async function fetchMovies(
  query?: string,
  genre?: string,
  type: MediaType = "movie",
  minImdb = 0,
  minMeta = 0
): Promise<MovieAPI[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const hasRatingFilter = minImdb > 0 || minMeta > 0;

  // dynamische url je nachdem ob per query, genre oder nur per rating gesucht wird (type = movie oder tv)
  let url = "";
  if (query) {
    url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
  } else if (genre) {
    url = `https://api.themoviedb.org/3/discover/${type}?with_genres=${genre}&api_key=${apiKey}&language=de-DE`;
  } else {
    // nur Rating-Filter aktiv → beliebteste Titel
    url = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=de-DE&sort_by=popularity.desc`;
  }

  // mit Rating-Filter 2 Seiten laden, weil danach aussortiert wird
  const pages = hasRatingFilter ? [1, 2] : [1];
  const responses = await Promise.all(
    pages.map(async (page): Promise<TMDBListResponse> => {
      const res = await fetch(`${url}&page=${page}`, { next: { revalidate: 3600 } });
      return res.json();
    })
  );
  const movies = responses.flatMap((r) => r.results);

  const detailPromises = movies.map(async (m): Promise<MovieAPI> => {
    // fetche alle von tmdb bereitgestellten external ids (imdb_id)
    const r2 = await fetch(
      `https://api.themoviedb.org/3/${type}/${m.id}/external_ids?api_key=${apiKey}`
    );
    // in ext die imdb_id speichern und im spread operator anhängen
    const ext: { imdb_id: string | null } = await r2.json();
    const imdbId = ext.imdb_id ?? null;

    const movie: MovieAPI = { ...m, title: m.title ?? m.name, media_type: type, imdb_id: imdbId };

    // Ratings nur laden, wenn gefiltert wird (spart OMDb-Anfragen)
    if (hasRatingFilter) {
      const ratings = await fetchRatings(imdbId);
      movie.imdb_rating = ratings.imdbRating;
      movie.metascore = ratings.metascore;
    }
    return movie;
  });

  const all = await Promise.all(detailPromises);
  if (!hasRatingFilter) return all;

  // Titel ohne Rating fliegen raus, sobald ein Filter aktiv ist
  return all.filter(
    (m) => (m.imdb_rating ?? 0) >= minImdb && (m.metascore ?? 0) >= minMeta
  );
}
