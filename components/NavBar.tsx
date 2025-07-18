import React from 'react'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SearchForm from './SearchForm'
import GenreFilter from './GenreFilter'


export default async function NavBar() {
   const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); 
  }

  return (
    <div className='bg-gray-950 flex justify-between items-center sticky top-0 h-15 w-full p-2 z-10'>
      <Link href="/watchlist">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
          Watchlist
        </button>
      </Link>
        <div className='flex gap-10 items-center'>
          <GenreFilter/>
          <SearchForm/>
        </div>
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
  )
}
