// routes/task.routes.ts
import express from "express";
import {
  getTasks,
  generateTasks,
  createTask,
  deleteTask,
  toggleTaskDone,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.use(asyncHandler(authenticate));

router.get("/", asyncHandler(getTasks));
router.post("/", asyncHandler(createTask));
router.delete("/:id", asyncHandler(deleteTask));
router.patch("/:id", asyncHandler(toggleTaskDone));
router.post("/generate", asyncHandler(generateTasks));

export default router;
