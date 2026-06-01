import { supabase } from "@/services/supabase";
import type { Comment, Profile } from "@/types";

export interface CommentWithAuthor extends Comment {
  author: Profile | null;
}

export async function getComments(
  taskId: string,
): Promise<CommentWithAuthor[]> {
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = comments ?? [];
  if (rows.length === 0) return [];

  const authorIds = [...new Set(rows.map((c) => c.user_id))];
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", authorIds);
  if (pErr) throw pErr;

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return rows.map((c) => ({ ...c, author: byId.get(c.user_id) ?? null }));
}

export async function addComment(
  taskId: string,
  content: string,
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .insert({ task_id: taskId, content });
  if (error) throw error;
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}
