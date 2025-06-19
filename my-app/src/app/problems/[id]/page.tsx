import { prisma } from "../../lib/prisma";
import CodeEditor from "../../components/editor";

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
    return <div className="text-center py-10 text-xl">Problem not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-screen bg-gray-100 dark:bg-black">
      {/* LEFT: Problem Description */}
      <div className="p-6 rounded-xl shadow-md bg-white dark:bg-[#161b22] overflow-y-auto border border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
          {problem.title}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
          {problem.description}
        </p>

        <span
          className={`text-xs font-medium px-2 py-1 rounded-md text-white ${
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
          <h2 className="font-semibold text-lg mb-2 text-black dark:text-white">Test Cases</h2>
          <ul className="list-disc list-inside space-y-2">
            {problem.testCases.map((tc, index) => (
              <li key={index}>
                <pre className="bg-gray-200 dark:bg-gray-800 text-sm p-2 rounded overflow-x-auto">
                  {JSON.stringify(tc, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT: Code Editor */}
      <div className="h-[85vh]">
        <CodeEditor initialValue={problem.startcode} problemId={id} />
      </div>
    </div>
  );
}
