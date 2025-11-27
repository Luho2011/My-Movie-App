'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


export async function addToWatchlist(prevState: unknown, formData: FormData) {
  const movieId = formData.get('movieId') as string;
  const title = formData.get('title') as string;
  const posterPath = formData.get('posterPath') as string;
  const imdbId = formData.get('imdbId') as string | null;
  const email = formData.get('email') as string;

  await prisma.watchlist.create({
    data: {
      movieId,
      title,
      posterPath,
      imdbId,   
      user: { connect: { email } },
    },
  });

  return { message: 'Film zur Watchlist hinzugefügt!' };
}



export async function removeFromWatchlist(_: unknown, formData: FormData) {
  const movieId = formData.get('movieId') as string;
  const email = formData.get('email') as string;

  await prisma.watchlist.deleteMany({
    where: {
      movieId: movieId,
      user: {
        email: email,
      },
    },
  });

  revalidatePath('/watchlist');
  return { message: 'Film entfernt.' };
}

