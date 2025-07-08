"use client";

import { useEffect, useState } from "react";

interface TestCase {
  id: number;
  input: string;
  expected: string;
}

export default function TestCaseDisplay({ problemId }: { problemId: number }) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await fetch("/api/gettestcase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch test cases");
        }

        const data = await response.json();
        setTestCases(data);
      } catch (err) {
        console.error("Error fetching test cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [problemId]);

  if (loading) {
    return (
      <div className="text-gray-400 animate-pulse">
        Loading test cases...
      </div>
    );
  }

  if (!testCases || testCases.length === 0) {
    return (
      <div className="text-gray-400">
        No test cases found for this problem.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ul className="space-y-3">
        {testCases.map((tc) => (
          <li key={tc.id}>
            <pre className="bg-[#1a1a1a] text-gray-200 text-sm p-3 rounded-lg overflow-x-auto shadow-inner whitespace-pre-wrap">
{`> Input:
${tc.input}

> Expected:
${tc.expected}`}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
