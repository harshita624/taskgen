import { useState, useRef, useEffect } from "react";
import { Loader2, Plus, AlertCircle, CheckCircle2, FileText, Tag } from "lucide-react";

// Mock API for demonstration
const mockApi = {
  get: async (url, config) => {
    console.log('GET request to:', url);
    return { data: { categories: [
      { id: 1, name: 'Work' },
      { id: 2, name: 'Personal' },
      { id: 3, name: 'Shopping' },
      { id: 4, name: 'Health' },
    ] } };
  },
  post: async (url, data, config) => {
    console.log('POST request to:', url, 'with data:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { task: { id: Date.now(), ...data } } });
      }, 1000);
    });
  }
};

// Mock auth hook
const useAuth = () => ({
  getToken: async () => 'mock-token'
});

type Category = {
  id: number;
  name: string;
};

export default function TaskForm({ onTaskCreated }: { onTaskCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getToken();
        const res = await mockApi.get("/categories", {
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

  // Clear messages after timeout
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a task title");
      titleInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");

      await mockApi.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryIdInt: categoryId === "" ? undefined : categoryId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategoryId("");
      setSuccess(true);
      if (onTaskCreated) onTaskCreated();
      titleInputRef.current?.focus();
    } catch (err: any) {
      console.error("Task creation error:", err);
      setError(err.response?.data?.error || "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = (newPriority: "high" | "medium" | "low") => {
    console.log('Priority changing from', priority, 'to', newPriority);
    setPriority(newPriority);
  };

  const getPriorityIcon = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "high": return "🔥";
      case "medium": return "⚡";
      case "low": return "🌱";
      default: return "⚡";
    }
  };

  const getPriorityColor = (priorityLevel: string, isSelected: boolean) => {
    if (!isSelected) {
      return "border-gray-200 bg-white hover:border-gray-300 text-gray-700";
    }
    
    switch (priorityLevel) {
      case "high": return "text-red-600 bg-red-50 border-red-300";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-300";
      case "low": return "text-green-600 bg-green-50 border-green-300";
      default: return "text-orange-600 bg-orange-50 border-orange-300";
    }
  };

  const wordCount = description.length;
  const maxWords = 500;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Create New Task</h2>
            <p className="text-emerald-100 text-sm">Add a task to your workflow</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Task created successfully!</span>
          </div>
        )}

        {/* Task Title */}
        <div className="space-y-2">
          <label htmlFor="task-title" className="block text-sm font-semibold text-gray-700">
            Task Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="task-title"
              ref={titleInputRef}
              className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200 bg-white placeholder-gray-400"
              placeholder="e.g., Review quarterly reports, Call client about project..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            {title && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Be clear and specific about what needs to be done</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="task-desc" className="block text-sm font-semibold text-gray-700">
            Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              id="task-desc"
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200 bg-white placeholder-gray-400 resize-none"
              placeholder="Add more details, context, or notes about this task..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              maxLength={maxWords}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {wordCount}/{maxWords}
            </div>
          </div>
        </div>

        {/* Priority & Category Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Priority Selection - FIXED VERSION */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Priority Level</label>
            <div className="space-y-2">
              {(["high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePriorityChange(p)}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 p-3 border-2 rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${getPriorityColor(p, priority === p)}`}
                >
                  <span className="text-lg">{getPriorityIcon(p)}</span>
                  <span className="font-medium capitalize">{p}</span>
                  {priority === p && (
                    <span className="ml-auto w-2 h-2 bg-current rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">Current selection: {priority}</p>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-200 bg-white appearance-none cursor-pointer"
              >
                <option value="">🗂️ No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
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

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold text-sm px-6 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating task...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Task
              </>
            )}
          </button>
          
          {/* Help text */}
          <p className="text-center text-xs text-gray-500 mt-3">
            Click to create task, priority selection works with buttons above
          </p>
        </div>
      </div>
    </div>
  );
}