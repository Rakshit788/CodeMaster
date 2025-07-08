import { prisma } from "../../lib/prisma";
import CodeEditor from "../../components/editor";
import TestCaseDisplay from "../../components/Testcase";

type Problem = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  testCases: any[];
  submissions: any[];
  startcode: string;
  testcode: string;
  favourites: any[];
  bookmarks: any[];
};

export default async function ProblemPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const problem: Problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      tags: true,
      startcode: true,
      testcode: true,
      testCases: true,
      submissions: true,
      favourites: true,
      bookmarks: true,
    },
  });

  if (!problem) {
    return <div className="text-center py-10 text-xl text-gray-400">🚫 Problem not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-64px)] w-full bg-[#0d0d0d]">
      {/* LEFT PANEL: Problem */}
      <div className="px-6 py-6 overflow-y-auto border-r border-[#1f1f1f] text-white h-full hide-scrollbar">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {problem.title}
        </h1>

        <p className="text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
          {problem.description}
        </p>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm ${
            problem.difficulty === "Easy"
              ? "bg-green-600"
              : problem.difficulty === "Medium"
              ? "bg-yellow-600"
              : "bg-red-600"
          }`}
        >
          {problem.difficulty}
        </span>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-pink-400 mb-3">Test Cases</h2>
          <TestCaseDisplay problemId={problem.id} />
        </div>
      </div>

      {/* RIGHT PANEL: Code Editor */}
      <div className="h-full w-full bg-[#0d0d0d]">
        <CodeEditor initialValue={problem.startcode} problemId={id} />
      </div>
    </div>
  );
}
