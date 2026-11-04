export type Ratings = {
  imdbRating: number | null;
  metascore: number | null;
};

// "N/A" von OMDb in null umwandeln
function toNumber(value?: string): number | null {
  return value && value !== "N/A" ? Number(value) : null;
}

// IMDb Rating + Metascore über OMDb holen (1 Anfrage pro Titel, 1 Tag gecacht)
export async function fetchRatings(imdbId: string | null): Promise<Ratings> {
  if (!imdbId) return { imdbRating: null, metascore: null };

  const res = await fetch(
    `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();

  return {
    imdbRating: toNumber(data.imdbRating),
    metascore: toNumber(data.Metascore),
  };
}
