import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import type { Column as ColumnType, Task } from "@/types";
import type { TaskPositionUpdate } from "@/services/tasks";
import { Column } from "@/components/board/Column";
import { TaskCardContent } from "@/components/board/TaskCardContent";
import { useCreateColumn } from "@/hooks/useColumns";
import { useMoveTasks } from "@/hooks/useTasks";
import { TaskDetailModal } from "../task/TaskDetailModal";

export function BoardView({
  boardId,
  columns,
  tasks,
}: {
  boardId: string;
  columns: ColumnType[];
  tasks: Task[];
}) {
  const qc = useQueryClient();
  const moveTasks = useMoveTasks(boardId);
  const createColumn = useCreateColumn(boardId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newColumn, setNewColumn] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const tasksFor = (list: Task[], columnId: string) =>
    list
      .filter((t) => t.column_id === columnId)
      .sort((a, b) => a.position - b.position);

  function columnIdOf(id: string, list: Task[]): string | null {
    const task = list.find((t) => t.id === id);
    if (task) return task.column_id;
    if (columns.some((c) => c.id === id)) return id;
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    qc.setQueryData<Task[]>(["tasks", boardId], (old) => {
      if (!old) return old;
      const activeCol = columnIdOf(activeId, old);
      const overCol = columnIdOf(overId, old);
      if (!activeCol || !overCol) return old;

      const activeItem = old.find((t) => t.id === activeId)!;
      const overList = tasksFor(old, overCol);
      const overTaskIndex = overList.findIndex((t) => t.id === overId);

      const without = old.filter((t) => t.id !== activeId);
      const moved = { ...activeItem, column_id: overCol };

      const targetList = without
        .filter((t) => t.column_id === overCol)
        .sort((a, b) => a.position - b.position);
      const insertAt = overTaskIndex >= 0 ? overTaskIndex : targetList.length;
      targetList.splice(insertAt, 0, moved);

      const others = without.filter((t) => t.column_id !== overCol);
      const reindexedTarget = targetList.map((t, i) => ({ ...t, position: i }));
      return [...others, ...reindexedTarget];
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active } = event;
    const activeId = String(active.id);

    const current = qc.getQueryData<Task[]>(["tasks", boardId]) ?? [];
    const activeItem = current.find((t) => t.id === activeId);
    if (!activeItem) return;

    const updates: TaskPositionUpdate[] = [];
    for (const col of columns) {
      tasksFor(current, col.id).forEach((t, i) => {
        updates.push({ id: t.id, column_id: col.id, position: i });
      });
    }
    moveTasks.mutate(updates);
  }

  function addColumn() {
    const trimmed = newColumn.trim();
    if (!trimmed) return;
    createColumn.mutate({ title: trimmed, position: columns.length });
    setNewColumn("");
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasksFor(tasks, column.id)}
            boardId={boardId}
            onTaskClick={setSelectedTask}
          />
        ))}

        <div className="w-72 shrink-0">
          <input
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addColumn()}
            placeholder="+ Add a column"
            className="w-full rounded-xl border border-dashed border-slate-300 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCardContent task={activeTask} dragging /> : null}
      </DragOverlay>
      <TaskDetailModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(null)}
      />
    </DndContext>
  );
}
