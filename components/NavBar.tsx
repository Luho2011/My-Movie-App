import React from 'react'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import NavBarClient from "./NavBarClient";
import { fetchGenres } from '@/lib/fetchGenres';
import { MediaType } from '@/types/movieAPI';


export default async function NavBar({ type }: { type: MediaType }) {
  const session = await getServerSession(authOptions);

  // Genres passend zu Filme oder Serien
  const genres = await fetchGenres(type);

  return <NavBarClient session={session} genres={genres} type={type} />;

}
