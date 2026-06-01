import { useMembers } from "@/hooks/useMembers";
import { useDeleteTask } from "@/hooks/useTasks";
import type { Task, Priority } from "@/types";

const labelClass = "mb-1 block text-xs font-medium text-slate-500";
const priorityBadge: Record<Priority, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
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

  const assigneeName =
    members?.find((m) => m.id === task.assignee_id)?.name?.trim() || null;

  function handleDelete() {
    if (confirm("Delete this task?")) {
      deleteTask.mutate(task.id, { onSuccess: onClose });
    }
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">{task.title}</h2>

      <div>
        <span className={labelClass}>Description</span>
        {task.description ? (
          <p className="whitespace-pre-wrap text-sm text-slate-700">
            {task.description}
          </p>
        ) : (
          <p className="text-sm italic text-slate-400">No description</p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <span className={labelClass}>Priority</span>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadge[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <div>
          <span className={labelClass}>Due date</span>
          <span className="text-slate-700">
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
          </span>
        </div>
        <div>
          <span className={labelClass}>Assignee</span>
          <span className="text-slate-700">{assigneeName ?? "Unassigned"}</span>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
