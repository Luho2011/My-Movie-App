'use client';
import { useActionState } from 'react';
import { addToWatchlist } from '@/app/actions/watchlist';
import React from 'react';
import { MovieAPI } from '@/types/movieAPI';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

type Props = {
  movie: MovieAPI;
  userEmail: string;
  isWatchlist?: boolean;
};

export default function MovieCard({ movie, userEmail, isWatchlist }: Props) {
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

  //Imdb link entweder nach id oder titel des films...unten als link aufrufen
  const imdbUrl = movie.imdb_id
  ? `https://www.imdb.com/title/${movie.imdb_id}/`
  : `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;


  return (
    <Link href={imdbUrl} target="_blank">
      <div className='group p-3 rounded w-60 transition-transform duration-300 hover:scale-110 relative'>
        {poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            className="mt-2 rounded h-[350px]"
          />
        )}
        {/* Ratings (nur sichtbar, wenn nach Rating gefiltert wird) */}
        {(movie.imdb_rating || movie.metascore) && (
          <div className="absolute top-4 left-5 bg-black/70 text-white text-sm px-2 py-1 rounded">
            {movie.imdb_rating && <span>⭐ {movie.imdb_rating}</span>}
            {movie.metascore && <span className="ml-2">MC {movie.metascore}</span>}
          </div>
        )}
        {/* Prüfen, ob movie schon in watchlist ist, dann deletebutton anzeigen...sonst addbutton */}
        {isWatchlist ? (
          <DeleteButton movie={movie} userEmail={userEmail} />
        ) : (
          <form action={formAction} className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <button type="submit" className="addButton">
              Add to Watchlist
            </button>
            <input type="hidden" name="movieId" value={id} />
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="posterPath" value={poster_path ?? ''} />
            <input type="hidden" name="email" value={userEmail} />
            <input type="hidden" name="imdbId" value={movie.imdb_id ?? ''} />
            <input type="hidden" name="mediaType" value={movie.media_type ?? 'movie'} />
          </form>
        )}

        {showMessage && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm p-2 rounded shadow transition">
            Movie added!
          </div>
        )}
      </div>
    </Link>
  );
}