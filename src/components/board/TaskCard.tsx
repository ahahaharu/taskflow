import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { TaskCardContent } from "@/components/board/TaskCardContent";

export function TaskCard({
  task,
  onDelete,
  onClick,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
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
      <TaskCardContent task={task} onDelete={onDelete} />
    </div>
  );
}
