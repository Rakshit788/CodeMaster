// components/CodeEditor.tsx
"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function CodeEditor({
  initialCode,
  onSubmit,
}: {
  initialCode?: string;
  onSubmit?: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode || "");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border rounded-xl overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage="cpp"
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
          }}
        />
      </div>
      <button
        className="mt-4 self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onSubmit?.(code)}
      >
        Submit
      </button>
    </div>
  );
}
