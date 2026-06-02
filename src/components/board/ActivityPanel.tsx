import { X } from "lucide-react";
import { useActivity } from "@/hooks/useActivity";
import { Avatar } from "@/components/shared/Avatar";
import type { ActivityWithUser } from "@/services/activity";

function describe(e: ActivityWithUser): string {
  switch (e.action) {
    case "created":
      return `created "${e.task_title}" in ${e.to_column}`;
    case "moved":
      return `moved "${e.task_title}" from ${e.from_column} to ${e.to_column}`;
    case "deleted":
      return `deleted "${e.task_title}"`;
    default:
      return e.action;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function ActivityPanel({
  boardId,
  open,
  onClose,
}: {
  boardId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { data: events, isLoading } = useActivity(boardId);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/20"
      onClick={onClose}
    >
      <aside
        className="h-full w-full max-w-sm overflow-y-auto bg-paper p-5 shadow-paper-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Activity
          </h2>
          <button
            onClick={onClose}
            className="rounded-control p-1 text-ink-2 hover:bg-surface-2 hover:text-ink"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
        {events && events.length === 0 && (
          <p className="text-sm text-ink-muted">No activity yet.</p>
        )}

        <ul className="flex flex-col gap-3">
          {events?.map((e) => (
            <li key={e.id} className="flex gap-2.5 text-sm">
              <Avatar name={e.user?.name} url={e.user?.avatar_url} size="sm" />
              <div className="min-w-0">
                <span className="text-ink">
                  <span className="font-medium">
                    {e.user?.name?.trim() || "Someone"}
                  </span>{" "}
                  {describe(e)}
                </span>
                <p className="text-xs text-ink-muted">
                  {timeAgo(e.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
