'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // query aus url lesen
  const currentQuery = searchParams.get("query") || "";
  const [input, setInput] = useState(currentQuery);
  const isTv = searchParams.get("type") === "tv";

  //live suche mit liveupdates der angezeigen Filme
  useEffect(() => {
    const timeout = setTimeout(() => {
      const cleaned = input.trim();

      // verhindern, dass wir immer wieder das Gleiche in die URL pushen
      if (cleaned === currentQuery) return;

      //aktuelle url holen, welche leer ist
      const params = new URLSearchParams(searchParams.toString());

      if (cleaned.length > 0) {
        //params: setzt query in url
        params.set("query", cleaned);
      } else {
        params.delete("query");
      }

      router.replace(`/?${params.toString()}`); // replace = kein Browser-History-Spam, aktualisiert url
    }, 300);

    return () => clearTimeout(timeout);
  }, [input, currentQuery, router, searchParams]);

  return (
    <div className="justify-center">
      <input
        className="[@media(max-width:750px)]:w-[250px] h-[41px] w-[500px] pl-4 pr-4 py-1 border rounded-2xl border-gray-300 focus:outline-none"
        placeholder={isTv ? "Search Series..." : "Search Movie..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

