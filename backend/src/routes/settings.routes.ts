import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);
router.get("/", getSettings);
router.post("/", updateSettings);

export default router;
