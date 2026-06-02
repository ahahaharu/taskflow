import { supabase } from "@/services/supabase";
import type { Attachment } from "@/types";

const BUCKET = "attachments";

export async function getAttachments(taskId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function uploadAttachment(
  boardId: string,
  taskId: string,
  file: File,
): Promise<void> {
  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const path = `${boardId}/${taskId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from("attachments").insert({
    task_id: taskId,
    storage_path: path,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type || null,
  });
  if (insertError) throw insertError;
}

export async function getAttachmentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteAttachment(att: Attachment): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([att.storage_path]);
  if (storageError) throw storageError;

  const { error } = await supabase
    .from("attachments")
    .delete()
    .eq("id", att.id);
  if (error) throw error;
}
