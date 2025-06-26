"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import TopicInput from "./TopicInput";
import ProgressRing from "./ui/ProgressRing";
import SearchBar from "./ui/SearchBar";
import api from "@/lib/api";
import { Task } from "@/interfaces/task";
import {
  Loader2,
  Plus,
  Users,
  X,
  CheckCircle2,
  Circle,
  Tag
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Category = {
  id: number;
  name: string;
  color?: string;
};

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [taskActionLoading, setTaskActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isLoaded: authLoaded, userId, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const toggleTaskDone = async (id: number, done: boolean) => {
    setTaskActionLoading(id);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await api.patch(
        `/tasks/${id}`,
        { done: !done },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Error updating task.");
    } finally {
      setTaskActionLoading(null);
    }
  };

  const handleTasksGenerated = () => {
    fetchTasks();
    setShowTopicInput(false);
  };

  useEffect(() => {
    if (authLoaded && userId) {
      fetchTasks();
      fetchCategories();
    }
  }, [authLoaded, userId]);

  if (!authLoaded || !userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-gray-600" />
        <span className="text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">You must be signed in to view this page.</p>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.done).length;
  const inProgressTasks = tasks.filter((t) => !t.done).length;
  const totalTasks = tasks.length;
  const notStartedTasks = totalTasks - (completedTasks + inProgressTasks);

  const completedPercentage = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;
  const inProgressPercentage = totalTasks
    ? Math.round((inProgressTasks / totalTasks) * 100)
    : 0;
  const notStartedPercentage = totalTasks
    ? Math.round((notStartedTasks / totalTasks) * 100)
    : 0;

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getPriorityIcon = (priority: string) =>
    priority === "high" ? "🔥" : priority === "medium" ? "⚡" : "🌱";

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-400 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name || "Uncategorized";

  const getCategoryColor = (categoryId: number) => {
    const palette = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800"
    ];
    return palette[categoryId % palette.length] || "bg-gray-100 text-gray-800";
  };

  const filteredTasks = tasks.filter((t) =>
    `${t.title} ${t.description || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome back, {user?.firstName || "User"} 👋
            </h1>
            <p className="text-gray-600 text-sm mt-1">{getCurrentDate()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["RD", "BL", "GR", "PL", "YL"].map((i, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 bg-gray-100 text-gray-600 font-bold text-xs rounded-full border-2 border-white flex items-center justify-center"
                >
                  {i}
                </div>
              ))}
            </div>
            <button
              onClick={() => alert("Invite functionality coming soon!")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Invite
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <SearchBar
            placeholder="Search your task here..."
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={(val) => console.log("Searching for:", val)}
          />
          <button
            onClick={() =>
              setViewMode(viewMode === "list" ? "grid" : "list")
            }
            className="ml-4 text-sm text-gray-500 hover:text-gray-800"
          >
            View: {viewMode === "list" ? "Grid" : "List"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="p-4 sm:p-6">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Todo */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  📅 To‑Do
                </h2>
                <button
                  onClick={() => setShowTopicInput(!showTopicInput)}
                  className={`text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                    showTopicInput ? "bg-blue-50" : "hover:bg-blue-50"
                  } transition-colors`}
                >
                  {showTopicInput ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {showTopicInput ? "Close AI" : "AI Generate"}
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short"
                })}{" "}
                • Today
              </p>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "space-y-4"
                }
              >
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                  </div>
                ) : filteredTasks.length > 0 ? (
                  filteredTasks.slice(0, 6).map((task) => (
                    <div
                      key={task.id}
                      className={`group border rounded-lg p-4 hover:shadow-md transition ${
                        task.done
                          ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() =>
                              toggleTaskDone(task.id, task.done)
                            }
                            disabled={taskActionLoading === task.id}
                            className={`mt-1 transition-colors disabled:opacity-50 ${
                              task.done
                                ? "text-green-600"
                                : "text-gray-400 hover:text-green-600"
                            }`}
                          >
                            {taskActionLoading === task.id ? (
                              <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                            ) : task.done ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-medium ${
                                  task.done
                                    ? "text-gray-600 line-through"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </h4>
                              {task.priority && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  <span>
                                    {getPriorityIcon(task.priority)}
                                  </span>
                                  {task.priority}
                                </span>
                              )}
                            </div>
                            {task.description && (
                              <p
                                className={`text-sm mb-2 ${
                                  task.done
                                    ? "text-gray-500 line-through"
                                    : "text-gray-600"
                                }`}
                              >
                                {task.description}
                              </p>
                            )}
                            {task.categoryIdInt && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  task.done
                                    ? "bg-gray-100 text-gray-600"
                                    : getCategoryColor(task.categoryIdInt)
                                }`}
                              >
                                <Tag className="w-3 h-3" />
                                {getCategoryName(task.categoryIdInt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition ml-2">
                          <button
                            onClick={() =>
                              toggleTaskDone(task.id, task.done)
                            }
                            disabled={taskActionLoading === task.id}
                            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors disabled:opacity-50 ${
                              task.done
                                ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                                : "text-green-600 bg-green-50 hover:bg-green-100"
                            }`}
                          >
                            {task.done ? "Undo" : "Complete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks yet. Create your first task!</p>
                  </div>
                )}
              </div>
              {filteredTasks.length > 6 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => alert("Navigate to full task list")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all {filteredTasks.length} tasks →
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {showTopicInput && (
                <motion.div
                  key="topic-input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Task Generator
                    </h3>
                    <button
                      onClick={() => setShowTopicInput(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <TopicInput onTasksGenerated={handleTasksGenerated} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                📊 Task Status
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <ProgressRing
                    percentage={completedPercentage}
                    color="green"
                    size={80}
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {completedPercentage}%
                  </p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <ProgressRing
                    percentage={inProgressPercentage}
                    color="blue"
                    size={80}
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {inProgressPercentage}%
                  </p>
                  <p className="text-xs text-gray-600">In Progress</p>
                </div>
                <div className="text-center">
                  <ProgressRing
                    percentage={notStartedPercentage}
                    color="red"
                    size={80}
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {notStartedPercentage}%
                  </p>
                  <p className="text-xs text-gray-600">Not Started</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                ✅ Completed Tasks
              </h3>
              <div className="space-y-3">
                {tasks
                  .filter((t) => t.done)
                  .slice(0, 3)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-sm font-medium line-through text-gray-900">
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {t.priority && (
                            <span>
                              {getPriorityIcon(t.priority)} {t.priority}
                            </span>
                          )}
                          {t.categoryIdInt && (
                            <span>📁 {getCategoryName(t.categoryIdInt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {completedTasks === 0 && (
                  <p className="py-4 text-center text-sm text-gray-500">
                    No completed tasks yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
