// app/page.tsx
"use client";

import { useState } from "react";

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const handleSubmit = async () => {
    setChatLog((prev) => [...prev, `🧠 You: ${input}`]);

    const res = await fetch("/api/navigate", {
      method: "POST",
      body: JSON.stringify({ url: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.liveUrl) {
      setBrowserUrl(data.liveUrl);
      setSessionId(data.sessionId);
      setSubmitted(true);
    } else {
      setChatLog((prev) => [
        ...prev,
        `⚠️ Error: ${data.error || "Unknown issue"}`,
      ]);
    }
    setInput("");
  };

  const performTask = async () => {
    setChatLog((prev) => [...prev, `🧠 You: ${input}`]);

    const res = await fetch("/api/performTask", {
      method: "POST",
      body: JSON.stringify({ prompt: input, sessionId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log(data.response);
    setChatLog((prev) => [...prev, `🧠 bot: ${data.response.result}`]);

    setInput("");
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      {!submitted ? (
        <div className="flex items-center justify-center h-full">
          <div className="bg-gray-800 p-6 rounded-md w-full max-w-md">
            <h1 className="text-xl font-bold mb-4">
              Start Remote Browser Session
            </h1>
            <input
              type="text"
              placeholder="go to https://example.com"
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              type="button"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={handleSubmit}
            >
              Launch Browser
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full">
          {/* Live Browser */}
          <div className="w-2/3 border-r border-gray-700">
            {browserUrl ? (
              <iframe src={browserUrl} className="w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading browser session...
              </div>
            )}
          </div>

          {/* Chat Panel */}
          <div className="w-1/3 p-4 flex flex-col">
            <div className="flex-1 bg-gray-800 p-4 rounded overflow-y-auto mb-4">
              {chatLog.map((msg, idx) => (
                <div key={idx} className="text-sm mb-2">
                  {msg}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && performTask()}
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                placeholder="Type another command (go to ...)"
              />
              <button
                type="button"
                onClick={performTask}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
