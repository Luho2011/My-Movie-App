'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 text-white">
      <h2 className="text-xl">Etwas ist schiefgelaufen</h2>
      <button
        onClick={() => reset()}
        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition"
      >
        Nochmal versuchen
      </button>
    </div>
  );
}
