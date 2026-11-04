'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function RatingFilterClient() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wert in url setzen (leer = Filter entfernen), alle anderen params bleiben
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('pages'); // neuer Filter startet wieder bei Seite 1
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative inline-block"
    >
      <button className="bg-white/10 text-white px-[22px] py-2 rounded-full hover:bg-white/20 transition cursor-pointer">
        Ratings
      </button>

      {open && (
        <div className="absolute left-0 mt-0 bg-gray-900 border border-white/10 shadow-xl rounded-xl p-3 space-y-3 z-10 w-48 text-white">
          <label className="block">
            IMDb ab
            <select
              value={searchParams.get('imdb') || ''}
              onChange={(e) => setParam('imdb', e.target.value)}
              className="block w-full mt-1 bg-gray-800 rounded px-2 py-1"
            >
              <option value="">Alle</option>
              <option value="6">6+</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
              <option value="9">9+</option>
            </select>
          </label>
          <label className="block">
            Metascore ab
            <select
              value={searchParams.get('meta') || ''}
              onChange={(e) => setParam('meta', e.target.value)}
              className="block w-full mt-1 bg-gray-800 rounded px-2 py-1"
            >
              <option value="">Alle</option>
              <option value="50">50+</option>
              <option value="60">60+</option>
              <option value="70">70+</option>
              <option value="80">80+</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
