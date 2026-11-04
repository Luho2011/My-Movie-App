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
      <button className="bg-white/10 text-white px-[22px] py-2 rounded-full hover:bg-white/20 transition cursor-pointer">
        Genres
      </button>

      {open && (
        <div className="absolute left-0 mt-0 bg-gray-900 border border-white/10 shadow-xl rounded-xl p-2 space-y-1 z-10">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/?genre=${genre.id}${type === 'tv' ? '&type=tv' : ''}${ratingParams}`}
              className="block px-2 py-1 hover:bg-white/10 rounded-lg text-white"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}