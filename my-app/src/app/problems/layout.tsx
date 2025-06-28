"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center backdrop-blur bg-white/70 dark:bg-gray-900/70 shadow-sm">
        <Link
          href="/problems"
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
        >
          CodeCrack
        </Link>
        <div className="flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <span className="hidden md:block text-sm">Hi, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition duration-200 focus:outline-none focus:ring focus:ring-red-300"
              >
                Sign Out
              </button>
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border shadow-sm ring-2 ring-blue-400"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700" />
              )}
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="px-4 py-8 max-w-full mx-auto">{children}</main>
    </div>
  );
}
