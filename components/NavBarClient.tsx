"use client";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import SearchForm from "./SearchForm";
import GenreFilterClient from "./GenreFilterClient";


export default function NavBarClient({ session, genres }) {
    const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='bg-gray-950 flex justify-between items-center sticky py-2 top-0 h-15 w-full z-25 [@media(min-width:1075px)]:px-2'>
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
            <div className="absolute top-[62px] left-0">
                <Link href="/watchlist">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded border-1 hover:bg-blue-700 transition cursor-pointer">
                      Watchlist
                    </button>
                </Link>
                 <div className="">
                    <GenreFilterClient genres={genres}/>
                 </div>
            </div>
        )}
      </div>
   


      <Link href="/watchlist">
        <button className="[@media(max-width:1075px)]:hidden bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
          Watchlist
        </button>
      </Link>
        <div className='flex gap-10 items-center'>
          <div className="[@media(max-width:1075px)]:hidden">
            <GenreFilterClient genres={genres} />
          </div> 
            <div className="">
             <SearchForm/>
            </div> 
        </div>
      <div className='flex items-center gap-4'>
        <p className="[@media(max-width:925px)]:hidden text-xl">{session.user?.name}</p>
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
  )
}