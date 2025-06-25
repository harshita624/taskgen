import { Request, Response } from "express";
import { db } from "../config/db";
import { categories } from "../models/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET all categories for a user
export const getCategories = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await db.select().from(categories).where(eq(categories.userId, userId));
    res.status(200).json({ categories: result });
  } catch (err) {
    console.error("❌ Get categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST create category
export const createCategory = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const schema = z.object({ name: z.string().min(1, "Name required") });

  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: "Invalid input", details: result.error });

  try {
    const [created] = await db.insert(categories).values({
      userId,
      name: result.data.name,
    }).returning();

    res.status(201).json({ category: created });
  } catch (err) {
    console.error("❌ Create category error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// PUT update category
export const updateCategory = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const id = parseInt(req.params.id);
  const schema = z.object({ name: z.string().min(1) });
  const result = schema.safeParse(req.body);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!result.success) return res.status(400).json({ error: "Invalid input" });

  try {
    const [updated] = await db.update(categories)
      .set({ name: result.data.name })
      .where(eq(categories.id, id))
      .returning();

    res.status(200).json({ category: updated });
  } catch (err) {
    console.error("❌ Update category error:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const id = parseInt(req.params.id);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await db.delete(categories).where(eq(categories.id, id));
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    console.error("❌ Delete category error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
