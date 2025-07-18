
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
    return data.results;
}
