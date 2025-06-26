import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import TopicInput from "./TopicInput";
import ProgressRing from "./ui/ProgressRing";
import SearchBar from "./ui/SearchBar";
import api from "@/lib/api";
import { Task } from "@/interfaces/task";
import { Loader2, Plus, Users, X, CheckCircle2, Circle, Tag } from "lucide-react";
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
  const { isLoaded: authLoaded, userId, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [taskActionLoading, setTaskActionLoading] = useState<number | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const toggleTaskDone = async (id: number, done: boolean) => {
    setTaskActionLoading(id);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await api.patch(`/tasks/${id}`, { done: !done }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
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

  const getCurrentDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const getPriorityIcon = (priority: string) =>
    priority === "high" ? "🔥" : priority === "medium" ? "⚡" : "🌱";

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-400 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name || "Uncategorized";

  const getCategoryColor = (categoryId: number) => {
    const colors = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-yellow-100 text-yellow-800", "bg-red-100 text-red-800"];
    return colors[categoryId % colors.length] || "bg-gray-100 text-gray-800";
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'User'} 👋</h1>
            <p className="text-gray-600 text-sm mt-1">{getCurrentDate()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["RD", "BL", "GR", "PL", "YL"].map((initials, i) => (
                <div key={i} className="w-8 h-8 bg-gray-100 text-gray-600 font-bold text-xs rounded-full border-2 border-white flex items-center justify-center">
                  {initials}
                </div>
              ))}
            </div>
            <button onClick={() => alert("Invite functionality coming soon!")} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" />
              Invite
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <SearchBar
            placeholder="Search your task here..."
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            onSearch={(val) => console.log("Searching for:", val)}
          />
          <button onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")} className="ml-4 text-sm text-gray-500 hover:text-gray-800 transition">
            View: {viewMode === "list" ? "Grid" : "List"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">📅 To-Do</h2>
                <button
                  onClick={() => setShowTopicInput(!showTopicInput)}
                  className={`text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${showTopicInput ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                >
                  {showTopicInput ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {showTopicInput ? "Close AI" : "AI Generate"}
                </button>
              </div>

              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                  </div>
                ) : filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task.id} className={`group border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${task.done ? 'border-green-200 bg-gradient-to-r from-green-50 to-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <button onClick={() => toggleTaskDone(task.id, task.done)} disabled={taskActionLoading === task.id} className={`mt-1 transition-colors disabled:opacity-50 ${task.done ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}>
                              {taskActionLoading === task.id ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                              ) : task.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </button>
                            <div className="flex-1">
                              <h4 className={`font-medium ${task.done ? 'text-gray-600 line-through' : 'text-gray-900'}`}>{task.title}</h4>
                              <p className={`text-sm ${task.done ? 'text-gray-500 line-through' : 'text-gray-600'}`}>{task.description}</p>
                              {task.categoryIdInt && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${task.done ? 'bg-gray-100 text-gray-600' : getCategoryColor(task.categoryIdInt)}`}>
                                  <Tag className="w-3 h-3" />
                                  {getCategoryName(task.categoryIdInt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-6">No tasks found.</p>
                )}
              </div>
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
                    <h3 className="text-lg font-semibold text-gray-900">AI Task Generator</h3>
                    <button onClick={() => setShowTopicInput(false)} className="text-gray-400 hover:text-gray-600 p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <TopicInput onTasksGenerated={handleTasksGenerated} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* ...Your stats components here (ProgressRing, completed tasks etc.) */}
          </div>
        </div>
      </div>
    </div>
  );
}
