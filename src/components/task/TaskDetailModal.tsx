import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useMembers } from "@/hooks/useMembers";
import type { Task, Priority } from "@/types";

const priorities: Priority[] = ["low", "medium", "high"];
const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500";

export function TaskDetailModal({
  task,
  boardId,
  onClose,
}: {
  task: Task | null;
  boardId: string;
  onClose: () => void;
}) {
  return (
    <Modal open={Boolean(task)} onClose={onClose} title="Task details">
      {task && (
        <TaskDetailForm
          key={task.id}
          task={task}
          boardId={boardId}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

function TaskDetailForm({
  task,
  boardId,
  onClose,
}: {
  task: Task;
  boardId: string;
  onClose: () => void;
}) {
  const updateTask = useUpdateTask(boardId);
  const deleteTask = useDeleteTask(boardId);
  const { data: members } = useMembers(boardId);

  // initialised once from the task; key on the parent resets this on task change
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
      { onSuccess: onClose },
    );
  }

  function handleDelete() {
    if (confirm("Delete this task?")) {
      deleteTask.mutate(task.id, { onSuccess: onClose });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Description
        </label>
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
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Priority
          </label>
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
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Due date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Assignee
        </label>
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

      <div className="mt-2 flex items-center justify-between">
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
      </div>
    </div>
  );
}
