import { supabase } from "@/services/supabase";
import type { Priority, Task } from "@/types";

export interface TaskPositionUpdate {
  id: string;
  column_id: string;
  position: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: Priority;
  due_date?: string | null;
  assignee_id?: string | null;
}

export async function getTasks(boardId: string): Promise<Task[]> {
  const { data: columns, error: colErr } = await supabase
    .from("columns")
    .select("id")
    .eq("board_id", boardId);
  if (colErr) throw colErr;

  const columnIds = (columns ?? []).map((c) => c.id);
  if (columnIds.length === 0) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, column_id, title, description, priority, due_date, assignee_id, position, created_by, created_at",
    )
    .in("column_id", columnIds)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createTask(
  columnId: string,
  title: string,
  position: number,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ column_id: columnId, title, position })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(
  id: string,
  updates: TaskUpdate,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function moveTasks(updates: TaskPositionUpdate[]): Promise<void> {
  const results = await Promise.all(
    updates.map((u) =>
      supabase
        .from("tasks")
        .update({ column_id: u.column_id, position: u.position })
        .eq("id", u.id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}
