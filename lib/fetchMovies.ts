import type { MovieAPI, MediaType } from "@/types/movieAPI";

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
  type: MediaType = "movie"
): Promise<MovieAPI[]> {
  const apiKey = process.env.TMDB_API_KEY;

  // dynamische url je nachdem ob per query oder genre gesucht wird (type = movie oder tv)
  let url = "";
  if (query) {
    url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
  } else if (genre) {
    url = `https://api.themoviedb.org/3/discover/${type}?with_genres=${genre}&api_key=${apiKey}&language=de-DE`;
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data: TMDBListResponse = await res.json();
  const movies = data.results;

  const detailPromises = movies.map(async (m): Promise<MovieAPI> => {
    // fetche alle von tmdb bereitgestellten external ids (imdb_id)
    const r2 = await fetch(
      `https://api.themoviedb.org/3/${type}/${m.id}/external_ids?api_key=${apiKey}`
    );
    // in ext die imdb_id speichern und im spread operator anhängen
    const ext: { imdb_id: string | null } = await r2.json();
    return { ...m, title: m.title ?? m.name, media_type: type, imdb_id: ext.imdb_id ?? null };
  });

  return Promise.all(detailPromises);
}
