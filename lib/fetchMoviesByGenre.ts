// Startseite movies fetchen per Genres
export async function fetchMoviesByGenre(genreId: number, limit = 6) {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=de-DE&with_genres=${genreId}&sort_by=popularity.desc`
  );

  const data = await res.json();
  const movies = data.results.slice(0, limit);

  const detailPromises = movies.map(async (m: any) => {
  const r2 = await fetch(`https://api.themoviedb.org/3/movie/${m.id}/external_ids?api_key=${apiKey}`);
  const ext = await r2.json();
  // kopie von movie objekt und mögliche imdb_id dranhängen
  return { ...m, imdb_id: ext.imdb_id ?? null };
  });

  const moviesWithImdb = await Promise.all(detailPromises);
  return moviesWithImdb; // jedes Objekt hat nun ggf. imdb_id
}
