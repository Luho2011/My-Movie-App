'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


export async function addToWatchlist(prevState: unknown, formData: FormData) {
  const movieId = formData.get('movieId') as string;
  const title = formData.get('title') as string;
  const posterPath = formData.get('posterPath') as string;
  let imdbId = (formData.get('imdbId') as string | null) || null;
  const email = formData.get('email') as string;
  const mediaType = (formData.get('mediaType') as string) || 'movie';

  // imdb_id wird auf der Startseite nicht vorab geladen → hier bei Bedarf nachholen
  if (!imdbId) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType === 'tv' ? 'tv' : 'movie'}/${movieId}/external_ids?api_key=${process.env.TMDB_API_KEY}`,
        { next: { revalidate: 86400 } }
      );
      const ext: { imdb_id?: string | null } = await res.json();
      imdbId = ext.imdb_id ?? null;
    } catch {
      imdbId = null;
    }
  }

  await prisma.watchlist.create({
    data: {
      movieId,
      title,
      posterPath,
      imdbId,
      mediaType,
      user: { connect: { email } },
    },
  });

  return { message: 'Film zur Watchlist hinzugefügt!' };
}



export async function removeFromWatchlist(_: unknown, formData: FormData) {
  const movieId = formData.get('movieId') as string;
  const email = formData.get('email') as string;
  const mediaType = (formData.get('mediaType') as string) || 'movie';

  await prisma.watchlist.deleteMany({
    where: {
      movieId: movieId,
      mediaType: mediaType,
      user: {
        email: email,
      },
    },
  });

  revalidatePath('/watchlist');
  return { message: 'Film entfernt.' };
}

