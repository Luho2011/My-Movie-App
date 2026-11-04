// Wird sofort angezeigt, während die Startseite auf dem Server lädt
export default function Loading() {
  return (
    <div className="flex flex-col w-full pt-24 animate-pulse">
      {Array.from({ length: 3 }).map((_, row) => (
        <div key={row} className="flex flex-col mb-10">
          <div className="h-7 w-40 bg-white/10 rounded mb-4 mx-6" />
          <div className="flex gap-4 px-6 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-none w-52 aspect-[2/3] bg-white/10 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
