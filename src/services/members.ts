import { supabase } from "@/services/supabase";
import type { Profile } from "@/types";

export async function getBoardMembers(boardId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("board_members")
    .select("profiles(id, name, avatar_url)")
    .eq("board_id", boardId);
  if (error) throw error;
  return (data ?? [])
    .flatMap(
      (row) => (row as { profiles: Profile | Profile[] | null }).profiles ?? [],
    )
    .filter((p): p is Profile => p !== null);
}
