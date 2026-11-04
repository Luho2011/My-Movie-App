'use server';
import { fetchDetails } from '@/lib/fetchDetails';
import type { MediaType } from '@/types/movieAPI';

// Server Action, damit der TMDB-Key auf dem Server bleibt
export async function getDetails(type: MediaType, id: number) {
  return fetchDetails(type, id);
}
