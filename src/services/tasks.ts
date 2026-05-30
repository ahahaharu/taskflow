import { supabase } from "@/services/supabase";
import type { Task } from "@/types";

export interface TaskPositionUpdate {
  id: string;
  column_id: string;
  position: number;
}

export async function getTasks(boardId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, columns!inner(board_id)")
    .eq("columns.board_id", boardId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const task = { ...row } as Record<string, unknown>;
    delete task.columns; // strip the join helper field
    return task as unknown as Task;
  });
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
