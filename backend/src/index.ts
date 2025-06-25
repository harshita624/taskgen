import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import taskRoutes from "./routes/task.routes";
import categoryRoutes from "./routes/category.routes"; // ✅
import settingsRoutes from "./routes/settings.routes";
import chatRoutes from "./routes/chat.routes";
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/tasks", taskRoutes);
app.use("/categories", categoryRoutes); // ✅ Correctly mount categories
app.use("/settings", settingsRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

export default app;
