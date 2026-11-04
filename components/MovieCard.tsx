'use client';
import { useActionState } from 'react';
import { addToWatchlist } from '@/app/actions/watchlist';
import React from 'react';
import { MovieAPI } from '@/types/movieAPI';
import DeleteButton from './DeleteButton';
import DetailModal from './DetailModal';

type Props = {
  movie: MovieAPI;
  userEmail: string;
  isWatchlist?: boolean;
};

export default function MovieCard({ movie, userEmail, isWatchlist }: Props) {
  const { id, title, poster_path } = movie;
  const [state, formAction] = useActionState(addToWatchlist, { message: '' });
  const [showMessage, setShowMessage] = React.useState(false);
  const [open, setOpen] = React.useState(false);

   React.useEffect(() => {
    if (state.message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.message]);

  return (
    <>
      <div onClick={() => setOpen(true)} className='cursor-pointer group w-52 rounded-xl overflow-hidden shadow-lg shadow-black/40 transition duration-300 hover:scale-105 hover:z-10 relative'>
        {poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            className="block w-full aspect-[2/3] object-cover"
          />
        )}
        {/* Dunkler Verlauf, damit der Button beim Hover gut lesbar ist */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        {/* Ratings (nur sichtbar, wenn nach Rating gefiltert wird) */}
        {(movie.imdb_rating || movie.metascore) && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
            {movie.imdb_rating && <span>⭐ {movie.imdb_rating}</span>}
            {movie.metascore && <span className="ml-2">MC {movie.metascore}</span>}
          </div>
        )}
        {/* Prüfen, ob movie schon in watchlist ist, dann deletebutton anzeigen...sonst addbutton */}
        {isWatchlist ? (
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteButton movie={movie} userEmail={userEmail} />
          </div>
        ) : (
          <form action={formAction} onClick={(e) => e.stopPropagation()} className="absolute bottom-2 left-1/2 -translate-x-1/2">
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
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm px-3 py-1 rounded-full shadow transition">
            Movie added!
          </div>
        )}
      </div>

      {open && <DetailModal movie={movie} onClose={() => setOpen(false)} />}
    </>
  );
}