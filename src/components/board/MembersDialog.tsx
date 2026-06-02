import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Avatar } from "@/components/shared/Avatar";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";
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
        <div className="flex flex-col gap-5">
          {isOwner && (
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-ink-muted">
                Invite
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserPlus
                    size={14}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    disabled={invite.isPending}
                    placeholder="someone@example.com"
                    className="w-full rounded-control border border-line bg-card pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors duration-150 focus:border-line-strong focus:ring-2 focus:ring-accent/15 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleInvite}
                  disabled={invite.isPending}
                  className="flex items-center gap-1.5 rounded-control bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
                >
                  {invite.isPending && <ButtonSpinner />}
                  {invite.isPending ? "Inviting…" : "Invite"}
                </button>
              </div>
            </div>
          )}

          <div>
            <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-ink-muted">
              Members
            </span>
            {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
            <ul className="flex flex-col">
              {members?.map((m, i) => {
                const isOwnerRole = m.role === "owner";
                return (
                  <li
                    key={m.id}
                    className={`group flex items-center justify-between gap-3 py-2.5 text-sm ${i > 0 ? "border-t border-line" : ""}`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar
                        name={m.profile?.name}
                        url={m.profile?.avatar_url}
                        size="md"
                      />
                      <span className="truncate font-medium text-ink">
                        {m.profile?.name?.trim() || "Unnamed"}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                          isOwnerRole
                            ? "bg-[#f4ead8] text-accent-hover"
                            : "bg-surface-2 text-ink-2"
                        }`}
                      >
                        {m.role}
                      </span>
                    </div>
                    {isOwner &&
                      !isOwnerRole &&
                      (remove.isPending && remove.variables === m.id ? (
                        <span className="flex shrink-0 items-center p-1.5 text-ink-muted">
                          <ButtonSpinner />
                        </span>
                      ) : (
                        <button
                          onClick={() => remove.mutate(m.id)}
                          disabled={remove.isPending}
                          className="shrink-0 rounded-control p-1.5 text-ink-muted opacity-0 transition-colors duration-150 hover:bg-prio-high-bg hover:text-prio-high-ink group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-50"
                          aria-label="Remove member"
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      ))}
                  </li>
                );
              })}
            </ul>
          </div>

          {!isOwner && (
            <p className="text-xs text-ink-muted">
              Only the owner can manage members.
            </p>
          )}

          {isOwner && (
            <div className="mt-2 border-t border-line pt-5">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-ink-muted">
                Danger zone
              </p>
              <button
                onClick={() => setConfirmDeleteBoardOpen(true)}
                disabled={deleteBoard.isPending}
                className="flex w-full items-center justify-center gap-1.5 rounded-control border border-prio-high-bg px-4 py-2 text-sm font-medium text-prio-high-ink transition-colors duration-150 hover:bg-prio-high-bg disabled:opacity-50"
              >
                {deleteBoard.isPending && <ButtonSpinner />}
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
