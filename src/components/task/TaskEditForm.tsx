import { useState } from "react";
import { useMembers } from "@/hooks/useMembers";
import { useUpdateTask } from "@/hooks/useTasks";
import type { Task, Priority } from "@/types";

const priorities: Priority[] = ["low", "medium", "high"];
const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500";
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

export function TaskEditForm({
  task,
  boardId,
  onDone,
}: {
  task: Task;
  boardId: string;
  onDone: () => void;
}) {
  const updateTask = useUpdateTask(boardId);
  const { data: members } = useMembers(boardId);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [assignee, setAssignee] = useState(task.assignee_id ?? "");

  function handleSave() {
    updateTask.mutate(
      {
        id: task.id,
        updates: {
          title: title.trim() || task.title,
          description: description.trim() || null,
          priority,
          due_date: dueDate || null,
          assignee_id: assignee || null,
        },
      },
      { onSuccess: onDone }, // back to view; cache invalidation refreshes the data
    );
  }

  return (
    <>
      <div>
        <label className={labelClass}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Add more detail…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={fieldClass}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Assignee</label>
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className={fieldClass}
        >
          <option value="">Unassigned</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name?.trim() || "Unnamed"}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={onDone}
          className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={updateTask.isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {updateTask.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </>
  );
}
