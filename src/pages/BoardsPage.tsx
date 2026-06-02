import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { signOut } from "@/services/auth";
import { useBoards } from "@/hooks/useBoards";
import { BoardCard } from "@/components/board/BoardCard";
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog";
import { Spinner } from "@/components/shared/Spinner";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function BoardsPage() {
  const { data: boards, isLoading, isError } = useBoards();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="font-serif text-xl font-semibold tracking-tight text-ink">
            TaskFlow
          </h1>
          <nav className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/profile"
              className="flex items-center gap-1.5 rounded-control px-3 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
            >
              <User size={15} strokeWidth={2} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 rounded-control px-3 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
            >
              <LogOut size={15} strokeWidth={2} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">
              Your boards
            </h2>
            <p className="mt-1 text-sm text-ink-2">
              A quiet place for each project.
            </p>
          </div>
          <CreateBoardDialog />
        </div>

        {isLoading && <Spinner />}
        {isError && (
          <p className="text-sm text-prio-high-ink">Failed to load boards.</p>
        )}

        {boards && boards.length === 0 && (
          <div className="rounded-card border border-dashed border-line bg-card/40 px-6 py-16 text-center">
            <p className="text-sm text-ink-2">
              No boards yet. Create your first one.
            </p>
          </div>
        )}

        {boards && boards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
