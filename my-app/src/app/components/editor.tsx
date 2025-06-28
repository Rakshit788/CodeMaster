"use client";
import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import { log } from "console";
import { resourceLimits } from "worker_threads";

export default function CodeEditor({
  initialValue = "",
  problemId,
}: {
  initialValue?: string;
  problemId?: number;
}) {
  const [code, setCode] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({ jobId: "", status: "" });
  const [fresult, setFresult] = useState("");
  const [submit, setSubmit] = useState(false);

  const { data: session } = useSession();

  const updateUser = async (
    problemId: number,
    status: string,
    code: string
  ) => {
    if (!session?.user?.email) return;

    const result = await fetch("/api/updateuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        problemid: problemId,
        status,
        code,
      }),
    });
    console.log('user update', result);
  };




  const handleAns = async (jobId: string) => {
    while (true) {
      const response = await fetch(`/api/status?key=${jobId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      const status = data?.result?.status;

      if (status) {
        setFresult(status);
      }

      if (
        status === "success" ||
        status === "fail" ||
        status === "error" ||
        status === "timeout"
      ) {
        // Call updateUser after final verdict
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
      setJobData(data);

      const jobId = data.jobId;
      if (jobId) {
        await handleAns(jobId);
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
      setSubmit(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] p-4">
      <div className="flex-1 border border-gray-700 rounded-xl overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          onChange={(e) => setCode(e || "")}
          theme="vs-dark"
        />
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition ${loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          disabled={loading}
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
