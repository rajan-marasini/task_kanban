import axios from "axios";
import type { ApiResponse, Column, Todo } from "../types";

const API_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getColumns = async (): Promise<Column[]> => {
    const response = await api.get<ApiResponse<Column[]>>("/columns");
    return response.data.data;
};

export const getTodos = async (): Promise<Todo[]> => {
    const response = await api.get<ApiResponse<Todo[]>>("/todos");
    return response.data.data;
};

export const createTodo = async (
    title: string,
    columnId: string,
    description?: string,
    position?: number
): Promise<Todo> => {
    const response = await api.post<ApiResponse<Todo>>("/todos", {
        title,
        description,
        columnId,
        position,
    });
    return response.data.data;
};

export const updateTodo = async (
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>
): Promise<Todo> => {
    const response = await api.patch<ApiResponse<Todo>>(
        `/todos/${id}`,
        updates
    );
    return response.data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
};
