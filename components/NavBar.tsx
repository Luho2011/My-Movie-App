import React from 'react'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NavBarClient from "./NavBarClient";



export default async function NavBar() {
   const session = await getServerSession(authOptions);
   

  if (!session) {
    redirect("/login"); 
  }

  const apiKey = process.env.TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=de-DE&api_key=${apiKey}`
  );

  const data = await res.json();
  const genres = data.genres || [];

  return <NavBarClient session={session} genres={genres} />;

}
