import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { WatchlistDB } from '@/types/watchlistDB';
import DeleteButton from '@/components/DeleteButton';


export default async function WatchlistPage() {
    const session = await getServerSession(authOptions);
    
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
      <div className='bg-gray-950 flex justify-between sticky top-0 h-15 w-full p-2 z-10'>
        <Link href="/search">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
            Homepage
          </button>
        </Link>
            <div className='flex items-center gap-4'>
            <p className="text-xl ">{session.user?.name}</p>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
      </div>
       
      <div className="flex flex-wrap justify-center gap-3 p-2 mt-8">
        {watchlist.map((movie) => (
          <DeleteButton
            key={movie.id}
            movie={movie}
            email={email}
          />
        ))}
      </div> 
    </div>
  );
}

