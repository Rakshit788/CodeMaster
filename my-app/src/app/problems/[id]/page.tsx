"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "../../components/editor";

interface TestCase {
  nums?: number[];
  input?: string;
  target?: number;
  expected: any;
}

interface ProblemData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  startcode: string;
  testCases: TestCase[];
}

export default async function ProblemEditorClient({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
    const [problemId, setProblemId] = useState<number | null>(null);


  // 1) Fetch problem once on mount
  useEffect(() => {
      setProblemId(parseInt(params.id, 10));
    fetch(`/api/problem/${problemId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: ProblemData) => {
        setProblem(data);
        setCode(data.startcode);
      })
      .catch(() => {
        router.replace("/404");
      });
  }, [problemId, router]);

  // 2) Handler for the “Run Code” button
  const handleRun = async () => {
    if (!problem) return;
    setLoading(true);
    setResult(null);

    try {
      // enqueue
      const runRes = await fetch("/api/run-cpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  }),
      });
      const { jobId } = await runRes.json();

      // poll status
      let statusJson: any;
      do {
        await new Promise((r) => setTimeout(r, 1000));
        const statusRes = await fetch(`/api/status?key=${jobId}`);
        statusJson = await statusRes.json();
      } while (
        statusJson.state === "queued" ||
        statusJson.state === "running"
      );

      setResult(statusJson.result.message);
    } catch {
      setResult("Error submitting code");
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{problem.title}</h1>
        <p className="text-sm text-gray-400">Difficulty: {problem.difficulty}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700 text-sm rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 whitespace-pre-wrap">{problem.description}</p>
      </div>

      {/* Editor */}
      <div className="flex-1 border rounded-lg overflow-hidden">
        <CodeEditor
          initialCode={code}
          onChange={(v) => setCode(v)}
        />
      </div>

      {/* Run button */}
      <button
        className="self-end px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        onClick={handleRun}
        disabled={loading}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {loading ? "Running..." : "Run Code"}
      </button>

      {/* Testcases listing */}
      {problem.testCases.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
          <ul className="list-disc pl-6 space-y-1">
            {problem.testCases.map((t, i) => (
              <li key={i} className="text-sm text-gray-300">
                {"nums" in t
                  ? `nums=[${t.nums!.join(",")}], target=${t.target}`
                  : `input="${t.input}"`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Result */}
      {result && (
        <pre className="p-4 bg-gray-800 rounded text-green-200 whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
