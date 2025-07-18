import GenreFilterClient from './GenreFilterClient'

export default async function GenreFilter() {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=de-DE&api_key=${apiKey}`
  );
  const data = await res.json();
  const genres = data.genres; // Array mit id + name

  return <GenreFilterClient genres={genres} />;
}