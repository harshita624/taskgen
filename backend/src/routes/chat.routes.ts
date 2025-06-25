import express from "express";
import { handleChat } from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate); // Optional: remove if you want chat to be public
router.post("/", handleChat);

export default router;