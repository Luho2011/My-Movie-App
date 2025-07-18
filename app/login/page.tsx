"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl">Du bist nicht eingeloggt</p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/search" })}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
      >
        Login mit Google
      </button>
    </div>
  );
}