import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { WatchlistDB } from '@/types/watchlistDB';
import MovieCard from "@/components/MovieCard";

export default async function WatchlistPage() {
    const session = await getServerSession(authOptions);
    
    // Nur für logged in users
      if (!session) {
        redirect("/login"); 
      }

    const email = session.user.email!;

    const watchlist: WatchlistDB[] = await prisma.watchlist.findMany({
        where: {
          user: {
            email,
          },
        },
    });

  return (
    <div>
      <div className='bg-gray-950/80 backdrop-blur-md border-b border-white/10 flex justify-between sticky top-0 h-15 w-full p-2 z-10'>
        <Link href="/">
          <button className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition cursor-pointer">
            Homepage
          </button>
        </Link>
            <div className='flex items-center gap-4'>
            <p className="text-xl ">{session.user?.name}</p>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="bg-red-500/90 text-white px-6 py-2 rounded-full hover:bg-red-500 transition cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
      </div>

     <div className="flex flex-col items-center mt-5">
      <h1 className="text-4xl font-semibold text-white mb-5">Meine Watchlist</h1>
        <div className="flex flex-wrap justify-center gap-6 p-4 mt-8">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={{
                id: Number(movie.movieId), // TMDB-ID
                title: movie.title,
                poster_path: movie.poster_path ?? movie.posterPath ?? null,
                imdb_id: movie.imdbId ?? null,
                media_type: movie.mediaType === 'tv' ? 'tv' : 'movie',              }}
              userEmail={email}
              isWatchlist={true}
            />
          ))}
        </div> 
      </div>
    </div>
  );
}

