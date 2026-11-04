'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MediaType } from '@/types/movieAPI';

type Genre = {
  id: number;
  name: string;
};

export default function GenreFilterClient({ genres, type = 'movie' }: { genres: Genre[]; type?: MediaType }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Rating-Filter beim Genre-Wechsel behalten
  const ratingParams = ['imdb', 'meta']
    .filter((key) => searchParams.get(key))
    .map((key) => `&${key}=${searchParams.get(key)}`)
    .join('');

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative inline-block"
    >
      <button className="bg-blue-600 text-white px-[22px] py-2 rounded [@media(max-width:1075px)]:border-1 hover:bg-blue-700 transition cursor-pointer">
        Genres
      </button>

      {open && (
        <div className="absolute left-0 mt-0 bg-black shadow-md rounded p-2 space-y-1 z-10">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/?genre=${genre.id}${type === 'tv' ? '&type=tv' : ''}${ratingParams}`}
              className="block px-2 py-1 hover:bg-gray-800 rounded text-white"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}