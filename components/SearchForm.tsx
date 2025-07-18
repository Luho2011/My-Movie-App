'use client';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from 'react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function SearchForm() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    router.push(`/search?query=${encodeURIComponent(input.trim())}`);
  };

  return (
      <form onSubmit={handleSubmit} className="flex">
      <input
        placeholder="Search Movies..."
        value ={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 border rounded-l-2xl border-gray-300 w-full focus:outline-none"
      />
      <button
        type="submit"
        className="px-5 py-3 bg-blue-600 text-white rounded-r-2xl border-r-0 hover:bg-blue-700 cursor-pointer"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  )
}
