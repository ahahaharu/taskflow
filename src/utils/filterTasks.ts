import type { Task } from "@/types";
import type { BoardFilters } from "@/types/filters";

export function filterTasks(tasks: Task[], f: BoardFilters): Task[] {
  const q = f.query.trim().toLowerCase();
  return tasks.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q)) return false;
    if (f.priority !== "all" && t.priority !== f.priority) return false;
    if (f.assignee !== "all" && t.assignee_id !== f.assignee) return false;
    return true;
  });
}
