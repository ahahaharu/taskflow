import { useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Trash2 } from "lucide-react";
import type { Board } from "@/types";
import { useDeleteBoard } from "@/hooks/useBoards";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export function BoardCard({ board }: { board: Board }) {
  const deleteBoard = useDeleteBoard();
  const { user } = useAuth();
  const isOwner = user?.id === board.owner_id;
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDeleteClick(e: MouseEvent) {
    e.preventDefault();
    setConfirmOpen(true);
  }

  function handleConfirm() {
    deleteBoard.mutate(board.id, { onSuccess: () => setConfirmOpen(false) });
  }

  return (
    <>
      <Link
        to={`/boards/${board.id}`}
        className="group relative flex h-32 flex-col justify-between rounded-card border border-line bg-card p-4 transition duration-150 hover:border-line-strong hover:shadow-paper-hover"
      >
        <LayoutGrid
          size={16}
          strokeWidth={2}
          className="text-ink-muted"
          aria-hidden
        />
        <div>
          <h3 className="text-[15px] font-medium leading-tight text-ink">
            {board.title}
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            Created {new Date(board.created_at).toLocaleDateString()}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={handleDeleteClick}
            className="absolute right-2.5 top-2.5 rounded-control p-1.5 text-ink-muted opacity-0 transition-colors duration-150 hover:bg-prio-high-bg hover:text-prio-high-ink group-hover:opacity-100 focus-visible:opacity-100"
            aria-label="Delete board"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        )}
      </Link>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete board"
        message={`Delete board "${board.title}"? This cannot be undone.`}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
        loading={deleteBoard.isPending}
      />
    </>
  );
}
