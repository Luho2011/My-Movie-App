'use client';
import Image from 'next/image'
import { useActionState } from 'react';
import { addToWatchlist } from '@/app/actions/watchlist';
import React from 'react';
import { MovieAPI } from '@/types/movieAPI';

type Props = {
  movie: MovieAPI;
  userEmail: string;
};

export default function MovieCard({ movie, userEmail }: Props) {
  const { id, title, poster_path } = movie;
  const [state, formAction] = useActionState(addToWatchlist, { message: '' });
  const [showMessage, setShowMessage] = React.useState(false);

   React.useEffect(() => {
    if (state.message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.message]);

  return (
  <form action={formAction} className="group p-3 rounded w-60 transition-transform duration-300 hover:scale-110">
        {poster_path && (
          <div className='relative'>
            <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={movie.title}
              className="mt-2 rounded"
            />

            <button
              type="submit"
              className="addButton"
            >
              Add to Watchlist
            </button>
              {showMessage && (
                <div className="absolute top-25 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm p-2 rounded shadow transition">
              <h1>Movie added!</h1>
            </div>
            )}
          </div>
          
        )}
        <input type="hidden" name="movieId" value={id} />
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="posterPath" value={poster_path ?? ''} />
        <input type="hidden" name="email" value={userEmail} />
      </form>
  );
}