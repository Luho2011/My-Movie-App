import type { MovieAPI, MediaType } from "@/types/movieAPI";
import { fetchRatings } from "./fetchRatings";

// Serien haben bei TMDB "name" statt "title"
type TMDBListResponse = {
  results: (Omit<MovieAPI, "imdb_id"> & { name?: string })[];
  total_pages: number;
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
  minMeta = 0,
  pageCount = 1
): Promise<{ movies: MovieAPI[]; hasMore: boolean }> {
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

  // mit Rating-Filter pro Schritt 2 Seiten laden, weil danach aussortiert wird
  const pageTotal = hasRatingFilter ? pageCount * 2 : pageCount;
  const pages = Array.from({ length: pageTotal }, (_, i) => i + 1);
  const responses = await Promise.all(
    pages.map(async (page): Promise<TMDBListResponse> => {
      const res = await fetch(`${url}&page=${page}`, { next: { revalidate: 3600 } });
      return res.json();
    })
  );
  // doppelte Titel über mehrere Seiten entfernen
  const movies = responses
    .flatMap((r) => r.results)
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
  // gibt es noch weitere Seiten, die man nachladen kann?
  const hasMore = pageTotal < responses[0].total_pages;

  const detailPromises = movies.map(async (m): Promise<MovieAPI> => {
    // fetche alle von tmdb bereitgestellten external ids (imdb_id)
    const r2 = await fetch(
      `https://api.themoviedb.org/3/${type}/${m.id}/external_ids?api_key=${apiKey}`,
      { next: { revalidate: 3600 } }
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
  if (!hasRatingFilter) return { movies: all, hasMore };

  // Titel ohne Rating fliegen raus, sobald ein Filter aktiv ist
  return {
    movies: all.filter(
      (m) => (m.imdb_rating ?? 0) >= minImdb && (m.metascore ?? 0) >= minMeta
    ),
    hasMore,
  };
}
