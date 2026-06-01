import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCardContent } from "@/components/board/TaskCardContent";
import type { Task, Profile } from "@/types";

export function TaskCard({
  task,
  onDelete,
  onClick,
  assignee,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  assignee?: Profile | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="cursor-grab touch-none"
    >
      <TaskCardContent task={task} onDelete={onDelete} assignee={assignee} />
    </div>
  );
}
