import { AlignLeft, Calendar } from "lucide-react";
import type { Task, Priority, Profile } from "@/types";
import { Avatar } from "@/components/shared/Avatar";

const priorityPill: Record<Priority, string> = {
  low: "bg-prio-low-bg text-prio-low-ink",
  medium: "bg-prio-med-bg text-prio-med-ink",
  high: "bg-prio-high-bg text-prio-high-ink",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isOverdue(iso: string) {
  const due = new Date(iso);
  const now = new Date();
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return due.getTime() < now.getTime();
}

export function TaskCardContent({
  task,
  dragging = false,
  assignee,
}: {
  task: Task;
  onDelete?: (id: string) => void;
  dragging?: boolean;
  assignee?: Profile | null;
}) {
  const overdue = task.due_date ? isOverdue(task.due_date) : false;
  const hasMeta =
    task.due_date || task.description || assignee || task.priority;

  return (
    <div
      className={`rounded-card border border-line bg-card p-3 text-sm transition duration-150 ${dragging ? "shadow-paper-hover" : "shadow-paper hover:border-line-strong hover:shadow-paper-hover"}`}
    >
      <p className="font-medium leading-snug text-ink">{task.title}</p>
      {hasMeta && (
        <div className="mt-2.5 flex items-center gap-2 text-[12px] text-ink-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${priorityPill[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.due_date && (
            <span
              className={`inline-flex items-center gap-1 ${overdue ? "text-prio-high-ink" : "text-ink-2"}`}
            >
              <Calendar size={12} strokeWidth={2} />
              {formatDate(task.due_date)}
            </span>
          )}
          {task.description && (
            <AlignLeft
              size={12}
              strokeWidth={2}
              className="text-ink-muted"
              aria-label="Has description"
            />
          )}
          <span className="ml-auto">
            {assignee && (
              <Avatar name={assignee.name} url={assignee.avatar_url} size="sm" />
            )}
          </span>
        </div>
      )}
    </div>
  );
}
