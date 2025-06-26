"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import TaskList from "@/components/TaskList";
import TopicInput from "@/components/TopicInput";
import { Task } from "@/interfaces/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const { getToken } = useAuth();

  const fetchTasks = async () => {
    try {
      const token = await getToken();
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data?.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">📋 Your Tasks</h1>

      {/* AI Task Generator */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowTopicInput((v) => !v)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          {showTopicInput ? "Close AI Input" : "AI Generate Tasks"}
        </button>
      </div>
      {showTopicInput && (
        <div className="max-w-2xl mx-auto">
          <TopicInput
            onTasksGenerated={() => {
              fetchTasks();
              setShowTopicInput(false);
            }}
          />
        </div>
      )}

      {/* Task List */}
      <TaskList tasks={tasks} refresh={fetchTasks} />
    </div>
  );
}
