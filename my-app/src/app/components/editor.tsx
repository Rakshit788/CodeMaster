"use client";
import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { json } from "stream/consumers";

export default function CodeEditor({
  initialValue = "",
  problemId,
}: {
  initialValue?: string;
  problemId?: number;
}) {
  const [code, setCode] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [data , setdata] =  useState({jobId : ""  ,  status : ""}) ;
  const [fresult , setfresult] =  useState("") ; 
  const [submit, setsubmit] =  useState(false) ; 
const handleAns = async (jobId: string) => {

  while (true) {
    const response = await fetch(`/api/status?key=${jobId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    const status = data?.result?.status;

    console.log("Polled status:", status);

    // Set result in state
    if (status) {
      setfresult(status); // ✅ this updates UI
    }

    // Exit condition
    if (status === "success" || status === "fail" || status === "error" || status==="timeout") {
      break;
    }

    // Wait before next poll
    await new Promise((res) => setTimeout(res, 2000));
  }
};

const handleSubmit = async () => {
    setLoading(true);
  setfresult(""); // clear last result
  setsubmit(false);

  setLoading(true);
  try {
    const response = await fetch("/api/run-cpp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, code }),
    });
    const dat = await response.json();
   setdata(dat) ; 

 
   

  
   
    const JobId = dat.jobId;  // ✅ Correct key
   
    

    if (JobId) {
      await handleAns(JobId);  
      // ✅ Also add await to ensure we wait for results
    } else {
     
    }
  } catch (err) {
    console.error("Submission error:", err);
  } finally {
    setLoading(false);
    setsubmit(true)
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
      {fresult === "" && submit===true && (
  <div className="text-gray-500 mt-4">⏳ Waiting for result...</div>
)}

      {fresult === "success" && (
  <div className="bg-green-100 text-green-800 p-4 mt-4 rounded-lg border border-green-300 shadow-sm animate-pulse">
    <h2 className="text-xl font-bold">✅ All test cases passed!</h2>
    <p className="text-sm">Great job! Your solution is correct.</p>
  </div>
)}

{["error" , "timeout" , "fail"].includes(fresult) && (
  <div className="bg-red-100 text-red-800 p-4 mt-4 rounded-lg border border-red-300 shadow-sm animate-pulse">
    <h2 className="text-xl font-bold">❌ Some test cases failed.</h2>
    <p className="text-sm">Please review your code and try again.</p>
  </div>
)}

    </div>
  );
}
