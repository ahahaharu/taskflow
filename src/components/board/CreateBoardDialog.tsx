import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
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
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createBoard.isPending}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {createBoard.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
}
