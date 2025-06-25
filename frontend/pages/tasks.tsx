"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/interfaces/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
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

      {/* Add New Task */}
      <TaskForm onTaskCreated={fetchTasks} />

      {/* Task List */}
      <TaskList tasks={tasks} refresh={fetchTasks} />
    </div>
  );
}
