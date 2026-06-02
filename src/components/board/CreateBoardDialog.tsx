import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";
import { useCreateBoard } from "@/hooks/useBoards";

export function CreateBoardDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const createBoard = useCreateBoard();

  function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) return;
    createBoard.mutate(trimmed, {
      onSuccess: () => {
        setTitle("");
        setOpen(false);
      },
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-control bg-accent px-3.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
      >
        <Plus size={15} strokeWidth={2.25} />
        New board
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Create board">
        <input
          autoFocus
          type="text"
          placeholder="Board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          disabled={createBoard.isPending}
          className="w-full rounded-control border border-line bg-card px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors duration-150 focus:border-line-strong focus:ring-2 focus:ring-accent/15 disabled:opacity-50"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-control px-4 py-2 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createBoard.isPending}
            className="flex items-center gap-1.5 rounded-control bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
          >
            {createBoard.isPending && <ButtonSpinner />}
            {createBoard.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
}
