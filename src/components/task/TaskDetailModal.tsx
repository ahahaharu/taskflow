import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Comments } from "@/components/task/Comments";
import { TaskView } from "@/components/task/TaskView";
import { TaskEditForm } from "@/components/task/TaskEditForm";
import type { Task } from "@/types";
import { Attachments } from "@/components/task/Attachments";

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
    <Modal open={Boolean(task)} onClose={onClose}>
      {task && (
        <TaskDetailContent
          key={task.id}
          task={task}
          boardId={boardId}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

function TaskDetailContent({
  task,
  boardId,
  onClose,
}: {
  task: Task;
  boardId: string;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {editing ? (
        <TaskEditForm
          task={task}
          boardId={boardId}
          onDone={() => setEditing(false)}
        />
      ) : (
        <TaskView
          task={task}
          boardId={boardId}
          onEdit={() => setEditing(true)}
          onClose={onClose}
        />
      )}
      <Attachments boardId={boardId} taskId={task.id} />
      <Comments taskId={task.id} />
    </div>
  );
}
