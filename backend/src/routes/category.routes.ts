// routes/category.routes.ts
import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.use(asyncHandler(authenticate));

router.get("/", asyncHandler(getCategories));
router.post("/", asyncHandler(createCategory));
router.put("/:id", asyncHandler(updateCategory));
router.delete("/:id", asyncHandler(deleteCategory));

export default router;
