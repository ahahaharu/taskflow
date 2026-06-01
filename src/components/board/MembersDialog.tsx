import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import {
  useBoardMembersDetailed,
  useInviteMember,
  useRemoveMember,
} from "@/hooks/useMembers";
import { useNavigate } from "react-router-dom";
import { useDeleteBoard } from "@/hooks/useBoards";

export function MembersDialog({
  boardId,
  ownerId,
  open,
  onClose,
}: {
  boardId: string;
  ownerId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { data: members, isLoading } = useBoardMembersDetailed(boardId);
  const invite = useInviteMember(boardId);
  const remove = useRemoveMember(boardId);
  const [email, setEmail] = useState("");
  const [confirmDeleteBoardOpen, setConfirmDeleteBoardOpen] = useState(false);

  const isOwner = user?.id === ownerId;

  function handleInvite() {
    const trimmed = email.trim();
    if (!trimmed) return;
    invite.mutate(trimmed, { onSuccess: () => setEmail("") });
  }

  const navigate = useNavigate();
  const deleteBoard = useDeleteBoard();

  function handleConfirmDeleteBoard() {
    deleteBoard.mutate(boardId, {
      onSuccess: () => {
        setConfirmDeleteBoardOpen(false);
        navigate("/");
      },
    });
  }

  return (
    <>
    <Modal open={open} onClose={onClose} title="Board members">
      <div className="flex flex-col gap-4">
        {isOwner && (
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              placeholder="Invite by email"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            <button
              onClick={handleInvite}
              disabled={invite.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {invite.isPending ? "…" : "Invite"}
            </button>
          </div>
        )}

        {isLoading && <p className="text-sm text-slate-400">Loading…</p>}

        <ul className="flex flex-col gap-2">
          {members?.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium text-slate-700">
                  {m.profile?.name?.trim() || "Unnamed"}
                </span>
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {m.role}
                </span>
              </div>
              {isOwner && m.role !== "owner" && (
                <button
                  onClick={() => remove.mutate(m.id)}
                  className="rounded p-1 text-slate-400 hover:text-red-600"
                  aria-label="Remove member"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>

        {!isOwner && (
          <p className="text-xs text-slate-400">
            Only the owner can manage members.
          </p>
        )}

        {isOwner && (
          <div className="mt-2 border-t border-slate-200 pt-4">
            <button
              onClick={() => setConfirmDeleteBoardOpen(true)}
              disabled={deleteBoard.isPending}
              className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleteBoard.isPending ? "Deleting…" : "Delete board"}
            </button>
          </div>
        )}
      </div>
    </Modal>
    <ConfirmDialog
      open={confirmDeleteBoardOpen}
      title="Delete board"
      message="Delete this board and all its data? This cannot be undone."
      onConfirm={handleConfirmDeleteBoard}
      onClose={() => setConfirmDeleteBoardOpen(false)}
      loading={deleteBoard.isPending}
    />
    </>
  );
}
