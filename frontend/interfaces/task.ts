export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
    updatedAt?: string; // ✅ Add this
    categoryIdInt: number; // ✅ Add this line
  // 👇 Add these for vital task filtering
  priority: "high" | "medium" | "low";
  due: string;
  tags: string[];
}
