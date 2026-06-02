import { supabase } from "@/services/supabase";
import type { Activity, Profile } from "@/types";

export interface ActivityWithUser extends Activity {
  user: Profile | null;
}

export async function getActivity(
  boardId: string,
): Promise<ActivityWithUser[]> {
  const { data: rows, error } = await supabase
    .from("activity")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;

  const events = rows ?? [];
  if (events.length === 0) return [];

  const userIds = [
    ...new Set(events.map((e) => e.user_id).filter(Boolean)),
  ] as string[];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", userIds);

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return events.map((e) => ({
    ...e,
    user: e.user_id ? (byId.get(e.user_id) ?? null) : null,
  }));
}
