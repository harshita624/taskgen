"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function HelpPanel() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const { getToken } = useAuth();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I didn’t understand that.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Failed to connect to AI. Try again." },
      ]);
    }
  };

  const startNewChat = () => {
    setMessages([{ role: "bot", text: "Hi! How can I help you today?" }]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const saveChat = () => {
    const chatText = messages
      .map((msg) => `${msg.role === "user" ? "You" : "TaskBot"}: ${msg.text}`)
      .join("\n");

    const blob = new Blob([chatText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "taskgen-chat.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md border border-gray-200 relative">
      <h1 className="text-4xl font-bold text-red-600 mb-4 flex items-center gap-2">
        ❓ Help & Support
      </h1>

      <p className="text-gray-700 mb-8 text-lg">
        Need assistance? You're in the right place! Below you’ll find helpful resources, support links, and a quick intro to AI task generation.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Feature */}
        <div className="border-l-4 border-indigo-500 pl-6 bg-indigo-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            ✨ AI-Powered Task Generation
          </h2>
          <p className="text-gray-700">
            Let our smart assistant help you get started by generating task lists based on your topic. Try something like{" "}
            <span className="font-medium text-indigo-600">“Learn React”</span> and watch the magic!
          </p>
        </div>

        {/* Getting Started */}
        <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">📘 Getting Started</h2>
          <p className="text-gray-700">
            Learn how to create tasks, manage categories, and mark them as complete or pending.
          </p>
        </div>

        {/* Troubleshooting */}
        <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">🛠️ Troubleshooting</h2>
          <p className="text-gray-700">
            Having issues with saving, syncing, or viewing tasks? Check our quick solutions!
          </p>
        </div>

        {/* Contact */}
        <div className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">📨 Contact Support</h2>
          <p className="text-gray-700">
            Email us at{" "}
            <a href="mailto:support@taskgen.com" className="text-blue-600 underline">
              support@taskgen.com
            </a>{" "}
            or use the in-app chat below.
          </p>
        </div>

        {/* Tips */}
        <div className="md:col-span-2 border-l-4 border-purple-500 pl-6 bg-purple-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">💡 Tips & Best Practices</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Use categories to group related tasks.</li>
            <li>Mark vital tasks for high priority.</li>
            <li>Filter tasks by date or completion status.</li>
            <li>Use the AI tool to jumpstart productivity.</li>
          </ul>
        </div>
      </div>

      {/* In-App Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition"
          >
            💬
          </button>
        ) : (
          <div className="w-80 bg-white border rounded-xl shadow-lg overflow-hidden flex flex-col h-96">
            <div className="bg-red-500 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-semibold">TaskGen Support</span>
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>

            <div className="bg-gray-50 border-b px-3 py-2 text-xs flex justify-between items-center text-gray-600">
              <button onClick={startNewChat} className="hover:underline">🔄 Start New</button>
              <button onClick={saveChat} className="hover:underline">💾 Save Chat</button>
              <button onClick={clearChat} className="hover:underline">🗑️ Clear</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-xs ${
                    msg.role === "bot"
                      ? "bg-gray-100 text-gray-800 self-start"
                      : "bg-red-100 text-red-800 self-end ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
