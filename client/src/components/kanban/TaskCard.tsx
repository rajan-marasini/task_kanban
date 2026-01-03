import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Todo } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";

interface TaskCardProps {
    task: Todo;
    onEdit: (task: Todo) => void;
    onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-[100px] w-full rounded-xl border-2 border-primary/20 bg-background opacity-50"
            />
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
        >
            <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start justify-between">
                <CardTitle className="text-sm font-medium leading-none break-all pr-6">
                    {task.title}
                </CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(task.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
