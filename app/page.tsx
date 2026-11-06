import Link from 'next/link';
import { fetchMovies } from '@/lib/fetchMovies';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import MovieCard from '@/components/MovieCard';
import { MovieAPI } from '@/types/movieAPI';
import { fetchGenres } from '@/lib/fetchGenres';
import { fetchMoviesByGenre } from '@/lib/fetchMoviesByGenre';
import MovieSlider from '@/components/MovieSlider';

type SearchParams = {
  query?: string;
  genre?: string;
  type?: string;
  imdb?: string;
  meta?: string;
  pages?: string;
  sort?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

type Genre = {
  id: number;
  name: string;
};

// function für random genres
function pickRandomGenres(genres: Genre[], count = 3) {
  return [...genres].sort(() => Math.random() - 0.5).slice(0, count);
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";

  const query = params.query?.trim() || "";
  const genre = params.genre || "";
  // Filme oder Serien (?type=tv)
  const type = params.type === "tv" ? "tv" : "movie";

  // Mindest-Ratings (IMDb Rating, Metascore)
  const minImdb = Number(params.imdb) || 0;
  const minMeta = Number(params.meta) || 0;
  const isSearching = query || genre || minImdb || minMeta;

  // Wie viele Seiten geladen werden ("Mehr laden" erhöht ?pages)
  const pageCount = Math.min(Number(params.pages) || 1, 10);

  // Wenn query, genre ODER rating-filter aktiv ist → Movies suchen
  const { movies, hasMore }: { movies: MovieAPI[]; hasMore: boolean } = isSearching
    ? await fetchMovies(query, genre, type, minImdb, minMeta, pageCount, params.sort || "")
    : { movies: [], hasMore: false };

  // Link für "Mehr laden": aktuelle Params + eine Seite mehr
  const moreParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "pages") moreParams.set(key, value);
  }
  moreParams.set("pages", String(pageCount + 1));

  // Genre-Slider nur laden, wenn NICHT gesucht wird
  let genreSections: { name: string; movies: MovieAPI[] }[] = [];

  if (!isSearching) {
    const allGenres = await fetchGenres(type);
    const randomGenres = pickRandomGenres(allGenres, 7);

    // alle Genres gleichzeitig laden statt nacheinander
    genreSections = await Promise.all(
      randomGenres.map(async (g) => ({
        name: g.name,
        movies: await fetchMoviesByGenre(g.id, 20, type),
      }))
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <NavBar type={type} />

      {/* Wenn Suchbegriff aktiv → Suchergebnisse anzeigen */}
      {isSearching && (
        <div className="flex flex-wrap justify-center gap-6 p-4 w-full">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} userEmail={email} />
          ))}
        </div>
      )}

      {isSearching && hasMore && pageCount < 10 && (
        <Link
          href={`/?${moreParams.toString()}`}
          scroll={false}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition mb-8"
        >
          Mehr laden
        </Link>
      )}

      {/* Wenn KEINE Suche → Genre-Slider anzeigen */}
      {!isSearching && (
        <div className="flex flex-col w-full">
          {genreSections.map((section) => (
            <MovieSlider
              key={section.name}
              movies={section.movies}
              userEmail={email}
              sectionName={section.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}