'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getDetails } from '@/app/actions/details';
import type { Details } from '@/lib/fetchDetails';
import { MovieAPI } from '@/types/movieAPI';

type Props = {
  movie: MovieAPI;
  onClose: () => void;
};

export default function DetailModal({ movie, onClose }: Props) {
  const [details, setDetails] = useState<Details | null>(null);

  // Details laden
  useEffect(() => {
    getDetails(movie.media_type ?? 'movie', movie.id).then(setDetails);
  }, [movie.id, movie.media_type]);

  // Escape schließt das Fenster
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // imdb_id kommt meist erst mit den Details (wird auf der Startseite nicht vorab geladen)
  const imdbId = movie.imdb_id ?? details?.imdb_id;
  const imdbUrl = imdbId
    ? `https://www.imdb.com/title/${imdbId}/`
    : `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  // createPortal, damit das Fenster nicht in der (skalierten) Card hängt
  return createPortal(
    <div
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full min-w-0 max-w-3xl max-h-[90dvh] overflow-y-auto overflow-x-hidden hide-scrollbar bg-gray-900 border border-white/10 rounded-2xl"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Schließen"
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-white hover:text-black cursor-pointer transition"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {!details ? (
          <p className="p-10 text-center text-gray-300">Lädt…</p>
        ) : (
          <>
            {details.backdrop_path && (
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w780${details.backdrop_path}`}
                  alt={details.title}
                  className="block w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>
            )}

            <div className="p-6 flex flex-col gap-5">
              <div>
                <h2 className="text-3xl font-semibold text-white">{details.title}</h2>
                <p className="text-gray-400 mt-1">
                  {[
                    details.year,
                    details.runtime ? `${details.runtime} Min.` : null,
                    details.seasons ? `${details.seasons} Staffeln` : null,
                  ].filter(Boolean).join(' · ')}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {details.genres.map((g) => (
                    <span key={g} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {details.overview && <p className="text-gray-200">{details.overview}</p>}

              {details.trailerKey && (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${details.trailerKey}`}
                  title="Trailer"
                  allowFullScreen
                  className="w-full aspect-video rounded-xl"
                />
              )}

              {details.cast.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Besetzung</h3>
                  <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                    {details.cast.map((c) => (
                      <div key={c.name + c.character} className="flex-none w-24 text-center">
                        {c.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                            alt={c.name}
                            className="w-20 h-20 mx-auto rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 mx-auto rounded-full bg-white/10" />
                        )}
                        <p className="text-sm text-white mt-2">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details.providers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Streamen bei</h3>
                  <div className="flex flex-wrap gap-3">
                    {details.providers.map((p) => (
                      <img
                        key={p.name}
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.name}
                        title={p.name}
                        className="w-12 h-12 rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              <a
                href={imdbUrl}
                target="_blank"
                rel="noreferrer"
                className="self-start bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition"
              >
                Auf IMDb ansehen
              </a>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
