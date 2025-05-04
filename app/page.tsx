'use client';

import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");

  const handleFormatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsedJson, null, 2));
    } catch (error) {
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
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <nav className="w-full flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <div className="text-lg font-bold">JSON Tools</div>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">JSON Formatter</Link>
          <Link href="/json-to-yaml" className="hover:underline">JSON to YAML</Link>
          <Link href="/json-to-xml" className="hover:underline">JSON to XML</Link>
        </div>
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="flex gap-4 w-full">
          <textarea
            className="flex-1 p-4 border border-gray-300 rounded resize-none"
            placeholder="Enter JSON here"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <textarea
            className="flex-1 p-4 border border-gray-300 rounded resize-none"
            placeholder="Formatted JSON will appear here"
            value={formattedJson}
            readOnly
          />
        </div>
        <button
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleFormatJson}
        >
          Format JSON
        </button>
      </main>
      <footer className="w-full p-4 bg-gray-100 text-center">
        JSON Tools - Built with Next.js
      </footer>
    </div>
  );
}
