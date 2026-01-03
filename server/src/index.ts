import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/errorHandle";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Kanban API running 🚀" });
});

// Error Middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
