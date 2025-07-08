"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spotlight } from "./components/ui/background-lines";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  tags: string[];
}

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const username = session?.user?.name || "User";
  const router = useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("/api/randomprob");
        const data = await res.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    
      <Spotlight>
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d0d0d] text-black dark:text-white font-sans">
        {/* NAVBAR */}
        <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-2">
              <Image
                src="/next.svg"
                alt="App Logo"
                width={40}
                height={40}
                className="dark:invert"
              />
              <span className="text-xl font-bold">CodeMaster</span>
            </div>
            <nav className="flex gap-6 text-sm font-medium items-center">
              <Link
                href="/problems"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Problems
              </Link>
              <Link
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contests
              </Link>
              <Link
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Discuss
              </Link>

              {status !== "authenticated" ? (
                <Button
                  variant="flat"
                  onClick={() => signIn("github")}
                  className="border border-purple-500 bg-transparent text-purple-500 hover:bg-purple-500 hover:text-white transition"
                >
                  Sign In
                </Button>
              ) : (
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="light" className="text-sm">
                      Hello, {username.split(" ")[0]}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" as={Link} href="/profile">
                      Profile
                    </DropdownItem>

                    <DropdownItem
                      key="bookmark"
                      as={Link}
                      href="/profile/bookmarks"
                    >
                      Bookmarks
                    </DropdownItem>

                    <DropdownItem
                      key="signout"
                      onClick={() => signOut()}
                      className="text-danger"
                      color="danger"
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </nav>
          </div>
        </header>

        {/* HERO SECTION */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Master Coding, One Problem at a Time
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
            Join CodeMaster to practice coding problems, compete in contests,
            and grow your skills.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/problems")}
              className="relative inline-flex items-center justify-center rounded-lg border-2 border-transparent bg-transparent px-6 py-3 font-medium text-black dark:text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg border-gradient"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold">
                Start Solving
              </span>
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/problems")}
              className="relative inline-flex items-center justify-center rounded-lg border-2 border-transparent bg-transparent px-6 py-3 font-medium text-black dark:text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg border-gradient"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold">
                View Problems
              </span>
            </Button>
          </div>
        </main>

        {/* PROBLEMS PREVIEW */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Featured Problems
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading problems...</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem) => (
                <Card
                  key={problem.id}
                  isPressable
                  onPress={() => router.push(`/problems/${problem.id}`)}
                  className="bg-[#1a1a1a] hover:bg-[#262626] transition cursor-pointer rounded-2xl shadow-md hover:shadow-purple-500/40 border border-gray-800 hover:border-purple-500"
                >
                  <CardHeader className="px-6 pt-6 pb-2">
                    <h3 className="font-semibold text-lg text-white">
                      {problem.title}
                    </h3>
                  </CardHeader>
                  <CardBody className="px-6 pb-6 pt-2">
                    <p className="text-sm text-gray-400 mb-4">
                      Difficulty: {problem.difficulty}
                    </p>
                    <Button
                      as={Link}
                      href={`/problems/${problem.id}`}
                      size="sm"
                      className="border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition w-full"
                    >
                      Solve Now →
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 CodeMaster. Built with Next.js and NextUI.
        </footer>
      </div>
      </Spotlight>
  
  );
}
