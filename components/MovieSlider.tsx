"use client";

import MovieCard from './MovieCard';
import { MovieAPI } from '@/types/movieAPI';
import { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type Props = {
  movies: MovieAPI[];
  userEmail: string;
  sectionName: string;
};

export default function MovieSlider({ movies, userEmail, sectionName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => containerRef.current?.scrollBy({ left: -500, behavior: 'smooth' });
  const scrollRight = () => containerRef.current?.scrollBy({ left: 500, behavior: 'smooth' });

  return (
    <div className="flex flex-col mb-10">
      <h2 className="text-2xl font-semibold text-white mb-2 px-6">
        {sectionName}
      </h2>

    <div className='relative group/slider'>
      <div ref={containerRef} className="overflow-x-auto hide-scrollbar flex gap-4 py-4 px-6 scroll-smooth">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none">
            <MovieCard movie={movie} userEmail={userEmail} />
          </div>
        ))}
      </div>

          {/* Verlauf an den Rändern */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 to-transparent" />

          <button
            onClick={scrollLeft}
            aria-label="Nach links scrollen"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 backdrop-blur border border-white/20
                      text-white hover:bg-white hover:text-black shadow-lg cursor-pointer opacity-0 group-hover/slider:opacity-100 transition duration-300"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <button
            onClick={scrollRight}
            aria-label="Nach rechts scrollen"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 backdrop-blur border border-white/20
                      text-white hover:bg-white hover:text-black shadow-lg cursor-pointer opacity-0 group-hover/slider:opacity-100 transition duration-300"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
      </div>
    </div>
  );
}
