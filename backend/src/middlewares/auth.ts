// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
      audience: process.env.CLERK_JWT_AUDIENCE || "https://api.clerk.dev",
    });

    (req as any).user = { id: payload.sub };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
