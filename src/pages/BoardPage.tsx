import { useParams, Link } from "react-router-dom";
import { useBoard } from "@/hooks/useBoards";
import { useColumns } from "@/hooks/useColumns";
import { useTasks } from "@/hooks/useTasks";
import { BoardView } from "@/components/board/BoardView";
import { Spinner } from "@/components/shared/Spinner";
import { useRealtimeBoard } from "@/hooks/useRealtimeBoard";
import { useState } from "react";
import { MembersDialog } from "@/components/board/MembersDialog";

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const board = useBoard(boardId!);
  const columns = useColumns(boardId!);
  const tasks = useTasks(boardId!);

  useRealtimeBoard(boardId!);

  const [membersOpen, setMembersOpen] = useState(false);

  if (board.isLoading || columns.isLoading || tasks.isLoading)
    return <Spinner fullScreen />;
  if (board.isError || columns.isError || tasks.isError)
    return <p className="p-6 text-red-600">Failed to load board.</p>;

  return (
    <div className="flex h-dvh flex-col p-4 sm:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Link to="/" className="text-sm text-slate-500 hover:underline">
            ← Back to boards
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {board.data?.title}
          </h1>
        </div>
        <button
          onClick={() => setMembersOpen(true)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
        >
          Members
        </button>
      </div>
      <BoardView
        boardId={boardId!}
        columns={columns.data ?? []}
        tasks={tasks.data ?? []}
      />
      {board.data && (
        <MembersDialog
          boardId={boardId!}
          ownerId={board.data.owner_id}
          open={membersOpen}
          onClose={() => setMembersOpen(false)}
        />
      )}
    </div>
  );
}
