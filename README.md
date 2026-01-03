# Modern Kanban Board

A full-stack Kanban board application built with React, Node.js, and PostgreSQL. Features a clean, modern UI with drag-and-drop task management.

![Kanban Board](./assets/Screenshot.png)

## 🚀 Features

-   **Drag and Drop**: Smooth drag-and-drop interface for managing tasks between columns (To Do, In Progress, Done).
-   **CRUD Operations**: Create, Read, Update, and Delete tasks easily.
-   **Persistence**: All data is stored in a PostgreSQL database via a RESTful API.
-   **Modern UI**: Built with Shadcn UI and Tailwind CSS for a premium look and feel.
-   **Responsive**: Adapts to different screen sizes.

## 🛠 Tech Stack

### Frontend

-   **React 19**: Modern UI library.
-   **Vite**: Fast build tool and dev server.
-   **TypeScript**: Type safety.
-   **Tailwind CSS**: Utility-first styling.
-   **Shadcn UI**: Accessible and customizable component library.
-   **@dnd-kit**: Lightweight, accessible drag-and-drop toolkit.
-   **Axios**: HTTP client.

### Backend

-   **Node.js**: Runtime environment.
-   **Express**: Web framework.
-   **Drizzle ORM**: TypeScript ORM for SQL.
-   **PostgreSQL**: Relational database.
-   **Bun**: Fast JavaScript runtime and package manager.

## 📋 Prerequisites

-   [PostgreSQL](https://www.postgresql.org/) running locally
-   Node.js (v18+)

## 🚀 Getting Started

### 1. Database Setup

Ensure your PostgreSQL server is running. Create a `.env` file in the `server` directory with your database connection string:

```env
DATABASE_URL=postgres://user:password@localhost:5432/your_database
PORT=3000
```

(Note: Check `server/.env` and `server/src/db/index.ts` for specific configuration).

### 2. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Push the schema to the database:

```bash
npm run db:push
```

Seed the database with default columns:

```bash
npm run  db:seed
```

Start the server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### 3. Client Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
bun install
```

Start the client development server:

```bash
bun dev
```

The client will start on `http://localhost:5173`.

## 📡 API Endpoints

The backend exposes the following RESTful endpoints:

-   `GET /columns`: Fetch all columns.
-   `GET /todos`: Fetch all tasks.
-   `GET /todos/:id`: Fetch a single task.
-   `POST /todos`: Create a new task.
-   `PATCH /todos/:id`: Update a task (status, content, position).
-   `DELETE /todos/:id`: Delete a task.
