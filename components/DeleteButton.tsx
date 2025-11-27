'use client';
import React from 'react'
import { useActionState } from 'react';
import { removeFromWatchlist } from '@/app/actions/watchlist';
import { MovieAPI } from '@/types/movieAPI';

type Props = {
  movie: MovieAPI;
  userEmail: string;
};

export default function DeleteButton({ movie, userEmail }: Props) {
  const { id } = movie;
  const [, formAction] = useActionState(removeFromWatchlist, { message: '' });

  return (
    <form action={formAction} className="">
      <div className='relative'>
        <button type="submit" className="deleteButton">
          Delete
        </button>
      </div> 
      <input type="hidden" name="movieId" value={id} />
      <input type="hidden" name="email" value={userEmail} />
    </form>
  );
}
