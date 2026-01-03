import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Column, Todo } from "@/types";
import { useEffect, useState } from "react";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (task: {
        title: string;
        description: string;
        columnId: string;
    }) => Promise<void>;
    columns: Column[];
    initialData?: Todo;
    defaultColumnId?: string;
}

export function TaskDialog({
    open,
    onOpenChange,
    onSubmit,
    columns,
    initialData,
    defaultColumnId,
}: TaskDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [columnId, setColumnId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setTitle(initialData?.title || "");
            setDescription(initialData?.description || "");
            setColumnId(
                initialData?.columnId || defaultColumnId || columns[0]?.id || ""
            );
        }
    }, [open, initialData, defaultColumnId, columns]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !columnId) return;

        try {
            setLoading(true);
            await onSubmit({ title, description, columnId });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save task", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Task" : "Add Task"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="column">Column</Label>
                        <select
                            id="column"
                            value={columnId}
                            onChange={(e) => setColumnId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {columns.map((col) => (
                                <option key={col.id} value={col.id}>
                                    {col.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
