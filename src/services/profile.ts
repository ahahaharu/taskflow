import { supabase } from "@/services/supabase";
import type { Profile } from "@/types";

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfileName(
  userId: string,
  name: string,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", userId);
  if (error) throw error;
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = data.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", userId);
  if (updateError) throw updateError;

  return url;
}
