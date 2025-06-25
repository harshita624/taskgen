"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";

type Category = { id: number; name: string };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { getToken } = useAuth();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("❌ Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setSaving(true);
    try {
      const token = await getToken();
      const res = await api.post(
        "/categories",
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, res.data.category]);
      setNewCategory("");
    } catch (err) {
      console.error("❌ Failed to add category:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setDeletingId(id);
    try {
      const token = await getToken();
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete category:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditValue(cat.name);
  };

  const saveEdit = async () => {
    if (!editValue.trim() || editId === null) return;
    setSaving(true);
    try {
      const token = await getToken();
      const res = await api.put(
        `/categories/${editId}`,
        { name: editValue.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editId ? res.data.category : cat))
      );
      setEditId(null);
      setEditValue("");
    } catch (err) {
      console.error("❌ Failed to update category:", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">🗂️ Task Categories</h1>
      <p className="text-gray-500 mb-6">Manage your task categories below.</p>

      {/* Add Form */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Add new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCategory}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center text-sm font-medium transition"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Add
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-400 col-span-full">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border shadow-sm rounded-lg p-4 flex items-center justify-between transition hover:shadow-md"
            >
              {editId === cat.id ? (
                <div className="flex-1 flex gap-2 items-center">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm w-full"
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-700 font-medium">{cat.name}</p>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={deletingId === cat.id}
                >
                  {deletingId === cat.id ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
