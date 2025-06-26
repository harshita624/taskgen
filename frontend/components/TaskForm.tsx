import { useState, useRef, useEffect, FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import { Loader2, Plus, AlertCircle, CheckCircle2, FileText, Tag } from "lucide-react";

type Category = { id: number; name: string };

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

  const maxWords = 500;
  const wordCount = description.length;

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.categories);
      } catch (e) {
        console.error("Fetch categories failed", e);
        setError("Could not load categories.");
      }
    })();
  }, [getToken]);

  const handlePriorityChange = (level: "high" | "medium" | "low") => {
    setPriority(level);
    (document.activeElement as HTMLElement)?.blur();
  };

  const getPriorityIcon = (level: string) =>
    level === "high" ? "🔥" : level === "medium" ? "⚡" : "🌱";

  const getPriorityColor = (level: string, isSelected: boolean) => {
    if (!isSelected) return "border-gray-200 bg-white hover:border-gray-300 text-gray-700";
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-300";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-300";
      case "low":
        return "text-green-600 bg-green-50 border-green-300";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      titleInputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      await api.post(
        "/tasks",
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          categoryId: categoryId === "" ? undefined : categoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategoryId("");
      setSuccess(true);
      onTaskCreated?.();
      titleInputRef.current?.focus();
    } catch (e: any) {
      console.error("Create task failed", e);
      setError(e.response?.data?.error || "Task creation error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          <AlertCircle /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          <CheckCircle2 /> Task created successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            placeholder="e.g., Review quarterly reports"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />
          <FileText className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          maxLength={maxWords}
          placeholder="Add more details..."
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring resize-none"
        />
        <p className="text-xs text-gray-500">{wordCount}/{maxWords}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Priority</label>
        <div className="grid grid-cols-3 gap-2">
          {(["high", "medium", "low"] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              disabled={loading}
              onClick={() => handlePriorityChange(lvl)}
              className={`${getPriorityColor(lvl, priority === lvl)} flex items-center justify-center p-2 border rounded`}
            >
              {getPriorityIcon(lvl)} {lvl}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
          <Tag className="w-4 h-4" /> Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
          disabled={loading}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring cursor-pointer"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded disabled:bg-gray-300"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Plus />} Add Task
      </button>
    </form>
  );
}
