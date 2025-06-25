"use client";

import { Task } from "../interfaces/task";
import api from "../lib/api";
import { useState } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function TaskCard({ task, refresh }: { task: Task; refresh: () => void }) {
  const [loading, setLoading] = useState(false);

  const toggleDone = async () => {
    try {
      setLoading(true);
      await api.put(`/tasks/${task.id}`, { done: !task.done });
      refresh();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${task.id}`);
      refresh();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow-sm rounded-lg border flex justify-between items-start transition hover:shadow-md">
      <div className="flex-1 pr-4">
        <h2
          className={`font-semibold text-lg break-words ${
            task.done ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </h2>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 items-end">
        <button
          onClick={toggleDone}
          disabled={loading}
          className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition ${
            task.done
              ? "text-yellow-600 hover:bg-yellow-50"
              : "text-green-600 hover:bg-green-50"
          } disabled:opacity-50`}
          aria-label={task.done ? "Mark as not done" : "Mark as done"}
        >
          {task.done ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {task.done ? "Undo" : "Done"}
        </button>

        <button
          onClick={deleteTask}
          disabled={loading}
          className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded transition disabled:opacity-50"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
