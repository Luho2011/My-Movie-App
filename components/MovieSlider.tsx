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
    <div className="flex flex-col w-full mb-10 mx-auto relative">
      <h2 className="text-3xl font-semibold text-gray mb-4 text-left [@media(max-width:1575px)]:text-center">
        {sectionName}
      </h2>

      <button
        onClick={scrollLeft}
        className="absolute left-0 border-2 border-white h-10 w-10 top-1/2 -translate-y-1/2 z-10 bg-gray-600/75 rounded-full 
                   p-2 shadow-md transition-transform duration-300 hover:scale-150 cursor-pointer text-white"
      >
        ◀
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-[-5px] border-2 border-white h-10 w-10 top-1/2 -translate-y-1/2 z-10 bg-gray-600/75 rounded-full 
                  p-2 shadow-md transition-transform duration-300 hover:scale-150 cursor-pointer text-white"
      >
        ▶
      </button>

      <div ref={containerRef} className="overflow-x-auto hide-scrollbar flex gap-4 h-[450px] scroll-smooth">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none">
            <MovieCard movie={movie} userEmail={userEmail} />
          </div>
        ))}
      </div>
    </div>
  );
}
