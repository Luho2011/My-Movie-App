import type { MediaType } from "@/types/movieAPI";

export async function fetchGenres(type: MediaType = "movie") {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/genre/${type}/list?language=de-DE&api_key=${apiKey}`,
    // Genres ändern sich praktisch nie → 1 Tag cachen
    { next: { revalidate: 86400 } }
  );

  const data = await res.json();
  return data.genres || [];
}
