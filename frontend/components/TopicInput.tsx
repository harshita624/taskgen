"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

export default function TopicInput({ onTasksGenerated }: { onTasksGenerated: () => void }) {
  const [topic, setTopic] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getToken();
        const res = await api.get("/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, [getToken]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const generateTasks = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    if (categoryId === "") {
      setError("Please select a category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");

      const res = await api.post(
        "/tasks/generate",
        { topic, priority, categoryId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        setSuccess(true);
        onTasksGenerated();
        setTopic("");
        setPriority("medium");
        setCategoryId("");
      } else {
        setError("Task generation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Task generation error:", err);
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "high": return "🔥";
      case "medium": return "⚡";
      case "low": return "🌱";
      default: return "⚡";
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-orange-600 bg-orange-50 border-orange-200";
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Task Generator</h2>
            <p className="text-blue-100 text-sm">Transform your ideas into actionable tasks</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateTasks();
        }}
        className="p-6 space-y-6"
      >
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Tasks generated successfully!</span>
          </div>
        )}

        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="task-topic" className="block text-sm font-semibold text-gray-700">
            What would you like to work on? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="task-topic"
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 bg-white placeholder-gray-400"
              placeholder="e.g., Learn React, Plan vacation, Build portfolio website..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
            {topic && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Be specific for better task suggestions</p>
        </div>

        {/* Priority & Category */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Priority Level</label>
            <div className="space-y-2">
              {["high", "medium", "low"].map((p) => (
                <label
                  key={p}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    priority === p
                      ? getPriorityColor(p) + " border-current"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
                    disabled={loading}
                    className="sr-only"
                    aria-label={`Set priority to ${p}`}
                  />
                  <span className="text-lg">{getPriorityIcon(p)}</span>
                  <span className="font-medium capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 bg-white appearance-none cursor-pointer"
              >
                <option value="">🗂️ Choose a category...</option>
                {categories.map((cat) => (
                  <option key={`${cat.id}-${cat.name}`} value={cat.id}>
                    📁 {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {categories.length === 0 && (
              <p className="text-xs text-amber-600">Loading categories...</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !topic.trim() || categoryId === ""}
            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold text-sm px-6 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating your tasks...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Tasks
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            AI will create 3–5 relevant tasks based on your topic and priority
          </p>
        </div>
      </form>
    </div>
  );
}
