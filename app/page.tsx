'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function JsonTools() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormattedJson(pretty);
    } catch (err) {
      setFormattedJson("Invalid JSON");
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    const pastedData = event.clipboardData?.getData("text") || "";
    setJsonInput(pastedData);
    try {
      const parsedJson = JSON.parse(pastedData);
      setFormattedJson(JSON.stringify(parsedJson, null, 2));
    } catch (error) {
      // setFormattedJson("Invalid JSON");
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <div className="text-lg font-bold">JSON Tools</div>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">JSON Formatter</Link>
          <Link href="/json-to-yaml" className="hover:underline">JSON to YAML</Link>
          <Link href="/json-to-xml" className="hover:underline">JSON to XML</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* Left Textarea */}
        <textarea
          className="w-full p-4 border border-gray-300 rounded resize-none overflow-auto bg-white"
          placeholder="Enter JSON here or paste it.."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />

        {/* Center Column */}
        <div className="min-w-[180px] flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleFormatJson}
            className="px-6 py-3 bg-violet-600 text-white rounded hover:bg-violet-700 w-full"
          >
            Format JSON
          </button>
        </div>

        {/* Right Textarea */}
        <textarea
          className="w-full p-4 border border-gray-300 rounded resize-none overflow-auto bg-white"
          placeholder="Formatted JSON will appear here"
          value={formattedJson}
          readOnly
        />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs p-2 border-t">
        JSON Tools - Built with Next.js
      </footer>
    </div>
  );
}
