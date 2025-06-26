export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
    updatedAt?: string; // ✅ Add this
  // 👇 Add these for vital task filtering
  priority: "high" | "medium" | "low";
  due: string;
  tags: string[];
}
