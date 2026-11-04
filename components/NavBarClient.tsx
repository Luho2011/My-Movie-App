"use client";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import SearchForm from "./SearchForm";
import GenreFilterClient from "./GenreFilterClient";
import { Session } from "next-auth";
import TypeToggle from "./TypeToggle";
import RatingFilterClient from "./RatingFilterClient";
import { MediaType } from "@/types/movieAPI";

type NavBarClientProps = {
  session: Session | null;
  genres: { id: number; name: string }[];
  type: MediaType;
}

export default function NavBarClient({ session, genres, type }: NavBarClientProps) {
    const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='bg-gray-950/90 backdrop-blur-md border-b border-white/10 flex justify-between items-center sticky py-2 top-0 h-15 w-full z-25 [@media(min-width:1075px)]:px-2'>
      {/* --- MOBILE HEADER --- */}
     <div className="relative left-0 flex px-4 h-16 [@media(min-width:1075px)]:hidden">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menü öffnen"
        className="text-white cursor-pointer"
      >
        {menuOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <Bars3Icon className="h-8 w-8" />
        )}
      </button>
        {menuOpen && (
            <div className="absolute top-[62px] left-0 flex flex-col gap-3 p-3 rounded-xl bg-gray-950/95 backdrop-blur-md border border-white/10 shadow-xl shadow-black/60">
                <Link href="/watchlist">
                    <button className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition cursor-pointer">
                      Watchlist
                    </button>
                </Link>
                 <div className="">
                    <TypeToggle type={type} />
                 </div>
                 <div className="">
                    <GenreFilterClient genres={genres} type={type} />
                 </div>
                 <div className="">
                    <RatingFilterClient />
                 </div>
            </div>
        )}
      </div>
   


      <Link href="/watchlist">
        <button className="[@media(max-width:1075px)]:hidden bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition cursor-pointer">
          Watchlist
        </button>
      </Link>
        <div className='flex gap-10 items-center'>
          <div className="[@media(max-width:1075px)]:hidden flex gap-4">
            <TypeToggle type={type} />
            <GenreFilterClient genres={genres} type={type} />
            <RatingFilterClient />
          </div>
            <div className="">
             <SearchForm/>
            </div> 
        </div>
      <div className='flex items-center gap-4'>
       {session ? (
        <>
        <p className="[@media(max-width:925px)]:hidden text-xl">{session.user?.name}</p>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="bg-red-500/90 text-white px-6 py-2 rounded-full hover:bg-red-500 transition cursor-pointer"
          >
            Logout
          </button>
        </form>
        </>
       ) : (
          <Link href="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition cursor-pointer">
              Login
            </button>
          </Link>
       )} 
      </div>

    </div>
  )
}