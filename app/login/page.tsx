"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl">Du bist nicht eingeloggt</p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
      >
        Login mit Google
      </button>

      <button
        onClick={() =>
          signIn("credentials", {
            email: "demo@example.com",
            password: "demo123",
            callbackUrl: "/watchlist",
          })
        }
        className="border px-6 py-2 rounded shadow hover:bg-gray-100 transition cursor-pointer"
      >
        Demo Login
      </button>
    </div>
  );
}