"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Task } from "@/interfaces/task";
import api from "@/lib/api";
import { format, isSameDay, parseISO } from "date-fns";
import { 
  CalendarX2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Clock,
  Tag,
  Trash2,
  RotateCcw,
  AlertCircle,
  ListTodo,
  CheckSquare
} from "lucide-react";
import DatePicker from "react-datepicker";
import clsx from "clsx";

type Category = {
  id: number;
  name: string;
  color?: string;
};

export default function TaskList({
  tasks,
  refresh,
}: {
  tasks: Task[];
  refresh: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token");

        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [getToken]);

  const toggleDone = async (id: number, done: boolean) => {
    setLoading(id);
    try {
      await api.patch(`/tasks/${id}`, { done: !done });
      refresh();
    } catch {
      alert("Error updating task.");
    } finally {
      setLoading(null);
    }
  };

  const deleteTask = async (id: number) => {
    if (confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      setLoading(id);
      try {
        await api.delete(`/tasks/${id}`);
        refresh();
      } catch {
        alert("Error deleting task.");
      } finally {
        setLoading(null);
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const getCategoryColor = (categoryId: number) => {
    const colors = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-yellow-100 text-yellow-800", "bg-red-100 text-red-800"];
    return colors[categoryId % colors.length] || "bg-gray-100 text-gray-800";
  };

  const groupedByDate = tasks.reduce((acc, task) => {
    const date = format(new Date(task.createdAt || task.updatedAt || Date.now()), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = { done: [], undone: [] };
    acc[date][task.done ? "done" : "undone"].push(task);
    return acc;
  }, {} as Record<string, { done: Task[]; undone: Task[] }>);

  const filterCounts = {
    all: tasks.length,
    undone: tasks.filter(t => !t.done).length,
    done: tasks.filter(t => t.done).length
  };

  const hasActiveFilters = selectedDate || selectedCategory !== "" || search;

  const clearAllFilters = () => {
    setSelectedDate(null);
    setSelectedCategory("");
    setSearch("");
    setFilter("all");
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ListTodo className="w-6 h-6 text-blue-600" />
              Your Tasks
            </h2>
            <p className="text-gray-600 mt-1">Manage and track your daily tasks</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {filterCounts.done}/{filterCounts.all} completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{filterCounts.all}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{filterCounts.undone}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{filterCounts.done}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Filters</h3>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isFilterOpen ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Content */}
        <div className={clsx(
          "transition-all duration-300 overflow-hidden",
          isFilterOpen ? "max-h-96 p-4" : "max-h-0"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Circle className="w-4 h-4" />
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(["all", "undone", "done"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      filter === f
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)} ({filterCounts[f]})
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="Select date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-red-500 hover:text-red-600 p-1"
                    title="Clear date filter"
                  >
                    <CalendarX2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Search className="w-4 h-4" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-4">
        {Object.entries(groupedByDate).length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500">Create your first task to get started!</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([dateKey, { done, undone }]) => {
            const parsedDate = parseISO(new Date(dateKey).toISOString());

            if (selectedDate && !isSameDay(parsedDate, selectedDate)) return null;

            const filterTasks = (list: Task[]) =>
              list.filter((task) => {
                const matchesStatus = filter === "all" || (filter === "done") === task.done;
                const matchesCategory =
                  selectedCategory === "" || Number(task.categoryIdInt) === Number(selectedCategory);
                const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase());
                return matchesStatus && matchesCategory && matchesSearch;
              });

            const filteredDone = filterTasks(done);
            const filteredUndone = filterTasks(undone);

            if (filteredDone.length === 0 && filteredUndone.length === 0) return null;

            return (
              <div key={dateKey} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Date Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      {format(new Date(dateKey), "EEEE, MMMM dd, yyyy")}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {filteredUndone.length + filteredDone.length} tasks
                      </span>
                      {filteredDone.length > 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {filteredDone.length} completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* UNDONE Tasks */}
                  {filteredUndone.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <Circle className="w-4 h-4" />
                        Pending ({filteredUndone.length})
                      </h3>
                      <div className="space-y-3">
                        {filteredUndone.map((task) => (
                          <div
                            key={task.id}
                            className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-orange-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => toggleDone(task.id, task.done)}
                                    disabled={loading === task.id}
                                    className="mt-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                                  >
                                    {loading === task.id ? (
                                      <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                                    ) : (
                                      <Circle className="w-5 h-5" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                                    {task.description && (
                                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                    )}
                                    {task.categoryIdInt && (
                                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.categoryIdInt)}`}>
                                        <Tag className="w-3 h-3" />
                                        {getCategoryName(task.categoryIdInt)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => toggleDone(task.id, task.done)}
                                  disabled={loading === task.id}
                                  className="text-green-600 hover:text-green-700 text-xs font-medium px-3 py-1 rounded-full bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  disabled={loading === task.id}
                                  className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DONE Tasks */}
                  {filteredDone.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed ({filteredDone.length})
                      </h3>
                      <div className="space-y-3">
                        {filteredDone.map((task) => (
                          <div
                            key={task.id}
                            className="group border border-green-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-white"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-600 line-through mb-1">{task.title}</h4>
                                    {task.description && (
                                      <p className="text-sm text-gray-500 line-through mb-2">{task.description}</p>
                                    )}
                                    {task.categoryIdInt && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                        <Tag className="w-3 h-3" />
                                        {getCategoryName(task.categoryIdInt)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => toggleDone(task.id, task.done)}
                                  disabled={loading === task.id}
                                  className="text-orange-600 hover:text-orange-700 text-xs font-medium px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Undo
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  disabled={loading === task.id}
                                  className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}