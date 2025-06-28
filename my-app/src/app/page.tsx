'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";

export default function Home() {
  const { data: session, status } = useSession();
  const username = session?.user?.name || "User";
  const router  =  useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d0d0d] text-black dark:text-white font-sans">
      
      {/* NAVBAR */}
      <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/next.svg" alt="App Logo" width={40} height={40} className="dark:invert"/>
            <span className="text-xl font-bold">CodeMaster</span>
          </div>
          <nav className="flex gap-6 text-sm font-medium items-center">
            <Link href="/problems" className="hover:text-blue-600 dark:hover:text-blue-400">Problems</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contests</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Discuss</Link>

            {status !== "authenticated" ? (
              <Button color="primary" onClick={() => signIn("github")}>
                Sign In with GitHub
              </Button>
            ) : (
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" className="text-sm">
                    Hello, {username.split(" ")[0]}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key = 'profile' as={Link} href="/profile">
                    Profile
                  </DropdownItem>
                 
                  <DropdownItem key = 'bookmark' as={Link} href="/profile/bookmarks">
                    Bookmarks
                  </DropdownItem>
                      
                  <DropdownItem key='signout' onClick={() => signOut()} className="text-danger" color="danger">
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
          Join CodeMaster to practice coding problems, compete in contests, and grow your skills.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button color="primary" size="lg">
            Start Solving
          </Button>
          <Button variant="bordered" size="lg" onClick={()=> router.push('/problems') }>
            View Problems
          </Button>
        </div>
      </main>

      {/* PROBLEMS PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Problems</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="hover:shadow-lg transition cursor-pointer">
              <CardHeader>
                <h3 className="font-semibold">Problem Title {id}</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  A short description of the problem to give users an idea what it’s about.
                </p>
                <Button as={Link} href={`/problems/${id}`} color="primary" size="sm">
                  Solve Now →
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 CodeMaster. Built with Next.js and NextUI.
      </footer>
    </div>
  );
}
