"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { prisma } from "../lib/prisma";
import { signIn,  signOut } from "next-auth/react";
type Problem = {
    id : number ,
    title : string , 
    tags : string[] ,
    difficulty: string 
}
export default function ProblemsPage({ problems }: { problems: Problem[] }) {
  const [search, setSearch] = useState("");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, problems]);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    problems.forEach((p) => p.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [problems]);

  return (
    <div className=" w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Problems</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems..."
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Difficulty</th>
                <th className="px-4 py-3 font-semibold">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr
                  key={problem.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/problems/${problem.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {problem.tags.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProblems.length === 0 && (
          <p className="text-gray-500 mt-4">No matching problems found.</p>
        )}
      </div>

      {/* SIDEBAR */}
      <aside className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow h-fit">
        <h2 className="font-semibold text-lg mb-3">Tags</h2>
        <ul className="space-y-2">
          {allTags.map((tag) => (
            <li
              key={tag}
              className="text-sm text-gray-700 dark:text-gray-300 hover:underline cursor-pointer"
            >
              {tag}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
