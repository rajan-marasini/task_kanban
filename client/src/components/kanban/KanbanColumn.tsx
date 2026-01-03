import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Column, Todo } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
    column: Column;
    tasks: Todo[];
    onAddTask: (columnId: string) => void;
    onEditTask: (task: Todo) => void;
    onDeleteTask: (id: string) => void;
}

export function KanbanColumn({
    column,
    tasks,
    onAddTask,
    onEditTask,
    onDeleteTask,
}: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    return (
        <div className="flex h-full w-[350px] min-w-[350px] flex-col rounded-lg bg-muted/50 p-4 border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{column.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                        {tasks.length}
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddTask(column.id)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto"
            >
                <SortableContext
                    items={taskIds}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
}
