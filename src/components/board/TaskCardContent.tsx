import type { Task } from "@/types";

const priorityBorder: Record<Task["priority"], string> = {
  low: "border-l-emerald-400",
  medium: "border-l-amber-400",
  high: "border-l-rose-500",
};

export function TaskCardContent({
  task,
  onDelete,
  dragging = false,
}: {
  task: Task;
  onDelete?: (id: string) => void;
  dragging?: boolean;
}) {
  return (
    <div
      className={`group flex items-start justify-between gap-2 rounded-lg border border-l-4 border-slate-200 bg-white p-3 text-sm shadow-sm ${priorityBorder[task.priority]} ${dragging ? "shadow-lg" : ""}`}
    >
      <span className="text-slate-800">{task.title}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
          aria-label="Delete task"
        >
          ✕
        </button>
      )}
    </div>
  );
}
