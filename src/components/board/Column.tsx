import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column as ColumnType, Task } from "@/types";
import { TaskCard } from "@/components/board/TaskCard";
import { useRenameColumn, useDeleteColumn } from "@/hooks/useColumns";
import { useCreateTask, useDeleteTask } from "@/hooks/useTasks";

export function Column({
  column,
  tasks,
  boardId,
}: {
  column: ColumnType;
  tasks: Task[];
  boardId: string;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const renameColumn = useRenameColumn(boardId);
  const deleteColumn = useDeleteColumn(boardId);
  const createTask = useCreateTask(boardId);
  const deleteTask = useDeleteTask(boardId);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [newTask, setNewTask] = useState("");

  function saveTitle() {
    const trimmed = title.trim();
    setEditing(false);
    if (trimmed && trimmed !== column.title) {
      renameColumn.mutate({ id: column.id, title: trimmed });
    } else {
      setTitle(column.title);
    }
  }

  function addTask() {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    createTask.mutate({
      columnId: column.id,
      title: trimmed,
      position: tasks.length,
    });
    setNewTask("");
  }

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-100 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === "Enter" && saveTitle()}
            className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none"
          />
        ) : (
          <h3
            onClick={() => setEditing(true)}
            className="cursor-pointer text-sm font-semibold text-slate-700"
          >
            {column.title}{" "}
            <span className="font-normal text-slate-400">{tasks.length}</span>
          </h3>
        )}
        <button
          onClick={() => {
            if (confirm(`Delete column "${column.title}" and its tasks?`)) {
              deleteColumn.mutate(column.id);
            }
          }}
          className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600"
          aria-label="Delete column"
        >
          ✕
        </button>
      </div>

      <div ref={setNodeRef} className="flex min-h-2 flex-1 flex-col gap-2">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={(id) => deleteTask.mutate(id)}
            />
          ))}
        </SortableContext>
      </div>

      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
        placeholder="+ Add a task"
        className="mt-2 rounded-lg border border-transparent bg-white/60 px-2 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
      />
    </div>
  );
}
