import { Request, Response } from "express";
import { db } from "../config/db";
import { tasks } from "../models/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateTasksFromGemini } from "../utils/gemini";

export const getTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await db.select().from(tasks).where(eq(tasks.userId, user.id));

    const mappedTasks = result.map(task => ({
      ...task,
      completed: task.done || task.completed || false,
      priority: task.priority || "medium",   // ✅ ensure it's present
      due: task.due || new Date().toISOString(), // ✅ placeholder if needed
      tags: task.tags || [], // ✅ fallback empty array
      
    }));

    res.json({ success: true, tasks: mappedTasks });
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const createTask = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().default(""),
    category: z.string().optional(),
    priority: z.enum(["high", "medium", "low"]).default("medium"),
    categoryIdInt: z.number().int().positive().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error });
  }

  try {
    const { title, description, category, priority, categoryIdInt } = parsed.data;

    const newTask = {
      userId,
      title,
      description,
      category,
      priority,
      done: false,
      completed: false,
      ...(categoryIdInt !== undefined && { categoryIdInt })
    };

    const [task] = await db.insert(tasks).values(newTask).returning();

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("❌ Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};



export const deleteTask = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    await db.delete(tasks).where(eq(tasks.id, id));
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const toggleTaskDone = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const { done, completed } = req.body;
  const isCompleted = done !== undefined ? done : completed;

  try {
    const [updatedTask] = await db.update(tasks)
      .set({ 
        done: isCompleted, 
        completed: isCompleted,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, id))
      .returning();

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("❌ Toggle task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const generateTasks = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // ✅ Updated schema to include priority and categoryId
  const schema = z.object({
    topic: z.string().min(2),
    priority: z.enum(["high", "medium", "low"]).optional(),
    categoryId: z.number(), // 👈 make categoryId required
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input", details: result.error });
  }

  const { topic, priority, categoryId } = result.data;

  try {
    const aiTasks = await generateTasksFromGemini(topic);

    // Use specified priority or random fallback
    const priorities = ["high", "medium", "low"] as const;
    const getRandomPriority = () =>
      priorities[Math.floor(Math.random() * priorities.length)];

    const taskInserts = aiTasks.map((title: string) => ({
      userId,
      title,
      description: `Generated from topic: ${topic}`,
      priority: priority || getRandomPriority(), // use selected or random
      categoryIdInt: categoryId, // ✅ save category ID properly
      done: false,
      completed: false,
    }));

    const inserted = await db.insert(tasks).values(taskInserts).returning();

    res.status(201).json({ success: true, tasks: inserted });
  } catch (error) {
    console.error("❌ Task generation failed:", error);
    res.status(500).json({ error: "AI Task generation failed" });
  }
};