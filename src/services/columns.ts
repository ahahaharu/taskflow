import { supabase } from "@/services/supabase";
import type { Column } from "@/types";

export async function getColumns(boardId: string): Promise<Column[]> {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createColumn(
  boardId: string,
  title: string,
  position: number,
): Promise<Column> {
  const { data, error } = await supabase
    .from("columns")
    .insert({ board_id: boardId, title, position })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function renameColumn(id: string, title: string): Promise<void> {
  const { error } = await supabase
    .from("columns")
    .update({ title })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteColumn(id: string): Promise<void> {
  const { error } = await supabase.from("columns").delete().eq("id", id);
  if (error) throw error;
}
