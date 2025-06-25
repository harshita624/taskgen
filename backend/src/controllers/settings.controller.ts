import { Request, Response } from "express";
import { db } from "../config/db";
import { settings } from "../models/schema";
import { eq } from "drizzle-orm";

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const result = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId))
    .limit(1);

  res.status(200).json(result[0] || {});
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { darkMode, language, notificationsEnabled } = req.body;

  await db
    .insert(settings)
    .values({ userId, darkMode, language, notificationsEnabled })
    .onConflictDoUpdate({
      target: [settings.userId],
      set: { darkMode, language, notificationsEnabled },
    });

  res.status(200).json({ success: true });
};
