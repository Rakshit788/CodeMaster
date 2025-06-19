"use client";
import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

export default function CodeEditor({
  initialValue = "",
  problemId,
}: {
  initialValue?: string;
  problemId?: number;
}) {
  const [code, setCode] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/run-cpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code }),
      });
      const data = await response.json();
      console.log("Result:", data);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-white dark:bg-[#0d1117] rounded-xl shadow-md border">
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          onChange={(e) => setCode(e || "")}
          theme="vs-dark"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg w-fit self-end transition duration-200"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
