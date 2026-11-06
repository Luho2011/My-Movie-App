import { safeFetchJson } from "./safeFetchJson";

export type Ratings = {
  imdbRating: number | null;
  metascore: number | null;
};

// "N/A" von OMDb in null umwandeln
function toNumber(value?: string): number | null {
  if (!value || value === "N/A") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

// IMDb Rating + Metascore über OMDb holen (1 Anfrage pro Titel, 1 Tag gecacht)
export async function fetchRatings(imdbId: string | null): Promise<Ratings> {
  if (!imdbId) return { imdbRating: null, metascore: null };

  const data = await safeFetchJson<{
    Response?: string;
    imdbRating?: string;
    Metascore?: string;
  }>(`https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`, {
    next: { revalidate: 86400 },
  });

  // Fehler oder z.B. "Request limit reached!" → keine Ratings
  if (!data || data.Response === "False") return { imdbRating: null, metascore: null };

  return {
    imdbRating: toNumber(data.imdbRating),
    metascore: toNumber(data.Metascore),
  };
}
