import { supabase } from "@/services/supabase";
import type { Profile } from "@/types";
import type { BoardRole } from "@/types";

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

export interface BoardMember {
  id: string;
  user_id: string;
  role: BoardRole;
  profile: Profile | null;
}

export async function getBoardMembersDetailed(
  boardId: string,
): Promise<BoardMember[]> {
  const { data: rows, error } = await supabase
    .from("board_members")
    .select("id, user_id, role")
    .eq("board_id", boardId);
  if (error) throw error;

  const ids = (rows ?? []).map((r) => r.user_id);
  if (ids.length === 0) return [];

  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", ids);
  if (pErr) throw pErr;

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return (rows ?? []).map((r) => ({
    id: r.id,
    user_id: r.user_id,
    role: r.role as BoardRole,
    profile: byId.get(r.user_id) ?? null,
  }));
}

export type InviteResult =
  | "ok"
  | "not_owner"
  | "user_not_found"
  | "already_member";

export async function inviteMember(
  boardId: string,
  email: string,
): Promise<InviteResult> {
  const { data, error } = await supabase.rpc("invite_member", {
    _board_id: boardId,
    _email: email.trim(),
  });
  if (error) throw error;
  return data as InviteResult;
}

export async function removeMember(memberRowId: string): Promise<void> {
  const { error } = await supabase
    .from("board_members")
    .delete()
    .eq("id", memberRowId);
  if (error) throw error;
}
