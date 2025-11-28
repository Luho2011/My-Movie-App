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
};

type Props = {
  searchParams: Promise<SearchParams>;
};

type Genre = {
  id: number;
  name: string;
};

function pickRandomGenres(genres: Genre[], count = 3) {
  return [...genres].sort(() => Math.random() - 0.5).slice(0, count);
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";

  const query = params.query?.trim() || "";
  const genre = params.genre || "";

  // Wenn query ODER genre aktiv ist → Movies suchen
  const movies: MovieAPI[] =
    query || genre ? await fetchMovies(query, genre) : [];

  // Genre-Slider nur laden, wenn NICHT gesucht wird
  const genreSections: { name: string; movies: MovieAPI[] }[] = [];

  if (!query && !genre) {
    const allGenres = await fetchGenres();
    const randomGenres = pickRandomGenres(allGenres, 7);

    for (const g of randomGenres) {
      const moviesByGenre = await fetchMoviesByGenre(g.id, 20);
      genreSections.push({
        name: g.name,
        movies: moviesByGenre,
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <NavBar />

      {/* Wenn Suchbegriff aktiv → Suchergebnisse anzeigen */}
      {(query || genre) && (
        <div className="flex flex-wrap justify-center gap-6 p-4 w-full">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} userEmail={email} />
          ))}
        </div>
      )}

      {/* Wenn KEINE Suche → Genre-Slider anzeigen */}
      {!query && !genre && (
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