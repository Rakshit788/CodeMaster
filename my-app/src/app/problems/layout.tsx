"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      {/* Navbar */}
      <header className="w-full border-b border-[#1f1f1f] px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-[#0d0d0d] backdrop-blur-md shadow-md">
        <Link
          href="/problems"
          className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          CodeMaster
        </Link>

        <div className="flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <span className="hidden md:block text-sm text-gray-400">
                Hi, {session.user?.name?.split(" ")[0]}
              </span>
              <Button
                onClick={() => signOut()}
                variant="bordered"
                size="sm"
                className="border-pink-400 text-pink-400 hover:bg-pink-500 hover:text-white transition"
              >
                Sign Out
              </Button>
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  onClick={() => router.push("/profile")}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-pink-400 shadow-sm cursor-pointer hover:scale-105 transition"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-700" />
              )}
            </>
          ) : (
            <Button
              onClick={() => signIn("github")}
              variant="bordered"
              size="sm"
              className="border-pink-400 text-pink-400 hover:bg-pink-500 hover:text-white transition"
            >
              Sign In with GitHub
            </Button>
          )}
        </div>
      </header>

      {/* Full-width page content */}
      <main className="w-full h-full">{children}</main>
    </div>
  );
}
