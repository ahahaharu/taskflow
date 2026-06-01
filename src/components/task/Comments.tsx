import { useState } from "react";
import {
  useComments,
  useAddComment,
  useDeleteComment,
} from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeComments } from "@/hooks/useRealtimeComments";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString();
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
    <div className="border-t border-slate-200 pt-4">
      <h3 className="mb-3 text-xs font-medium text-slate-500">Comments</h3>

      {isLoading && <p className="text-sm text-slate-400">Loading…</p>}

      <div className="mb-3 flex max-h-48 flex-col gap-3 overflow-y-auto">
        {comments && comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet.</p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="group flex gap-2 text-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">
                  {c.author?.name?.trim() || "Unnamed"}
                </span>
                <span className="text-xs text-slate-400">
                  {formatTime(c.created_at)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-slate-600">{c.content}</p>
            </div>
            {c.user_id === user?.id && (
              <button
                onClick={() => deleteComment.mutate(c.id)}
                className="shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                aria-label="Delete comment"
              >
                ✕
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
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <button
          onClick={handleAdd}
          disabled={addComment.isPending}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
