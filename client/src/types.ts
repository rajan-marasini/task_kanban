export interface Column {
    id: string;
    name: string;
    position: number;
}

export interface Todo {
    id: string;
    columnId: string;
    title: string;
    description: string | null;
    position: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
