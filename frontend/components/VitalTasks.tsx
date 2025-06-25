"use client";

import { useEffect, useState } from "react";
import { Flame, Filter, CalendarDays, Star, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";

type Task = {
  id: number;
  title: string;
  description?: string;
  priority: string;
  due: string;
  tags: string[];
  done: boolean;
};

export default function VitalTasks() {
  const [priority, setPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchTasks = async () => {
    try {
      const token = await getToken();
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawTasks = res.data.tasks || res.data;
      console.log("📦 Raw fetched tasks:", rawTasks);

      const vitalTasks = rawTasks
        .map((task: Task) => ({
          ...task,
          priority: task.priority?.toLowerCase() || "",
        }))
        .filter(
          (task: Task) =>
            ["high", "medium", "low"].includes(task.priority) && !!task.due
        );

      console.table(vitalTasks, ["id", "title", "priority"]);
      setTasks(vitalTasks);
    } catch (err) {
      console.error("❌ Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const filteredTasks =
    priority === "all"
      ? tasks
      : tasks.filter((t) => t.priority === priority);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 min-h-[400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-red-600 flex items-center gap-2">
          <Flame className="text-orange-500 w-6 h-6 animate-pulse" aria-hidden="true" />
          Vital Tasks
        </h1>
        <div className="flex gap-3 items-center">
          <Filter className="text-gray-600 w-5 h-5" aria-hidden="true" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200"
            aria-label="Filter tasks by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚠️ Medium</option>
            <option value="low">✅ Low</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong>{" "}
        tasks for priority "<strong>{priority}</strong>"
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-600">
          <Loader2 className="animate-spin w-6 h-6 mr-3" aria-hidden="true" />
          <span>Loading tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-600 text-base text-center py-10">
          No vital tasks under this category yet. Start adding some!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border-l-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-200 ${
                task.priority === "high"
                  ? "border-red-500"
                  : task.priority === "medium"
                  ? "border-yellow-400"
                  : "border-green-400"
              } ${task.done ? "opacity-60" : ""}`}
              role="region"
              aria-label={`Task: ${task.title}`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={task.done ? "Mark task as incomplete" : "Mark task as complete"}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        task.done ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                  <div>
                    <h3
                      className={`text-base font-semibold text-gray-800 ${
                        task.done ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" aria-hidden="true" />
                      Due: {new Date(task.due).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Star
                  className={`w-5 h-5 ${
                    task.priority === "high"
                      ? "text-red-500"
                      : task.priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                  title={`Priority: ${task.priority}`}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-sm text-gray-500 flex items-center gap-2">
        <span className="text-base">💡</span>
        You can use our AI to generate tasks based on topics — helping you prioritize what matters most.
      </div>
    </div>
  );
}