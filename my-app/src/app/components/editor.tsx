"use client";

import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useSession } from "next-auth/react";

export default function CodeEditor({
  initialValue = "",
  problemId,
}: {
  initialValue?: string;
  problemId?: number;
}) {
  const [code, setCode] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [fresult, setFresult] = useState("");
  const [submit, setSubmit] = useState(false);

  const { data: session } = useSession();

  const updateUser = async (problemId: number, status: string, code: string) => {
    if (!session?.user?.email) return;

    await fetch("/api/updateuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        problemid: problemId,
        status,
        code,
      }),
    });
  };

  const handleAns = async (jobId: string) => {
    while (true) {
      const response = await fetch(`/api/status?key=${jobId}`);
      const data = await response.json();
      const status = data?.result?.status;

      if (status) setFresult(status);

      if (["success", "fail", "error", "timeout"].includes(status)) {
        await updateUser(problemId, status, code);
        break;
      }

      await new Promise((res) => setTimeout(res, 2000));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFresult("");
    setSubmit(false);

    try {
      const response = await fetch("/api/run-cpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code }),
      });

      const data = await response.json();
      const jobId = data.jobId;
      if (jobId) await handleAns(jobId);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
      setSubmit(true);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0d0d0d] p-4 border-l border-[#1f1f1f]">
      <div className="flex-1 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
        <Editor
          height="65vh"
          defaultLanguage="cpp"
          value={code}
          onChange={(e) => setCode(e || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16 },
          }}
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md hover:from-pink-600 hover:to-purple-600 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {fresult === "" && submit && (
        <div className="text-gray-400 text-sm mt-2 animate-pulse">
          ⏳ Waiting for result...
        </div>
      )}
      {fresult === "success" && (
        <div className="bg-green-600 text-white p-3 rounded-lg mt-2">
          ✅ All test cases passed!
        </div>
      )}
      {["fail", "error", "timeout"].includes(fresult) && (
        <div className="bg-red-600 text-white p-3 rounded-lg mt-2">
          ❌ Some test cases failed. Try again.
        </div>
      )}
    </div>
  );
}
