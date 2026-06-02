import { useState } from "react";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useDeleteTask } from "@/hooks/useTasks";
import { Avatar } from "@/components/shared/Avatar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Task, Priority } from "@/types";

const labelClass =
  "mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-ink-muted";
const priorityBadge: Record<Priority, string> = {
  low: "bg-prio-low-bg text-prio-low-ink",
  medium: "bg-prio-med-bg text-prio-med-ink",
  high: "bg-prio-high-bg text-prio-high-ink",
};

export function TaskView({
  task,
  boardId,
  onEdit,
  onClose,
}: {
  task: Task;
  boardId: string;
  onEdit: () => void;
  onClose: () => void;
}) {
  const { data: members } = useMembers(boardId);
  const deleteTask = useDeleteTask(boardId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const assignee = members?.find((m) => m.id === task.assignee_id) ?? null;
  const assigneeName = assignee?.name?.trim() || null;

  function handleConfirmDelete() {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        onClose();
      },
    });
  }

  return (
    <>
      <h2 className="font-serif text-xl font-semibold tracking-tight text-ink">
        {task.title}
      </h2>

      <div>
        <span className={labelClass}>Description</span>
        {task.description ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {task.description}
          </p>
        ) : (
          <p className="text-sm italic text-ink-muted">No description</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className={labelClass}>Priority</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${priorityBadge[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <div>
          <span className={labelClass}>Due date</span>
          {task.due_date ? (
            <span className="inline-flex items-center gap-1.5 text-ink">
              <Calendar size={13} strokeWidth={2} className="text-ink-muted" />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          ) : (
            <span className="text-ink-muted">—</span>
          )}
        </div>
        <div>
          <span className={labelClass}>Assignee</span>
          {assigneeName ? (
            <span className="inline-flex items-center gap-1.5 text-ink">
              <Avatar
                name={assignee?.name}
                url={assignee?.avatar_url}
                size="sm"
              />
              {assigneeName}
            </span>
          ) : (
            <span className="text-ink-muted">Unassigned</span>
          )}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-line pt-4">
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-1.5 rounded-control px-2.5 py-1.5 text-sm text-ink-muted transition-colors duration-150 hover:bg-prio-high-bg hover:text-prio-high-ink"
        >
          <Trash2 size={14} strokeWidth={2} />
          Delete
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="rounded-control px-4 py-2 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-control bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
          >
            <Pencil size={14} strokeWidth={2} />
            Edit
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete task"
        message={`Delete task "${task.title}"?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
        loading={deleteTask.isPending}
      />
    </>
  );
}
