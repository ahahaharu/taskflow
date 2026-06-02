import { useRef } from "react";
import { Paperclip, Download, Trash2, FileText } from "lucide-react";
import {
  useAttachments,
  useUploadAttachment,
  useDeleteAttachment,
} from "@/hooks/useAttachments";
import { getAttachmentUrl } from "@/services/attachments";
import { useAuth } from "@/hooks/useAuth";
import type { Attachment } from "@/types";
import toast from "react-hot-toast";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Attachments({
  boardId,
  taskId,
}: {
  boardId: string;
  taskId: string;
}) {
  const { user } = useAuth();
  const { data: files, isLoading } = useAttachments(taskId);
  const upload = useUploadAttachment(boardId, taskId);
  const remove = useDeleteAttachment(taskId);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload.mutate(file);
    e.target.value = "";
  }

  async function handleDownload(att: Attachment) {
    try {
      const url = await getAttachmentUrl(att.storage_path);
      window.open(url, "_blank", "noopener");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to open file");
    }
  }

  return (
    <div className="border-t border-line pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Attachments
        </h3>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className="flex items-center gap-1.5 rounded-control px-2 py-1 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink disabled:opacity-50"
        >
          <Paperclip size={14} strokeWidth={2} />
          {upload.isPending ? "Uploading…" : "Attach"}
        </button>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
      {files && files.length === 0 && (
        <p className="text-sm text-ink-muted">No attachments.</p>
      )}

      <ul className="flex flex-col gap-1.5">
        {files?.map((att) => (
          <li
            key={att.id}
            className="group flex items-center gap-2 rounded-control border border-line bg-card px-3 py-2 text-sm"
          >
            <FileText
              size={15}
              strokeWidth={2}
              className="shrink-0 text-ink-muted"
            />
            <span
              className="min-w-0 flex-1 truncate text-ink"
              title={att.file_name}
            >
              {att.file_name}
            </span>
            <span className="shrink-0 text-xs text-ink-muted">
              {formatSize(att.file_size)}
            </span>
            <button
              onClick={() => handleDownload(att)}
              className="shrink-0 rounded p-1 text-ink-muted transition-colors hover:text-ink"
              aria-label="Download"
            >
              <Download size={14} strokeWidth={2} />
            </button>
            {att.uploaded_by === user?.id && (
              <button
                onClick={() => remove.mutate(att)}
                className="shrink-0 rounded p-1 text-ink-muted opacity-0 transition hover:text-prio-high-ink group-hover:opacity-100"
                aria-label="Delete attachment"
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
