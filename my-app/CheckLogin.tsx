// components/AuthWrapper.tsx
'use client';

import { signIn, useSession } from "next-auth/react";
import React from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  const isAuthenticated = status === "authenticated";

  return (
    <div className="relative">
      <div className={`${!isAuthenticated ? "blur-sm pointer-events-none" : ""}`}>
        {children}
      </div>

      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-10">
          <div className="text-white text-center p-8 bg-gray-900 bg-opacity-75 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Please sign in to continue</h2>
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
