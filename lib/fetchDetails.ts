import type { MediaType } from "@/types/movieAPI";

export type Details = {
  title: string;
  imdb_id: string | null;
  year: string | null;
  genres: string[];
  overview: string | null;
  backdrop_path: string | null;
  runtime: number | null; // Filme (Minuten)
  seasons: number | null; // Serien
  trailerKey: string | null;
  cast: { name: string; character: string; profile_path: string | null }[];
  providers: { name: string; logo_path: string }[];
};

// Details zu Film/Serie in einer Anfrage holen (Trailer, Cast, Streaming-Anbieter)
export async function fetchDetails(type: MediaType, id: number): Promise<Details> {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=de-DE&append_to_response=videos,credits,watch/providers,external_ids&include_video_language=de,en`,
    { next: { revalidate: 3600 } }
  );
  const d = await res.json();

  const trailer = (d.videos?.results ?? []).find(
    (v: { site: string; type: string }) => v.site === "YouTube" && v.type === "Trailer"
  );
  const date: string | undefined = d.release_date || d.first_air_date;

  return {
    title: d.title ?? d.name,
    imdb_id: d.imdb_id ?? d.external_ids?.imdb_id ?? null,
    year: date ? date.slice(0, 4) : null,
    genres: (d.genres ?? []).map((g: { name: string }) => g.name),
    overview: d.overview || null,
    backdrop_path: d.backdrop_path ?? null,
    runtime: d.runtime ?? null,
    seasons: d.number_of_seasons ?? null,
    trailerKey: trailer?.key ?? null,
    cast: (d.credits?.cast ?? []).slice(0, 8).map(
      (c: { name: string; character: string; profile_path: string | null }) => ({
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
      })
    ),
    providers: (d["watch/providers"]?.results?.DE?.flatrate ?? []).map(
      (p: { provider_name: string; logo_path: string }) => ({
        name: p.provider_name,
        logo_path: p.logo_path,
      })
    ),
  };
}
