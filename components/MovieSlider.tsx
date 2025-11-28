"use client";

import MovieCard from './MovieCard';
import { MovieAPI } from '@/types/movieAPI';
import { useRef } from 'react';

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
    <div className="flex flex-col mb-10 px-30 bg-black/10">
      <h2 className="text-3xl font-semibold text-gray mb-4 text-left [@media(max-width:1575px)]:text-center">
        {sectionName}
      </h2>

    <div className='relative group/slider'>
      <div ref={containerRef} className="overflow-x-auto hide-scrollbar flex h-[450px] scroll-smooth">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none">
            <MovieCard movie={movie} userEmail={userEmail} />
          </div>
        ))}
      </div>
          <button
            onClick={scrollLeft}
            className="absolute left-0 h-35 w-12 top-[45%] -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-800/90 rounded-r-2xl 
                      p-2 shadow-md cursor-pointer text-white opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
          >
            ◀
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 h-35 w-12 top-[45%] -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-800/90 rounded-l-2xl 
                      p-2 shadow-md cursor-pointer text-white opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
          >
            ▶
          </button>
      </div>
    </div>
  );
}
