'use client';

import { useState, useEffect } from "react";

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

  const convertJsonToXml = () => {
    try {
      const json = JSON.parse(jsonInput);
      const xml = jsonToXml(json);
      setFormattedJson(xml);
    } catch (err) {
      setFormattedJson("Invalid JSON");
    }
  };
  const convertJsonToYaml = () => {
    try {
      const json = JSON.parse(jsonInput);
      const yaml = jsonToYaml(json);
      setFormattedJson(yaml);
    } catch (err) {
      setFormattedJson("Invalid JSON");
    }
  };
  const jsonToXml = (json: any, indent: string = ""): string => {
    let xml = "";
    const indentStep = "  "; // Define the indentation step (2 spaces)

    for (const prop in json) {
      if (json.hasOwnProperty(prop)) {
        if (Array.isArray(json[prop])) {
          for (const arrayElem of json[prop]) {
            xml += `${indent}<${prop}>\n`;
            xml += jsonToXml(arrayElem, indent + indentStep);
            xml += `${indent}</${prop}>\n`;
          }
        } else if (typeof json[prop] === "object") {
          xml += `${indent}<${prop}>\n`;
          xml += jsonToXml(json[prop], indent + indentStep);
          xml += `${indent}</${prop}>\n`;
        } else {
          xml += `${indent}<${prop}>${json[prop]}</${prop}>\n`;
        }
      }
    }

    return xml;
  };
  const jsonToYaml = (json: any, indent: string = ""): string => {
    if (typeof json !== "object" || json === null) {
      return `${json}`;
    }

    const yaml = Object.entries(json)
      .map(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value) && value !== null) {
          return `${indent}${key}:\n${jsonToYaml(value, indent + "  ")}`;
        } else if (Array.isArray(value)) {
          return `${indent}${key}:\n${value
            .map((item) => {
              if (typeof item === "object" && item !== null) {
                // Place hyphen and first key on the same line
                const itemYaml = jsonToYaml(item, indent + "  ");
                const itemLines = itemYaml.split("\n");
                return `${indent}- ${itemLines[0]}${itemLines.length > 1 ? "\n" + itemLines.slice(1).map(line => indent + "  " + line).join("\n") : ""}`;
              } else {
                return `${indent}- ${item}`;
              }
            })
            .join("\n")}`;
        } else {
          return `${indent}${key}: ${value}`;
        }
      })
      .join("\n");
    return yaml;
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
          <button
            onClick={convertJsonToXml}
            className="px-6 py-3 bg-violet-600 text-white rounded hover:bg-violet-700 w-full"
          >
            To XML
          </button>
          <button
            onClick={convertJsonToYaml}
            className="px-6 py-3 bg-violet-600 text-white rounded hover:bg-violet-700 w-full"
          >
            To YAML
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
