import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAttachments,
  uploadAttachment,
  deleteAttachment,
} from "@/services/attachments";
import type { Attachment } from "@/types";

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => getAttachments(taskId),
  });
}

export function useUploadAttachment(boardId: string, taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAttachment(boardId, taskId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attachments", taskId] });
      toast.success("File attached");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAttachment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (att: Attachment) => deleteAttachment(att),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["attachments", taskId] }),
    onError: (e: Error) => toast.error(e.message),
  });
}
