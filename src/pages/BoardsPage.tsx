import { signOut } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { useBoards } from "@/hooks/useBoards";
import { BoardCard } from "@/components/board/BoardCard";
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog";
import { Spinner } from "@/components/shared/Spinner";
import { Link } from "react-router-dom";

export function BoardsPage() {
  const { user } = useAuth();
  const { data: boards, isLoading, isError } = useBoards();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My boards</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <CreateBoardDialog />
          <button
            onClick={() => signOut()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            Sign out
          </button>
          <Link
            to="/profile"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            Profile
          </Link>
        </div>
      </header>

      {isLoading && <Spinner />}
      {isError && <p className="text-red-600">Failed to load boards.</p>}

      {boards && boards.length === 0 && (
        <p className="text-slate-500">No boards yet. Create your first one.</p>
      )}

      {boards && boards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}
