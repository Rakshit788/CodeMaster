import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d0d0d] text-black dark:text-white font-sans">
      
      {/* NAVBAR */}
      <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/next.svg" alt="App Logo" width={40} height={40} className="dark:invert"/>
            <span className="text-xl font-bold">CodeMaster</span>
          </div>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="" className="hover:text-blue-600 dark:hover:text-blue-400">Problems</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contests</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Discuss</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Sign In</a>
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
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-sm font-semibold shadow"
          >
            Start Solving
          </a>
          <a
            href="#"
            className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-6 py-3 text-sm font-semibold"
          >
            View Problems
          </a>
        </div>
      </main>

      {/* PROBLEMS PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Problems</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <div key={id} className="p-4 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">Problem Title {id}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A short description of the problem to give users an idea what it’s about.
              </p>
              <a href="#" className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block">
                Solve now →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 CodeMaster. Built with Next.js.
      </footer>
    </div>
  );
}
