import { fetchMovies } from '@/lib/fetchMovies';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import MovieCard from '@/components/MovieCard';
import { MovieAPI } from '@/types/movieAPI';

type SearchParams = {
  query?: string;
  genre?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};


export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";

  const query = params.query?.trim();
  const genre = params.genre;

  const movies: MovieAPI[] = query || genre ? await fetchMovies(query, genre) : [];
 
  return (
     <div className="flex flex-col items-center h-screen gap-4">
      <NavBar />
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} userEmail={email} />
        ))}
      </div>
    </div>
  );
}
