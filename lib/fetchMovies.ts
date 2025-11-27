// types for TMDB responses
export type MovieBasic = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
};

export type MovieWithImdb = MovieBasic & {
  imdb_id: string | null;
};

type TMDBListResponse = {
  results: MovieBasic[];
};

export async function fetchMovies(
  query?: string,
  genre?: string
): Promise<MovieWithImdb[]> {
  const apiKey = process.env.TMDB_API_KEY;

  let url = "";
  if (query) {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
  } else if (genre) {
    url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&api_key=${apiKey}&language=de-DE`;
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data: TMDBListResponse = await res.json();
  const movies = data.results;

  const detailPromises = movies.map(async (m): Promise<MovieWithImdb> => {
    const r2 = await fetch(
      `https://api.themoviedb.org/3/movie/${m.id}/external_ids?api_key=${apiKey}`
    );
    const ext: { imdb_id: string | null } = await r2.json();
    return { ...m, imdb_id: ext.imdb_id ?? null };
  });

  return Promise.all(detailPromises);
}


