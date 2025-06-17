
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

interface EditorProps {
  problemId: number;
}

export default function ProblemEditorClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
    const problemId = params?.id  

  // Fetch problem details on mount
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problem/${problemId}`);
        if (!res.ok) throw new Error("Failed to load problem");
        const data: ProblemData = await res.json();
        setProblem(data);
        setCode(data.startcode);
      } catch {
        router.replace("/404");
      }
    }
    fetchProblem();
  }, [problemId, router]);

  const handleSubmit = async () => {
    if (!problem) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/run-cpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code }),
      });
      const { jobId } = await res.json();
      let statusJson;
      do {
        await new Promise(r => setTimeout(r, 1000));
        const statusRes = await fetch(`/api/status?key=${jobId}`);
        statusJson = await statusRes.json();
      } while (statusJson.state === "queued" || statusJson.state === "running");
      setResult(statusJson.result.message);
    } catch (err) {
      setResult("Error submitting code");
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return <div>Loading problem...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <p className="text-gray-600">Difficulty: {problem.difficulty}</p>
        <div className="mt-2">
          {problem.tags.map(tag => (
            <span key={tag} className="mr-2 px-2 py-1 bg-gray-200 rounded">{tag}</span>
          ))}
        </div>
        <p className="mt-4 whitespace-pre-wrap">{problem.description}</p>
      </header>
      <div className="flex-1 border rounded-xl overflow-hidden">
        <CodeEditor initialCode={code} onSubmit={setCode} />
      </div>
      <button
        className="mt-4 self-end px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          "Run Code"
        )}
      </button>
      {problem.testCases && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
          <ul className="list-disc pl-6">
            {problem.testCases.map((t, idx) => (
              <li key={idx} className="mb-1">
                {t.nums ? `nums=[${t.nums.join(",")}], target=${t.target}, expected=[${(t.expected as number[]).join(",")}]`
                         : `input=\"${t.input}\", expected=\"${t.expected}\"`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-gray-800 text-green-200 rounded-lg whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
