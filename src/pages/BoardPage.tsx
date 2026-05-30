import { useParams, Link } from "react-router-dom";
import { useBoard } from "@/hooks/useBoards";
import { useColumns } from "@/hooks/useColumns";
import { useTasks } from "@/hooks/useTasks";
import { BoardView } from "@/components/board/BoardView";
import { Spinner } from "@/components/shared/Spinner";

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const board = useBoard(boardId!);
  const columns = useColumns(boardId!);
  const tasks = useTasks(boardId!);

  if (board.isLoading || columns.isLoading || tasks.isLoading)
    return <Spinner fullScreen />;
  if (board.isError || columns.isError || tasks.isError)
    return <p className="p-6 text-red-600">Failed to load board.</p>;

  return (
    <div className="flex h-[100dvh] flex-col p-4 sm:p-6">
      <div className="mb-4">
        <Link to="/" className="text-sm text-slate-500 hover:underline">
          ← Back to boards
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {board.data?.title}
        </h1>
      </div>
      <BoardView
        boardId={boardId!}
        columns={columns.data ?? []}
        tasks={tasks.data ?? []}
      />
    </div>
  );
}
