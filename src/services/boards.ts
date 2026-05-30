import { supabase } from "@/services/supabase";
import type { Board } from "@/types";

export async function getBoards(): Promise<Board[]> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createBoard(title: string): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert({ title })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBoard(id: string): Promise<void> {
  const { error } = await supabase.from("boards").delete().eq("id", id);
  if (error) throw error;
}

export async function getBoard(id: string): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
