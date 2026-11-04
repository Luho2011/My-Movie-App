'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MediaType } from '@/types/movieAPI';

export default function TypeToggle({ type }: { type: MediaType }) {
  const searchParams = useSearchParams();

  // query und ratings behalten, genre nicht (Genre-IDs sind bei Filmen und Serien unterschiedlich)
  const params = new URLSearchParams();
  for (const key of ["query", "imdb", "meta"]) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }
  const movieHref = `/?${params.toString()}`;
  params.set("type", "tv");
  const tvHref = `/?${params.toString()}`;

  return (
    <div className="flex bg-white/10 rounded-full p-1">
      <Link
        href={movieHref}
        className={`${type === "movie" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"} px-4 py-1 rounded-full transition cursor-pointer`}
      >
        Filme
      </Link>
      <Link
        href={tvHref}
        className={`${type === "tv" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"} px-4 py-1 rounded-full transition cursor-pointer`}
      >
        Serien
      </Link>
    </div>
  );
}
