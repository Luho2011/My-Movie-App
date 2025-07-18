'use client';
import React from 'react'
import { useActionState } from 'react';
import { removeFromWatchlist } from '@/app/actions/watchlist';
import { WatchlistDB } from '@/types/watchlistDB';

type Props = {
  movie: WatchlistDB;
  email: string;
};


export default function DeleteButton({ movie, email }: Props) {
  const { movieId, title, posterPath } = movie;
  const [, formAction] = useActionState(removeFromWatchlist, { message: '' });

  return (
    <form action={formAction} className="group p-3 rounded w-60 relative transition-transform duration-300 hover:scale-110">
     <div className='relative'>
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          className="mt-2 rounded"
        />
          <button
            type="submit"
            className="deleteButton"
          >
            Delete
          </button>
     </div> 
      <input type="hidden" name="movieId" value={movieId} />
      <input type="hidden" name="email" value={email} />
    </form>
  );
}