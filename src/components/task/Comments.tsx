import { useState } from "react";
import { Trash2, Send } from "lucide-react";
import {
  useComments,
  useAddComment,
  useDeleteComment,
} from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeComments } from "@/hooks/useRealtimeComments";
import { Avatar } from "@/components/shared/Avatar";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Comments({ taskId }: { taskId: string }) {
  useRealtimeComments(taskId);
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(taskId);
  const addComment = useAddComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [text, setText] = useState("");

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment.mutate(trimmed, { onSuccess: () => setText("") });
  }

  return (
    <div className="border-t border-line pt-4">
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-ink-muted">
        Comments
      </h3>

      {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}

      <div className="mb-4 flex max-h-56 flex-col gap-4 overflow-y-auto pr-1">
        {comments && comments.length === 0 && (
          <p className="text-sm text-ink-muted">No comments yet.</p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="group flex gap-2.5 text-sm">
            <Avatar
              name={c.author?.name}
              url={c.author?.avatar_url}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">
                  {c.author?.name?.trim() || "Unnamed"}
                </span>
                <span className="text-xs text-ink-muted">
                  {formatTime(c.created_at)}
                </span>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap leading-relaxed text-ink-2">
                {c.content}
              </p>
            </div>
            {c.user_id === user?.id && (
              <button
                onClick={() => deleteComment.mutate(c.id)}
                className="h-7 shrink-0 rounded p-1 text-ink-muted opacity-0 transition-colors duration-150 hover:text-prio-high-ink group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Delete comment"
              >
                <Trash2 size={13} strokeWidth={2} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Write a comment…"
          className="flex-1 rounded-control border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors duration-150 focus:border-line-strong focus:ring-2 focus:ring-accent/15"
        />
        <button
          onClick={handleAdd}
          disabled={addComment.isPending || !text.trim()}
          className="flex items-center gap-1.5 rounded-control bg-accent px-3 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
          aria-label="Send"
        >
          <Send size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
