import type { Task } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import type { Profile } from "@/types";

const priorityBorder: Record<Task["priority"], string> = {
  low: "border-l-emerald-400",
  medium: "border-l-amber-400",
  high: "border-l-rose-500",
};

export function TaskCardContent({
  task,
  onDelete,
  dragging = false,
  assignee,
}: {
  task: Task;
  onDelete?: (id: string) => void;
  dragging?: boolean;
  assignee?: Profile | null;
}) {
  return (
    <div
      className={`group flex items-start justify-between gap-2 rounded-lg border border-l-4 border-slate-200 bg-white p-3 text-sm shadow-sm ${priorityBorder[task.priority]} ${dragging ? "shadow-lg" : ""}`}
    >
      <span className="text-slate-800">{task.title}</span>
      <div className="flex shrink-0 items-center gap-1">
        {assignee && (
          <Avatar name={assignee.name} url={assignee.avatar_url} size="sm" />
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="rounded p-0.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
            aria-label="Delete task"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
