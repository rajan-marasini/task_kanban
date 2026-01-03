import { Button } from "@/components/ui/button";
import {
    createTodo,
    deleteTodo,
    getColumns,
    getTodos,
    updateTodo,
} from "@/lib/api";
import type { Column, Todo } from "@/types";
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { TaskDialog } from "./TaskDialog";

export function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeTask, setActiveTask] = useState<Todo | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Todo | undefined>(undefined);
    const [targetColumnId, setTargetColumnId] = useState<string | undefined>(
        undefined
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cols, todos] = await Promise.all([getColumns(), getTodos()]);
            // Sort tasks by position
            const sortedTodos = todos.sort((a, b) => a.position - b.position);
            setColumns(cols.sort((a, b) => a.position - b.position));
            setTasks(sortedTodos);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Implements drop logic over another task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex] = {
                        ...newTasks[activeIndex],
                        columnId: tasks[overIndex].columnId,
                    };
                    return arrayMove(newTasks, activeIndex, overIndex);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverColumn = over.data.current?.type === "Column";

        // Implements drop logic over a column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const newColumnId = String(overId);

                if (tasks[activeIndex].columnId !== newColumnId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex] = {
                        ...newTasks[activeIndex],
                        columnId: newColumnId,
                    };
                    return arrayMove(newTasks, activeIndex, activeIndex); // Position doesn't change relative to index yet
                }
                return tasks;
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        // If dropped on a column (empty column or specific area)
        if (over.data.current?.type === "Column") {
            const newColumnId = overId;
            if (activeTask.columnId !== newColumnId) {
                // Already handled in DragOver, just persist
                await updateTodo(activeTask.id, {
                    columnId: newColumnId,
                    position: tasks.findIndex((t) => t.id === activeId),
                });
            }
        }
        // If dropped on a task
        else if (over.data.current?.type === "Task") {
            const overTask = tasks.find((t) => t.id === overId);
            if (overTask) {
                // Check if column changed or position changed
                // API Call to persist
                // For simplicity, we just update the columnId and position
                // In a real app we might batch update
                await updateTodo(activeTask.id, {
                    columnId: overTask.columnId,
                    position: tasks.findIndex((t) => t.id === activeId),
                });
            }
        }
    };

    const handleCreateTask = async (data: {
        title: string;
        description: string;
        columnId: string;
    }) => {
        await createTodo(
            data.title,
            data.columnId,
            data.description,
            tasks.filter((t) => t.columnId === data.columnId).length
        );
        fetchData();
    };

    const handleUpdateTask = async (data: {
        title: string;
        description: string;
        columnId: string;
    }) => {
        if (!editingTask) return;
        await updateTodo(editingTask.id, data);
        fetchData();
        setEditingTask(undefined);
    };

    const handleDeleteTask = async (id: string) => {
        await deleteTodo(id);
        fetchData();
    };

    const openAddDialog = (columnId?: string) => {
        setEditingTask(undefined);
        setTargetColumnId(columnId);
        setIsDialogOpen(true);
    };

    const openEditDialog = (task: Todo) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen p-8 bg-background">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Kanban Board</h1>
                <Button onClick={() => openAddDialog()}>Add Task</Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full gap-6 overflow-x-auto pb-4">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            column={col}
                            tasks={tasks.filter((t) => t.columnId === col.id)}
                            onAddTask={openAddDialog}
                            onEditTask={openEditDialog}
                            onDeleteTask={handleDeleteTask}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <TaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                columns={columns}
                initialData={editingTask}
                defaultColumnId={targetColumnId}
            />
        </div>
    );
}
