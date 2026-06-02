import { useState } from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column as ColumnType, Task } from "@/types";
import { TaskCard } from "@/components/board/TaskCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";
import { useRenameColumn, useDeleteColumn } from "@/hooks/useColumns";
import { useCreateTask, useDeleteTask } from "@/hooks/useTasks";
import { useMembers } from "@/hooks/useMembers";

export function Column({
  column,
  tasks,
  boardId,
  onTaskClick,
}: {
  column: ColumnType;
  tasks: Task[];
  boardId: string;
  onTaskClick: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const renameColumn = useRenameColumn(boardId);
  const deleteColumn = useDeleteColumn(boardId);
  const createTask = useCreateTask(boardId);
  const deleteTask = useDeleteTask(boardId);
  const { data: members } = useMembers(boardId);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [newTask, setNewTask] = useState("");
  const [confirmDeleteColumnOpen, setConfirmDeleteColumnOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

  function confirmDeleteColumn() {
    deleteColumn.mutate(column.id, {
      onSuccess: () => setConfirmDeleteColumnOpen(false),
    });
  }

  function confirmDeleteTask() {
    if (!taskToDelete) return;
    deleteTask.mutate(taskToDelete.id, {
      onSuccess: () => setTaskToDelete(null),
    });
  }

  return (
    <div className="group/col flex w-[80vw] max-w-72 shrink-0 flex-col rounded-card bg-surface-2 p-3 sm:w-72">
      <div className="mb-3 flex items-center justify-between gap-1 px-1">
        {editing ? (
          <div className="flex w-full items-center gap-1">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="w-full rounded-control border border-line bg-card px-2 py-1 text-sm text-ink outline-none focus:border-line-strong"
            />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={saveTitle}
              className="rounded p-1 text-ink-2 hover:bg-card hover:text-ink"
              aria-label="Save"
            >
              <Check size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h3 className="truncate text-sm font-medium text-ink">
              {column.title}
            </h3>
            {renameColumn.isPending ? (
              <span className="text-ink-muted">
                <ButtonSpinner size={12} />
              </span>
            ) : (
              <span className="rounded-full bg-card px-1.5 py-0.5 text-[11px] font-medium text-ink-muted">
                {tasks.length}
              </span>
            )}
          </div>
        )}
        {!editing && (
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover/col:opacity-100 focus-within:opacity-100">
            <button
              onClick={() => setEditing(true)}
              className="rounded p-1 text-ink-muted transition-colors duration-150 hover:bg-card hover:text-ink"
              aria-label="Rename column"
            >
              <Pencil size={13} strokeWidth={2} />
            </button>
            <button
              onClick={() => setConfirmDeleteColumnOpen(true)}
              className="rounded p-1 text-ink-muted transition-colors duration-150 hover:bg-prio-high-bg hover:text-prio-high-ink"
              aria-label="Delete column"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex min-h-2 flex-1 flex-col gap-2 overflow-y-auto"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={(id) =>
                setTaskToDelete(tasks.find((t) => t.id === id) ?? null)
              }
              onClick={onTaskClick}
              assignee={members?.find((m) => m.id === task.assignee_id) ?? null}
            />
          ))}
        </SortableContext>
      </div>

      <div className="relative mt-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          disabled={createTask.isPending}
          placeholder="+  Add a task"
          className="w-full rounded-control border border-transparent bg-transparent px-2 py-2 pr-8 text-sm text-ink outline-none placeholder:text-ink-muted transition-colors duration-150 hover:bg-card/60 focus:border-line focus:bg-card disabled:opacity-50"
        />
        {createTask.isPending && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted">
            <ButtonSpinner />
          </span>
        )}
      </div>

      <ConfirmDialog
        open={confirmDeleteColumnOpen}
        title="Delete column"
        message={`Delete column "${column.title}" and all of its tasks?`}
        onConfirm={confirmDeleteColumn}
        onClose={() => setConfirmDeleteColumnOpen(false)}
        loading={deleteColumn.isPending}
      />
      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task"
        message={
          taskToDelete
            ? `Delete task "${taskToDelete.title}"?`
            : "Delete this task?"
        }
        onConfirm={confirmDeleteTask}
        onClose={() => setTaskToDelete(null)}
        loading={deleteTask.isPending}
      />
    </div>
  );
}
