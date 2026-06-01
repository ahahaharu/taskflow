import { useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
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
        className="group relative flex h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:shadow-sm"
      >
        <h3 className="font-semibold text-slate-900">{board.title}</h3>
        <span className="text-xs text-slate-400">
          {new Date(board.created_at).toLocaleDateString()}
        </span>
        {isOwner && (
          <button
            onClick={handleDeleteClick}
            className="absolute right-3 top-3 rounded-md p-1 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
            aria-label="Delete board"
          >
            ✕
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
