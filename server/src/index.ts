import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { columns, todo } from "./db/schema";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API running 🚀",
    });
});

app.get("/columns", async (_req, res) => {
    try {
        const result = await db.select().from(columns);
        res.status(200).json({ success: true, data: result });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch columns",
        });
    }
});

app.get("/todos", async (_req, res) => {
    try {
        const todos = await db.select().from(todo);
        res.status(200).json({ success: true, data: todos });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch todos",
        });
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const [task] = await db
            .select()
            .from(todo)
            .where(eq(todo.id, req.params.id));

        if (!task) {
            return res
                .status(404)
                .json({ success: false, message: "Todo not found" });
        }

        res.status(200).json({ success: true, data: task });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch todo",
        });
    }
});

app.post("/todos", async (req, res) => {
    const { title, description, columnId, position } = req.body;

    if (!title || !columnId) {
        return res.status(400).json({
            success: false,
            message: "Title and columnId are required",
        });
    }

    try {
        const [task] = await db
            .insert(todo)
            .values({
                title,
                description,
                columnId,
                position: position ?? 0,
            })
            .returning();

        res.status(201).json({ success: true, data: task });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to create todo",
        });
    }
});

app.patch("/todos/:id", async (req, res) => {
    try {
        const [updated] = await db
            .update(todo)
            .set({ ...req.body, updatedAt: new Date() })
            .where(eq(todo.id, req.params.id))
            .returning();

        if (!updated) {
            return res
                .status(404)
                .json({ success: false, message: "Todo not found" });
        }

        res.status(200).json({ success: true, data: updated });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to update todo",
        });
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const deleted = await db
            .delete(todo)
            .where(eq(todo.id, req.params.id))
            .returning();

        if (!deleted.length) {
            return res
                .status(404)
                .json({ success: false, message: "Todo not found" });
        }

        res.status(200).json({ success: true, message: "Todo deleted" });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete todo",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
