
export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
  updatedAt?: string;
  categoryIdInt?: number;
  // Make these optional to prevent white screen issues
  priority?: "high" | "medium" | "low";
  due?: string;
  tags?: string[];
}