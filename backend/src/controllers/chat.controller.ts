import { Request, Response } from "express";
import { chatWithGemini } from "../utils/geminiChat";

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const reply = await chatWithGemini(message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chat controller error:", error);
    res.status(500).json({ error: "Something went wrong while chatting." });
  }
};
