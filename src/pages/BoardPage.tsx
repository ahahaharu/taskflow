import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Users } from "lucide-react";
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
    return (
      <p className="p-6 text-sm text-prio-high-ink">Failed to load board.</p>
    );

  return (
    <div className="flex h-dvh flex-col bg-paper">
      <header className="border-b border-line bg-paper px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              aria-label="Back to boards"
              className="flex h-9 w-9 items-center justify-center rounded-control text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </Link>
            <h1 className="truncate font-serif text-xl font-semibold tracking-tight text-ink">
              {board.data?.title}
            </h1>
          </div>
          <button
            onClick={() => setMembersOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-control px-3 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
          >
            <Users size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Members</span>
          </button>
        </div>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6">
        <BoardView
          boardId={boardId!}
          columns={columns.data ?? []}
          tasks={tasks.data ?? []}
        />
      </div>
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
