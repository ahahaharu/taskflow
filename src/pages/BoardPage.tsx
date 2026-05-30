import { useParams, Link } from "react-router-dom";
import { useColumns } from "@/hooks/useColumns";
import { useTasks } from "@/hooks/useTasks";
import { BoardView } from "@/components/board/BoardView";
import { Spinner } from "@/components/shared/Spinner";

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const columns = useColumns(boardId!);
  const tasks = useTasks(boardId!);

  if (columns.isLoading || tasks.isLoading) return <Spinner fullScreen />;
  if (columns.isError || tasks.isError)
    return <p className="p-6 text-red-600">Failed to load board.</p>;

  return (
    <div className="flex h-screen flex-col p-6">
      <Link to="/" className="mb-4 text-sm text-slate-500 hover:underline">
        ← Back to boards
      </Link>
      <BoardView
        boardId={boardId!}
        columns={columns.data ?? []}
        tasks={tasks.data ?? []}
      />
    </div>
  );
}
