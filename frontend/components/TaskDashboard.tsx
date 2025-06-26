import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import TaskForm from "./TaskForm";
import TopicInput from "./TopicInput";
import TaskCard from "./TaskCard";
import ProgressRing from "./ui/ProgressRing";
import SearchBar from "./ui/SearchBar";
import api from "@/lib/api";
import { Task } from "@/interfaces/task";
import { Loader2, Plus, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded: authLoaded, userId, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const taskData = res.data.tasks || res.data;
      setTasks(taskData);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    setShowTaskForm(false);
  };

  const handleTasksGenerated = () => {
    fetchTasks();
    setShowTopicInput(false);
  };

  useEffect(() => {
    if (authLoaded && userId) fetchTasks();
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

  const completedTasks = tasks.filter(task => task.done).length;
  const inProgressTasks = tasks.filter(task => !task.done).length;
  const totalTasks = tasks.length;
  const notStartedTasks = totalTasks - (completedTasks + inProgressTasks);

  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressPercentage = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const notStartedPercentage = totalTasks > 0 ? Math.round((notStartedTasks / totalTasks) * 100) : 0;

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome back, {user?.firstName || 'User'} 👋
            </h1>
            <p className="text-gray-600 text-sm mt-1">{getCurrentDate()}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["RD", "BL", "GR", "PL", "YL"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-100 text-gray-600 font-bold text-xs rounded-full border-2 border-white flex items-center justify-center"
                >
                  {initials}
                </div>
              ))}
            </div>
            <button
              onClick={() => alert("Invite functionality coming soon!")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
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
            onChange={(val) => setSearchTerm(val)}
            onSearch={(val) => console.log("Searching for:", val)}
          />
          <button
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="ml-4 text-sm text-gray-500 hover:text-gray-800 transition"
          >
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
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  📅 To-Do
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowTaskForm(!showTaskForm);
                      setShowTopicInput(false); // Close topic input when opening task form
                    }}
                    className={`text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${showTaskForm ? 'bg-red-50' : 'hover:bg-red-50'}`}
                  >
                    {showTaskForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showTaskForm ? "Close Form" : "Add Task"}
                  </button>
                  <button
                    onClick={() => {
                      setShowTopicInput(!showTopicInput);
                      setShowTaskForm(false); // Close task form when opening topic input
                    }}
                    className={`text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${showTopicInput ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                  >
                    {showTopicInput ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showTopicInput ? "Close AI" : "AI Generate"}
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {getCurrentDate().split(',')[0]} • Today
              </p>

              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                  </div>
                ) : tasks.length > 0 ? (
                  tasks
                    .filter((task) =>
                      `${task.title} ${task.description}`.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 3)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} refresh={fetchTasks} />
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks yet. Create your first task!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Creation Forms - Separated for better control */}
            <AnimatePresence mode="wait">
              {showTaskForm && (
                <motion.div
                  key="task-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <TaskForm 
                    onTaskCreated={handleTaskCreated}
                    key="manual-task-form" // Force re-render
                  />
                </motion.div>
              )}

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
                    <button
                      onClick={() => setShowTopicInput(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <TopicInput 
                    onTasksGenerated={handleTasksGenerated}
                    key="ai-topic-input" // Force re-render
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📊 Task Status
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <ProgressRing percentage={completedPercentage} color="green" size={80} />
                  <p className="text-sm font-medium text-gray-900 mt-2">{completedPercentage}%</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <ProgressRing percentage={inProgressPercentage} color="blue" size={80} />
                  <p className="text-sm font-medium text-gray-900 mt-2">{inProgressPercentage}%</p>
                  <p className="text-xs text-gray-600">In Progress</p>
                </div>
                <div className="text-center">
                  <ProgressRing percentage={notStartedPercentage} color="red" size={80} />
                  <p className="text-sm font-medium text-gray-900 mt-2">{notStartedPercentage}%</p>
                  <p className="text-xs text-gray-600">Not Started</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ✅ Completed Task
              </h3>

              <div className="space-y-3">
                {tasks.filter(task => task.done).slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm line-through">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">Completed recently</p>
                    </div>
                  </div>
                ))}

                {completedTasks === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
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