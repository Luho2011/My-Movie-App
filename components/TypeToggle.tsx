'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MediaType } from '@/types/movieAPI';

export default function TypeToggle({ type }: { type: MediaType }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  // query behalten, genre nicht (Genre-IDs sind bei Filmen und Serien unterschiedlich)
  const queryParam = query ? `query=${encodeURIComponent(query)}` : "";
  const movieHref = queryParam ? `/?${queryParam}` : "/";
  const tvHref = queryParam ? `/?type=tv&${queryParam}` : "/?type=tv";

  return (
    <div className="flex rounded overflow-hidden [@media(max-width:1075px)]:border-1">
      <Link
        href={movieHref}
        className={`${type === "movie" ? "bg-blue-800" : "bg-blue-600"} text-white px-4 py-2 hover:bg-blue-700 transition cursor-pointer`}
      >
        Filme
      </Link>
      <Link
        href={tvHref}
        className={`${type === "tv" ? "bg-blue-800" : "bg-blue-600"} text-white px-4 py-2 hover:bg-blue-700 transition cursor-pointer`}
      >
        Serien
      </Link>
    </div>
  );
}
