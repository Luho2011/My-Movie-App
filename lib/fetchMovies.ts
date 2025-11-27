
export async function fetchMovies(query?: string, genre?: string) {
    const apiKey = process.env.TMDB_API_KEY;
    
    let url = '';
      if (query) {
     url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    } else if (genre) {
     url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&api_key=${apiKey}&language=de-DE`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    const movies = data.results;

    const detailPromises = movies.map(async (m: any) => {
    const r2 = await fetch(`https://api.themoviedb.org/3/movie/${m.id}/external_ids?api_key=${apiKey}`);
    const ext = await r2.json();
    // kopie von movie objekt und mögliche imdb_id dranhängen
    return { ...m, imdb_id: ext.imdb_id ?? null };
    });

    const moviesWithImdb = await Promise.all(detailPromises);
    return moviesWithImdb; // jedes Objekt hat nun ggf. imdb_id
}

